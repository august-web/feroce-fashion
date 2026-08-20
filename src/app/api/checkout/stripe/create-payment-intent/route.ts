import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
})

interface PaymentIntentRequest {
  amount: number // in cents
  email: string
  items: Array<{ productId: string; name: string; price: number; quantity: number; color: string }>
  shippingAddress: {
    name: string
    address: string
    apartment: string
    city: string
    state: string
    zip: string
    country: string
    phone: string
  }
  shippingMethod: string
}

/**
 * POST /api/checkout/stripe/create-payment-intent
 * Creates a Stripe PaymentIntent and returns the client secret.
 * The order is NOT created yet — it's created after payment succeeds
 * via the webhook (or confirmation callback).
 */
export async function POST(request: NextRequest) {
  try {
    const body: PaymentIntentRequest = await request.json()
    const { amount, email, items, shippingAddress, shippingMethod } = body

    if (!amount || amount < 50) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }



    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      ...(email ? { receipt_email: email } : {}),
      metadata: {
        email,
        shipping_name: shippingAddress.name,
        shipping_address: `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zip}`,
        shipping_method: shippingMethod,
        // Store item names for webhook reference
        items: items.map((i) => `${i.name} x${i.quantity}`).join(', '),
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error('PaymentIntent creation error:', error)

    const message = error instanceof Error ? error.message : 'Failed to create payment'

    // Handle Stripe configuration errors gracefully
    if (message.includes('Invalid API Key') || message.includes('api_key')) {
      return NextResponse.json(
        { error: 'Payment system not configured. Please contact support.' },
        { status: 500 },
      )
    }

    return NextResponse.json(
      { error: 'Failed to initialize payment. Please try again.' },
      { status: 500 },
    )
  }
}
