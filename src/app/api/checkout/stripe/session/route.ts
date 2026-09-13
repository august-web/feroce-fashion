import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { getStripe } from '@/lib/stripe'

// The client only sends productId + quantity (+ optional color preference).
// Names, slugs, images, and especially PRICES are always resolved from the
// products table server-side — never trust client-supplied prices.
interface CartItem {
  productId: string
  quantity: number
  color?: string
}

// Prices are stored and displayed in DOLLARS (e.g. 350 = $350.00).
// Stripe expects amounts in CENTS, so every amount sent to Stripe is
// converted here at the boundary. Free shipping over $200.
const FREE_SHIPPING_THRESHOLD = 200
const STANDARD_SHIPPING_CENTS = 1500
const SITE_ORIGIN = 'https://www.ferocefashionff.com'

/**
 * POST /api/checkout/stripe/session
 * Creates the order in our database (status: pending), then creates a
 * Stripe Checkout Session with order_id in metadata so the webhook can
 * mark it paid. Returns the Stripe Checkout URL for redirect.
 */
export async function POST(request: NextRequest) {
  try {
    const { items }: { items: CartItem[] } = await request.json()

    if (!Array.isArray(items) || !items.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    // Merge duplicate product lines and validate quantities up front.
    const quantities = new Map<string, number>()
    for (const item of items) {
      const qty = Number(item?.quantity)
      if (!item?.productId || !Number.isInteger(qty) || qty < 1 || qty > 99) {
        return NextResponse.json({ error: 'Invalid cart item' }, { status: 400 })
      }
      quantities.set(item.productId, (quantities.get(item.productId) || 0) + qty)
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    // Resolve authoritative product data (price, name, stock) from the DB.
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, slug, price, color, image_urls, stock, active')
      .in('id', [...quantities.keys()])

    if (productsError || !products) {
      console.error('Product lookup error:', productsError)
      return NextResponse.json({ error: 'Failed to verify cart products' }, { status: 500 })
    }

    const productMap = new Map(products.map((p) => [p.id, p]))
    for (const [productId, qty] of quantities) {
      const product = productMap.get(productId)
      if (!product || !product.active) {
        return NextResponse.json({ error: 'A product in your bag is no longer available' }, { status: 400 })
      }
      if (product.stock !== null && product.stock < qty) {
        return NextResponse.json({ error: `Not enough stock for ${product.name}` }, { status: 409 })
      }
    }

    // Create the order first (pending) so the webhook can find it.
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: null,
        payment_method: 'card',
        payment_provider: 'stripe',
        total: 0,
        status: 'pending',
        shipping_address: {},
      })
      .select('id')
      .single()

    if (orderError || !order) {
      console.error('Order creation error:', orderError)
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }

    // Persist the line items from DB-verified data so the dashboard,
    // emails, and packing workflow know what the order contains.
    const { error: itemsError } = await supabase.from('order_items').insert(
      [...quantities.entries()].map(([productId, qty]) => {
        const product = productMap.get(productId)!
        return {
          order_id: order.id,
          product_id: productId,
          name: product.name,
          product_name: product.name,
          color: product.color || '',
          price: product.price,
          quantity: qty,
        }
      }),
    )
    if (itemsError) {
      console.error('Order items error:', itemsError)
    }

    try {
      // Build Stripe Checkout line items from DB-verified prices (dollars → cents)
      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
        [...quantities.entries()].map(([productId, qty]) => {
          const product = productMap.get(productId)!
          const image = product.image_urls?.[0]
          return {
            price_data: {
              currency: 'usd',
              product_data: {
                name: product.name,
                description: product.color || undefined,
                images: image
                  ? [image.startsWith('http') ? image : `${SITE_ORIGIN}${image}`]
                  : undefined,
                metadata: {
                  productId,
                  slug: product.slug,
                },
              },
              unit_amount: Math.round(product.price * 100),
            },
            quantity: qty,
          }
        })

      const subtotal = [...quantities.entries()].reduce(
        (sum, [productId, qty]) => sum + productMap.get(productId)!.price * qty,
        0,
      )
      const shippingCents = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_CENTS

      if (shippingCents > 0) {
        lineItems.push({
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Standard Shipping',
              description: '5–7 business days',
            },
            unit_amount: shippingCents,
          },
          quantity: 1,
        })
      }

      // Estimated total recorded on the order (dollars). Stripe Tax may
      // adjust the final tax at checkout; the charge itself is authoritative.
      const tax = Math.round(subtotal * 0.0825)
      const shippingDollars = shippingCents / 100

      await supabase
        .from('orders')
        .update({ total: Math.round(subtotal + shippingDollars + tax) })
        .eq('id', order.id)

      const session = await getStripe().checkout.sessions.create({
        mode: 'payment',
        line_items: lineItems,
        shipping_address_collection: {
          allowed_countries: ['US'],
        },
        phone_number_collection: {
          enabled: false,
        },
        automatic_tax: { enabled: true },
        success_url: `${SITE_ORIGIN}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${SITE_ORIGIN}/bag`,
        metadata: {
          order_id: order.id,
          items: [...quantities.entries()]
            .map(([productId, qty]) => `${productMap.get(productId)!.name} x${qty}`)
            .join(', '),
        },
      })

      // Link the session so /checkout/success can look the order up.
      await supabase
        .from('orders')
        .update({ stripe_session_id: session.id })
        .eq('id', order.id)

      return NextResponse.json({ url: session.url })
    } catch (sessionError) {
      // Don't leave a dangling pending order if Stripe rejects the session.
      await supabase.from('orders').delete().eq('id', order.id)
      throw sessionError
    }
  } catch (error) {
    console.error('Stripe Checkout Session error:', error)
    const message = error instanceof Error ? error.message : 'Failed to create checkout session'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
