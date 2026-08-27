import { NextRequest, NextResponse } from 'next/server'

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
 * POST /api/paypal/create-order
 * Creates a PayPal order with cart items.
 * Returns the PayPal order ID for the client-side SDK to approve.
 */
export async function POST(request: NextRequest) {
  try {
    const { items }: { items: CartItem[] } = await request.json()

    if (!items?.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
    const paypalSecret = process.env.PAYPAL_CLIENT_SECRET

    if (!paypalClientId || !paypalSecret) {
      return NextResponse.json({ error: 'PayPal is not configured' }, { status: 500 })
    }

    // Calculate total in USD
    const subtotalCents = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shippingCents = subtotalCents >= 20000 ? 0 : 1500
    const totalCents = subtotalCents + shippingCents
    const totalUsd = (totalCents / 100).toFixed(2)

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
      console.error('PayPal auth failed:', await authRes.text())
      return NextResponse.json({ error: 'PayPal authentication failed' }, { status: 500 })
    }

    const { access_token } = await authRes.json()

    // Build purchase units
    const description = items.map((i) => `${i.name}${i.quantity > 1 ? ` x${i.quantity}` : ''}`).join(', ')

    const orderRes = await fetch('https://api-m.paypal.com/v2/checkout/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            description: `FÉROCE — ${description}`,
            amount: {
              currency_code: 'USD',
              value: totalUsd,
              breakdown: {
                item_total: {
                  currency_code: 'USD',
                  value: (subtotalCents / 100).toFixed(2),
                },
                shipping: {
                  currency_code: 'USD',
                  value: (shippingCents / 100).toFixed(2),
                },
              },
            },
            items: items.map((item) => ({
              name: item.name + (item.color ? ` — ${item.color}` : ''),
              unit_amount: {
                currency_code: 'USD',
                value: (item.price / 100).toFixed(2),
              },
              quantity: String(item.quantity),
              category: 'PHYSICAL_GOODS',
            })),
          },
        ],
        application_context: {
          brand_name: 'FÉROCE',
          landing_page: 'BILLING',
          user_action: 'PAY_NOW',
          return_url: `${request.headers.get('origin') || 'https://www.ferocefashionff.com'}/checkout/success?paypal_order_id={paypal_order_id}`,
          cancel_url: `${request.headers.get('origin') || 'https://www.ferocefashionff.com'}/bag`,
        },
      }),
    })

    if (!orderRes.ok) {
      const err = await orderRes.text()
      console.error('PayPal create order error:', err)
      return NextResponse.json({ error: 'Failed to create PayPal order' }, { status: 500 })
    }

    const order = await orderRes.json()

    return NextResponse.json({ orderId: order.id })
  } catch (error) {
    console.error('PayPal create-order error:', error)
    return NextResponse.json({ error: 'Failed to create PayPal order' }, { status: 500 })
  }
}
