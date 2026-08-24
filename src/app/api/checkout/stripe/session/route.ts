import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

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

/**
 * POST /api/checkout/stripe/session
 * Creates a Stripe Checkout Session with cart items as line items.
 * Returns the Stripe Checkout URL for redirect.
 */
export async function POST(request: NextRequest) {
  try {
    const { items }: { items: CartItem[] } = await request.json()

    if (!items?.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    const origin = request.headers.get('origin') || 'https://www.ferocefashionff.com'

    // Build Stripe Checkout line items from cart
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
        unit_amount: item.price,
      },
      quantity: item.quantity,
    }))

    // Calculate shipping
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const freeShipping = subtotal >= 20000

    if (!freeShipping) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Standard Shipping',
            description: '5–7 business days',
          },
          unit_amount: 1500,
        },
        quantity: 1,
      })
    }

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
        items: items.map((i) => `${i.name} x${i.quantity}`).join(', '),
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe Checkout Session error:', error)
    const message = error instanceof Error ? error.message : 'Failed to create checkout session'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
