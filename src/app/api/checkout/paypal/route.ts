import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

interface CheckoutItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
  color: string
}

interface PayPalCheckoutRequest {
  items: CheckoutItem[]
  email: string
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

export async function POST(request: NextRequest) {
  try {
    const body: PayPalCheckoutRequest = await request.json()
    const { items, email, shippingAddress, shippingMethod } = body

    if (!items?.length || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shipping = subtotal >= 20000 ? 0 : (shippingMethod === 'express' ? 1800 : 1500)
    const tax = Math.round(subtotal * 0.0825)
    const total = subtotal + shipping + tax

    // Create order in Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    // Find user_id by email
    let userId: string | null = null
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single()
    if (profile) userId = profile.id

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        payment_method: 'paypal' as const,
        payment_provider: 'paypal' as const,
        total,
        status: 'pending',
        shipping_address: {
          name: shippingAddress.name,
          address: shippingAddress.address,
          apartment: shippingAddress.apartment,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zip: shippingAddress.zip,
          country: shippingAddress.country,
          phone: shippingAddress.phone,
          email,
        },
      })
      .select('id')
      .single()

    if (orderError) {
      console.error('Order creation error:', orderError)
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }

    // Create order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }))

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
    if (itemsError) {
      console.error('Order items error:', itemsError)
    }

    // In production: create PayPal order and return approval URL
    // For now, mark as paid and redirect to success
    await supabase
      .from('orders')
      .update({ status: 'paid', paypal_order_id: `mock_${order.id}` })
      .eq('id', order.id)

    return NextResponse.json({
      approvalUrl: `/checkout/success?order=${order.id}`,
      orderId: order.id,
    })
  } catch (error) {
    console.error('PayPal checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create PayPal order' },
      { status: 500 },
    )
  }
}
