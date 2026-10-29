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

interface CheckoutRequest {
  items: CartItem[]
  preorderPaymentChoice?: 'zero_down' | 'pay_full'
  shippingMethod?: 'standard' | 'white_glove'
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
    const {
      items,
      preorderPaymentChoice = 'pay_full',
      shippingMethod = 'standard',
    }: CheckoutRequest = await request.json()

    if (!Array.isArray(items) || !items.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }
    if (!['zero_down', 'pay_full'].includes(preorderPaymentChoice) ||
        !['standard', 'white_glove'].includes(shippingMethod)) {
      return NextResponse.json({ error: 'Invalid checkout option' }, { status: 400 })
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
      .select('id, name, slug, price, color, image_urls, stock, active, preorder')
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
      // Pre-order items are handcrafted made-to-order in the Dallas atelier and do not require in-stock inventory
      if (!product.preorder && product.stock !== null && product.stock < qty) {
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

    const hasPreorders = [...quantities.keys()].some((id) => productMap.get(id)?.preorder)
    const hasInStock = [...quantities.keys()].some((id) => !productMap.get(id)?.preorder)
    const isSplitPreorder = hasPreorders && hasInStock && preorderPaymentChoice === 'zero_down'
    const preorderSubtotalCents = [...quantities.entries()].reduce((sum, [productId, qty]) => {
      const product = productMap.get(productId)!
      return sum + (product.preorder ? Math.round(product.price * 100) * qty : 0)
    }, 0)
    const preorderBalanceCents = preorderSubtotalCents + Math.round(preorderSubtotalCents * 0.0825)
    const fullSubtotalCents = [...quantities.entries()].reduce(
      (sum, [productId, qty]) => sum + Math.round(productMap.get(productId)!.price * 100) * qty,
      0,
    )
    const inStockSubtotalCents = [...quantities.entries()].reduce((sum, [productId, qty]) => {
      const product = productMap.get(productId)!
      return sum + (!product.preorder ? Math.round(product.price * 100) * qty : 0)
    }, 0)

    // Persist the line items from DB-verified data so the dashboard,
    // emails, and packing workflow know what the order contains.
    const { error: itemsError } = await supabase.from('order_items').insert(
      [...quantities.entries()].map(([productId, qty]) => {
        const product = productMap.get(productId)!
        return {
          order_id: order.id,
          product_id: productId,
          name: product.name + (product.preorder ? ' [Pre-Order Allocation]' : ''),
          product_name: product.name,
          color: product.color || '',
          price: product.price,
          quantity: qty,
        }
      }),
    )
    if (itemsError) {
      console.error('Order items error:', itemsError)
      await supabase.from('orders').delete().eq('id', order.id)
      return NextResponse.json({ error: 'Failed to save order items' }, { status: 500 })
    }

    try {
      // Build Stripe Checkout line items from DB-verified prices (dollars → cents)
      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
        [...quantities.entries()]
          .filter(([productId]) => {
            const product = productMap.get(productId)!
            return !isSplitPreorder || !product.preorder
          })
          .map(([productId, qty]) => {
          const product = productMap.get(productId)!
          const image = product.image_urls?.[0]
          const isPreorder = Boolean(product.preorder)
          const descParts: string[] = []
          if (product.color) descParts.push(product.color)
          if (isPreorder) descParts.push('Dallas Atelier Pre-Order Allocation · Made to Order (Est. Dispatch 3-4 Weeks)')

          return {
            price_data: {
              currency: 'usd',
              product_data: {
                name: product.name + (isPreorder ? ' [Pre-Order Allocation]' : ''),
                description: descParts.length > 0 ? descParts.join(' · ') : undefined,
                images: image
                  ? [image.startsWith('http') ? image : `${SITE_ORIGIN}${image}`]
                  : undefined,
                metadata: {
                  productId,
                  slug: product.slug,
                  preorder: isPreorder ? 'true' : 'false',
                },
              },
              unit_amount: Math.round(product.price * 100),
            },
            quantity: qty,
          }
        })

      const shippingCents = shippingMethod === 'white_glove'
        ? 2500
        : fullSubtotalCents >= FREE_SHIPPING_THRESHOLD * 100 ? 0 : STANDARD_SHIPPING_CENTS

      if (shippingCents > 0) {
        lineItems.push({
          price_data: {
            currency: 'usd',
            product_data: {
              name: shippingMethod === 'white_glove' ? 'White-Glove Priority Shipping' : 'Standard Shipping',
              description: shippingMethod === 'white_glove' ? 'Priority atelier dispatch' : '5–7 business days',
            },
            unit_amount: shippingCents,
          },
          quantity: 1,
        })
      }

      // Estimated total recorded on the order (dollars). Stripe Tax may
      // adjust the final tax at checkout; the charge itself is authoritative.
      const chargedSubtotalCents = isSplitPreorder ? inStockSubtotalCents : fullSubtotalCents
      const tax = Math.round(chargedSubtotalCents / 100 * 0.0825)
      const shippingDollars = shippingCents / 100

      const orderUpdate = await supabase
        .from('orders')
        .update({
          total: Math.round(chargedSubtotalCents / 100 + shippingDollars + tax),
          shipping_address: isSplitPreorder
            ? {
                preorder_reservation: true,
                reservation_type: 'split_pay_instock',
                preorder_balance_due: preorderBalanceCents / 100,
                estimated_dispatch: '3–4 Weeks from Dallas Atelier',
              }
            : {},
          notes: hasPreorders
            ? isSplitPreorder
              ? `Split payment: in-stock items charged today; pre-order balance of $${(preorderBalanceCents / 100).toFixed(2)} due at dispatch.`
              : 'Stripe Checkout Order (Includes Dallas Atelier Pre-Order Allocation - Ships in 3-4 Weeks)'
            : 'Standard in-stock order',
        })
        .eq('id', order.id)
      if (orderUpdate.error) {
        throw orderUpdate.error
      }

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
        success_url: `${SITE_ORIGIN}/checkout/success?${isSplitPreorder ? 'type=split_preorder&' : ''}session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${SITE_ORIGIN}/bag`,
        metadata: {
          order_id: order.id,
          has_preorders: hasPreorders ? 'true' : 'false',
          split_preorder: isSplitPreorder ? 'true' : 'false',
          preorder_balance_cents: isSplitPreorder ? String(preorderBalanceCents) : '0',
          shipping_method: shippingMethod,
          items: [...quantities.entries()]
            .map(([productId, qty]) => `${productMap.get(productId)!.name}${productMap.get(productId)!.preorder ? ' (Pre-Order)' : ''} x${qty}`)
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
