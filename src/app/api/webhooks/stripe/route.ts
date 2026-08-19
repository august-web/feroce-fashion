import { NextRequest, NextResponse } from 'next/server'

/**
 * Stripe Webhook Handler
 *
 * In production:
 * 1. Verify the webhook signature using STRIPE_SECRET_KEY
 * 2. Handle checkout.session.completed event
 * 3. Create order + order_items in Supabase
 * 4. Send confirmation email via Resend
 *
 * Never mark an order as paid from the client — only from this webhook.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const sig = request.headers.get('stripe-signature')

    if (!sig) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    // In production:
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    // const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
    //
    // if (event.type === 'checkout.session.completed') {
    //   const session = event.data.object
    //   // Create order in Supabase
    //   // Send confirmation email via Resend
    // }

    console.log('Stripe webhook received (mock)')

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Stripe webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 },
    )
  }
}
