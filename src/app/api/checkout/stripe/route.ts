import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendOrderConfirmation } from '@/lib/email'

interface CheckoutItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
  color: string
}

interface StripeCheckoutRequest {
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
  paymentMethod: string
  paymentIntentId?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: StripeCheckoutRequest = await request.json()
    const { items, email, shippingAddress, shippingMethod, paymentMethod } = body

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

    // Find user_id by email (if registered)
    let userId: string | null = null
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single()
    if (profile) userId = profile.id

    // Map payment method string to valid enum
    const paymentMethodEnum = paymentMethod as 'card' | 'apple_pay' | 'google_pay' | 'cashapp' | 'bank_transfer'

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        payment_method: paymentMethodEnum,
        payment_provider: 'stripe',
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

    // Mark as paid and store the PaymentIntent ID
    // In production, the webhook handles this — but for the mock flow
    // (and in-page confirmation), we mark it here.
    await supabase
      .from('orders')
      .update({
        status: 'paid',
        stripe_session_id: body.paymentIntentId || `mock_${order.id}`,
      })
      .eq('id', order.id)

    // Send order confirmation email
    sendOrderConfirmation({
      orderId: order.id,
      email,
      customerName: shippingAddress.name,
      items: items.map((item) => ({
        name: item.name,
        color: item.color,
        price: item.price,
        quantity: item.quantity,
      })),
      subtotal,
      shipping,
      tax,
      total,
      shippingAddress: {
        name: shippingAddress.name,
        address: shippingAddress.address,
        apartment: shippingAddress.apartment,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zip: shippingAddress.zip,
        country: shippingAddress.country,
      },
      shippingMethod,
    }).catch((err) => console.error('Failed to send confirmation email:', err))

    return NextResponse.json({
      url: `/checkout/success?order=${order.id}`,
      orderId: order.id,
    })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 },
    )
  }
}
