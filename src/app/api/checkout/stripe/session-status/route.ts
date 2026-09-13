import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getStripe } from '@/lib/stripe'

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('session_id')

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session_id' }, { status: 400 })
  }

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId)

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    const { data: order } = await supabase
      .from('orders')
      .select('id')
      .eq('stripe_session_id', sessionId)
      .single()

    return NextResponse.json({
      status: session.status,
      orderId: order?.id || null,
      customerEmail: session.customer_details?.email || null,
    })
  } catch (error) {
    console.error('Session status error:', error)
    return NextResponse.json({ status: 'error', orderId: null })
  }
}
