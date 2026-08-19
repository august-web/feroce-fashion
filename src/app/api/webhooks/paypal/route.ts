import { NextRequest, NextResponse } from 'next/server'

/**
 * PayPal Webhook Handler
 *
 * In production:
 * 1. Verify the webhook signature using PAYPAL_WEBHOOK_ID
 * 2. Handle PAYMENT.CAPTURE.COMPLETED event
 * 3. Create order + order_items in Supabase
 * 4. Send confirmation email via Resend
 *
 * Never mark an order as paid from the client — only from this webhook.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // In production:
    // Verify webhook signature:
    // const webhookId = process.env.PAYPAL_WEBHOOK_ID
    // const transmissionId = request.headers.get('paypal-transmission-id')
    // const timestamp = request.headers.get('paypal-transmission-time')
    // const certUrl = request.headers.get('paypal-cert-url')
    // const actualSig = request.headers.get('paypal-transmission-sig')
    // Verify the signature matches...
    //
    // if (body.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
    //   const capture = body.resource
    //   // Create order in Supabase using capture.id as paypal_order_id
    //   // Send confirmation email via Resend
    // }

    console.log('PayPal webhook received (mock):', body.event_type)

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('PayPal webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 },
    )
  }
}
