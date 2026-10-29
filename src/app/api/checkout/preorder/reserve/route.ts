import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

interface ReserveRequestItem {
  productId: string
  quantity: number
  color?: string
}

interface ReserveRequestBody {
  customer: {
    fullName: string
    email: string
    phone?: string
    address: string
    suite?: string
    city: string
    state: string
    zip: string
    country?: string
  }
  items: ReserveRequestItem[]
  reservationOption: 'zero_down' | 'split_pay_instock'
}

export async function POST(request: NextRequest) {
  try {
    const body: ReserveRequestBody = await request.json()
    const { customer, items, reservationOption } = body

    if (!customer?.fullName || !customer?.email || !customer?.address || !customer?.city || !customer?.state || !customer?.zip) {
      return NextResponse.json({ error: 'Please provide full contact and shipping details.' }, { status: 400 })
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty.' }, { status: 400 })
    }
    if (reservationOption !== 'zero_down') {
      return NextResponse.json({ error: 'Unsupported reservation option.' }, { status: 400 })
    }
    if (items.some((item) =>
      !item?.productId || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99
    )) {
      return NextResponse.json({ error: 'Invalid reservation item.' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    // Lookup authoritative product data from Supabase
    const productIds = items.map((i) => i.productId)
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, slug, price, color, preorder, active')
      .in('id', productIds)

    if (productsError || !products) {
      console.error('Pre-order reservation product lookup error:', productsError)
      return NextResponse.json({ error: 'Failed to verify reservation pieces.' }, { status: 500 })
    }

    const productMap = new Map(products.map((p) => [p.id, p]))

    let preorderTotal = 0
    let hasPreorder = false

    for (const item of items) {
      const prod = productMap.get(item.productId)
      if (!prod || !prod.active) {
        return NextResponse.json({ error: 'A piece in your bag is no longer available.' }, { status: 400 })
      }
      if (!prod.preorder) {
        return NextResponse.json({ error: 'Zero-down reservations are only available for pre-order pieces.' }, { status: 400 })
      }
      const lineCost = prod.price * item.quantity
      hasPreorder = true
      preorderTotal += lineCost
    }

    if (!hasPreorder) {
      return NextResponse.json({ error: 'No pre-order items found in cart.' }, { status: 400 })
    }

    const fullValue = preorderTotal
    const shipping = fullValue >= 200 ? 0 : 15
    const tax = Math.round(fullValue * 0.0825 * 100) / 100
    const grandTotal = Math.round((fullValue + shipping + tax) * 100) / 100

    // For a $0 zero-down pre-order reservation, total charged today is 0.
    // The balance is due upon dispatch when the Dallas atelier finishes crafting.
    const chargedToday = 0

    // Insert order record into Supabase orders
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: null,
        payment_method: 'card',
        payment_provider: 'stripe',
        total: chargedToday,
        status: 'pending',
        shipping_address: {
          fullName: customer.fullName,
          email: customer.email,
          phone: customer.phone || '',
          street: customer.address,
          suite: customer.suite || '',
          city: customer.city,
          state: customer.state,
          zip: customer.zip,
          country: customer.country || 'US',
          preorder_reservation: true,
          reservation_type: reservationOption,
          charged_today: chargedToday,
          total_reservation_value: grandTotal,
          preorder_balance_due: grandTotal,
          estimated_dispatch: '3–4 Weeks from Dallas Atelier',
          reserved_at: new Date().toISOString(),
        },
        notes: `Dallas Atelier Pre-Order Allocation Reservation: $0 charged today. Balance of $${grandTotal.toFixed(2)} due prior to insured white-glove dispatch.`,
      })
      .select('id')
      .single()

    if (orderError || !order) {
      console.error('Order reservation insertion error:', orderError)
      return NextResponse.json({ error: 'Failed to record pre-order allocation.' }, { status: 500 })
    }

    // Insert order items
    const orderItemsToInsert = items.map((item) => {
      const prod = productMap.get(item.productId)!
      return {
        order_id: order.id,
        product_id: item.productId,
        name: prod.name + (prod.preorder ? ' [Pre-Order Allocation]' : ''),
        color: item.color || prod.color || '',
        price: prod.price,
        quantity: item.quantity,
      }
    })

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsToInsert)

    if (itemsError) {
      console.error('Order reservation items error:', itemsError)
      await supabase.from('orders').delete().eq('id', order.id)
      return NextResponse.json({ error: 'Failed to save pre-order reservation items.' }, { status: 500 })
    }

    const reservationNumber = `RES-${order.id.slice(0, 8).toUpperCase()}`

    return NextResponse.json({
      success: true,
      orderId: order.id,
      reservationNumber,
      estimatedDelivery: '3–4 Weeks',
      email: customer.email,
      totalDueUponDispatch: grandTotal,
    })
  } catch (error) {
    console.error('Pre-order reservation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal reservation error' },
      { status: 500 },
    )
  }
}
