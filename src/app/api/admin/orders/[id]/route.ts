import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendOrderShipped, sendOrderCancelled } from '@/lib/email'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { status, trackingNumber } = await request.json()

  const validStatuses = ['pending', 'paid', 'shipped', 'cancelled']
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const supabase = createAdminClient()

  // Get order details before updating (for email)
  const { data: order } = await supabase
    .from('orders')
    .select('id, user_id, status, shipping_address')
    .eq('id', id)
    .single()

  const updateData: Record<string, unknown> = { status }
  if (trackingNumber) {
    updateData.tracking_number = trackingNumber
  }

  const { error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Send email notifications on status change
  if (order && order.shipping_address) {
    const addr = order.shipping_address as Record<string, string>
    const customerEmail = addr.email || ''
    const customerName = addr.name || 'Valued Customer'

    if (status === 'shipped' && customerEmail) {
      await sendOrderShipped({
        orderId: id,
        email: customerEmail,
        customerName,
        trackingNumber: trackingNumber || undefined,
      })
    }

    if (status === 'cancelled' && customerEmail) {
      await sendOrderCancelled({
        orderId: id,
        email: customerEmail,
        customerName,
      })
    }
  }

  return NextResponse.json({ success: true })
}
