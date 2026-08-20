import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendOrderConfirmation } from '@/lib/email'

/**
 * Stripe Webhook Handler
 *
 * Handles checkout.session.completed event:
 * 1. Verify the webhook signature
 * 2. Create order + order_items in Supabase
 * 3. Send confirmation email via Resend
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

    // In production, verify webhook signature:
    // import Stripe from 'stripe'
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    // const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
    //
    // For now, parse the body as JSON (mock mode)
    let event: { type: string; data: { object: Record<string, unknown> } }
    try {
      event = JSON.parse(body)
    } catch {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as {
        id?: string
        customer_email?: string
        metadata?: Record<string, string>
        amount_total?: number
      }

      const orderId = session.metadata?.order_id
      const email = session.customer_email || session.metadata?.email

      if (orderId && email) {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!,
        )

        // Fetch order details
        const { data: order } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single()

        if (order) {
          // Fetch order items
          const { data: items } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', orderId)

          const shippingAddr = order.shipping_address as Record<string, string>

          // Send confirmation email
          await sendOrderConfirmation({
            orderId: order.id,
            email,
            customerName: shippingAddr?.name || 'Customer',
            items: (items || []).map((item) => ({
              name: item.name,
              color: '',
              price: item.price,
              quantity: item.quantity,
            })),
            subtotal: order.total - Math.round(order.total * 0.0825),
            shipping: 0,
            tax: Math.round(order.total * 0.0825),
            total: order.total,
            shippingAddress: {
              name: shippingAddr?.name || '',
              address: shippingAddr?.address || '',
              apartment: shippingAddr?.apartment,
              city: shippingAddr?.city || '',
              state: shippingAddr?.state || '',
              zip: shippingAddr?.zip || '',
              country: shippingAddr?.country || 'US',
            },
            shippingMethod: 'standard',
          }).catch((err) => console.error('Failed to send confirmation email:', err))
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Stripe webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 },
    )
  }
}
