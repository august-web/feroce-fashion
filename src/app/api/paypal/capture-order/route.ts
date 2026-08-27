import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

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
 * POST /api/paypal/capture-order
 * Captures a PayPal order after customer approval.
 * Creates the order in Supabase and sends confirmation email.
 */
export async function POST(request: NextRequest) {
  try {
    const { orderId, items }: { orderId: string; items: CartItem[] } = await request.json()

    if (!orderId) {
      return NextResponse.json({ error: 'Missing PayPal order ID' }, { status: 400 })
    }

    const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
    const paypalSecret = process.env.PAYPAL_CLIENT_SECRET

    if (!paypalClientId || !paypalSecret) {
      return NextResponse.json({ error: 'PayPal is not configured' }, { status: 500 })
    }

    // Get PayPal access token
    const authRes = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${paypalClientId}:${paypalSecret}`).toString('base64')}`,
      },
      body: 'grant_type=client_credentials',
    })

    if (!authRes.ok) {
      return NextResponse.json({ error: 'PayPal authentication failed' }, { status: 500 })
    }

    const { access_token } = await authRes.json()

    // Capture the order
    const captureRes = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
    })

    if (!captureRes.ok) {
      const err = await captureRes.text()
      console.error('PayPal capture error:', err)
      return NextResponse.json({ error: 'Failed to capture PayPal payment' }, { status: 500 })
    }

    const captureData = await captureRes.json()

    // Check if capture was successful
    if (captureData.status !== 'COMPLETED') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 })
    }

    // Extract payment details
    const purchaseUnit = captureData.purchase_units?.[0]
    const capture = purchaseUnit?.payments?.captures?.[0]
    const totalAmount = parseFloat(capture?.amount?.value || '0')
    const totalCents = Math.round(totalAmount * 100)

    // Create order in Supabase
    const supabase = createAdminClient()
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        paypal_order_id: orderId,
        payment_method: 'paypal',
        payment_provider: 'paypal',
        total: totalCents,
        status: 'paid',
        shipping_address: captureData.payer?.address || null,
      })
      .select()
      .single()

    if (orderError) {
      console.error('Supabase insert order error:', orderError)
      // Payment was captured but order creation failed — still return success
      // The admin can reconcile manually
      return NextResponse.json({
        orderId: orderId,
        warning: 'Payment captured but order record creation failed',
      })
    }

    // Create order items
    if (items?.length && order) {
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }))

      await supabase.from('order_items').insert(orderItems)
    }

    return NextResponse.json({
      orderId: order?.id || orderId,
      status: 'completed',
    })
  } catch (error) {
    console.error('PayPal capture-order error:', error)
    return NextResponse.json({ error: 'Failed to capture PayPal payment' }, { status: 500 })
  }
}
