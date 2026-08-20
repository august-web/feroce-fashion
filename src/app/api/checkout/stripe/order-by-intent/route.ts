import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * GET /api/checkout/stripe/order-by-intent?payment_intent=pi_xxx
 * Looks up an order by its Stripe PaymentIntent ID.
 */
export async function GET(request: NextRequest) {
  const paymentIntent = request.nextUrl.searchParams.get('payment_intent')

  if (!paymentIntent) {
    return NextResponse.json({ error: 'Missing payment_intent' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const { data: order } = await supabase
    .from('orders')
    .select('id')
    .eq('stripe_session_id', paymentIntent)
    .single()

  if (!order) {
    return NextResponse.json({ orderId: null })
  }

  return NextResponse.json({ orderId: order.id })
}
