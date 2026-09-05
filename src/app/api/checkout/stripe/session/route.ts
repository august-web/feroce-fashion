import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { typescript: true })

interface CartItem {
  productId: string
  name: string
  slug: string
  price: number
  image: string
  color: string
  quantity: number
}

// Prices are stored and displayed in DOLLARS (e.g. 350 = $350.00).
// Stripe expects amounts in CENTS, so every amount sent to Stripe is
// converted here at the boundary. Free shipping over $200.
const FREE_SHIPPING_THRESHOLD = 200
const STANDARD_SHIPPING_CENTS = 1500

/**
 * POST /api/checkout/stripe/session
 * Creates the order in our database (status: pending), then creates a
 * Stripe Checkout Session with order_id in metadata so the webhook can
 * mark it paid. Returns the Stripe Checkout URL for redirect.
 */
export async function POST(request: NextRequest) {
  try {
    const { items }: { items: CartItem[] } = await request.json()

    if (!items?.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    const origin = request.headers.get('origin') || 'https://www.ferocefashionff.com'

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

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

    // Persist the line items so the dashboard, emails, and packing
    // workflow know what the order contains.
    const { error: itemsError } = await supabase.from('order_items').insert(
      items.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        name: item.name,
        product_name: item.name,
        color: item.color,
        price: item.price,
        quantity: item.quantity,
      })),
    )
    if (itemsError) {
      console.error('Order items error:', itemsError)
    }

    try {
      // Build Stripe Checkout line items from cart (dollars → cents)
      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            description: item.color ? `${item.color}` : undefined,
            images: item.image ? [item.image.startsWith('http') ? item.image : `${origin}${item.image}`] : undefined,
            metadata: {
              productId: item.productId,
              slug: item.slug,
            },
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }))

      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
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

      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: lineItems,
        shipping_address_collection: {
          allowed_countries: ['US'],
        },
        phone_number_collection: {
          enabled: false,
        },
        automatic_tax: { enabled: true },
        success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/bag`,
        metadata: {
          order_id: order.id,
          items: items.map((i) => `${i.name} x${i.quantity}`).join(', '),
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
