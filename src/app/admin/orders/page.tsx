import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'
import { formatPrice } from '@/lib/types'
import { OrderStatusDropdown } from './OrderStatusDropdown'
import { ShoppingBag, Truck, CheckCircle2, Clock, Sparkles } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Orders & Dispatches — FÉROCE Admin',
  description: 'Manage client dispatches and pre-order allocations.',
}

async function getOrdersWithItems() {
  const supabase = createAdminClient()
  const { data: orders } = (await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })) as {
    data: Array<{
      id: string
      total: number
      status: string
      payment_method: string
      payment_provider: string
      shipping_address: Record<string, unknown>
      notes?: string | null
      created_at: string
    }> | null
  }

  const orderList = orders || []
  const orderIds = orderList.map((o) => o.id)

  const itemsByOrder: Record<string, Array<{ name: string; color?: string; quantity: number }>> = {}

  if (orderIds.length > 0) {
    const { data: items } = await supabase
      .from('order_items')
      .select('order_id, name, product_name, color, quantity')
      .in('order_id', orderIds)

    for (const it of (items || []) as Array<Record<string, unknown>>) {
      const base = String(it.product_name || it.name || 'Atelier Piece')
      const color = String(it.color || '')
      const key = String(it.order_id)
      const list = itemsByOrder[key] ?? (itemsByOrder[key] = [])
      list.push({
        name: base,
        color: color || undefined,
        quantity: Number(it.quantity) || 1,
      })
    }
  }

  return { orders: orderList, itemsByOrder }
}

export default async function AdminOrdersPage() {
  const { orders, itemsByOrder } = await getOrdersWithItems()

  const paidCount = orders.filter((o) => o.status === 'paid').length
  const shippedCount = orders.filter((o) => o.status === 'shipped').length
  const preorderCount = orders.filter((o) =>
    Boolean(o.notes?.toLowerCase().includes('pre-order') || o.notes?.toLowerCase().includes('preorder'))
  ).length

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 text-gold-dark text-[10px] font-mono uppercase tracking-[0.2em] font-semibold mb-2">
            <Sparkles className="w-3 h-3 text-gold" />
            <span>Atelier Fulfillment & Dispatches</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-navy tracking-tight">
            Client Orders & Allocations
          </h1>
          <p className="text-xs sm:text-sm text-navy/60 mt-1 max-w-xl">
            Live client purchase feed, made-to-order pre-order reservations, and Dallas dispatch
            tracking.
          </p>
        </div>
      </div>

      {/* Metric Summaries */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-[28px] p-5 border border-gray-200/80 shadow-sm">
          <div className="flex items-center justify-between text-navy/50 mb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider">Total Dispatches</span>
            <ShoppingBag className="w-4 h-4 text-navy/40" />
          </div>
          <div className="text-2xl font-serif font-bold text-navy">{orders.length}</div>
          <div className="text-[10px] font-mono text-navy/40 mt-1">All-time order records</div>
        </div>

        <div className="bg-white rounded-[28px] p-5 border border-gray-200/80 shadow-sm">
          <div className="flex items-center justify-between text-emerald-600 mb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider">Paid & Confirmed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-serif font-bold text-navy">{paidCount}</div>
          <div className="text-[10px] font-mono text-emerald-600 mt-1">Ready for packing</div>
        </div>

        <div className="bg-white rounded-[28px] p-5 border border-gray-200/80 shadow-sm">
          <div className="flex items-center justify-between text-blue-600 mb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider">Dispatched</span>
            <Truck className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-serif font-bold text-navy">{shippedCount}</div>
          <div className="text-[10px] font-mono text-blue-600 mt-1">In transit with carrier</div>
        </div>

        <div className="bg-white rounded-[28px] p-5 border border-gray-200/80 shadow-sm">
          <div className="flex items-center justify-between text-amber-600 mb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider">Pre-Orders</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-serif font-bold text-navy">{preorderCount}</div>
          <div className="text-[10px] font-mono text-amber-600 mt-1">Made-to-order crafted</div>
        </div>
      </div>

      {/* Orders Table Card */}
      <div className="bg-white rounded-[32px] sm:rounded-[40px] border border-gray-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="font-serif text-lg font-semibold text-navy">Order Registry</h2>
            <p className="text-xs text-navy/50 mt-0.5">Showing {orders.length} order allocations</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] font-mono uppercase tracking-[0.16em] text-navy/40">
                <th className="pb-3 px-3">Order Ref</th>
                <th className="pb-3 px-3">Client</th>
                <th className="pb-3 px-3">Atelier Pieces</th>
                <th className="pb-3 px-3">Total</th>
                <th className="pb-3 px-3">Payment</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-navy/40 font-mono text-xs">
                    No orders registered in the atelier yet.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const addr = (order.shipping_address || {}) as Record<string, string>
                  const clientName = addr?.name || 'Private Client'
                  const clientCity = [addr?.city, addr?.state].filter(Boolean).join(', ')
                  const isPre =
                    order.notes?.toLowerCase().includes('pre-order') ||
                    order.notes?.toLowerCase().includes('preorder')
                  const items = itemsByOrder[order.id] || []

                  return (
                    <tr key={order.id} className="hover:bg-[#FBFBFC] transition-colors group">
                      {/* Ref */}
                      <td className="py-4 px-3 align-top">
                        <div className="font-mono text-[11px] font-bold text-navy tracking-wider">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </div>
                        {isPre && (
                          <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 text-[9px] font-mono uppercase tracking-wider font-semibold">
                            ✦ Pre-Order
                          </span>
                        )}
                      </td>

                      {/* Client */}
                      <td className="py-4 px-3 align-top">
                        <div className="font-medium text-navy">{clientName}</div>
                        {clientCity && (
                          <div className="text-[11px] text-navy/40 font-mono mt-0.5">
                            {clientCity}
                          </div>
                        )}
                        {addr?.email && (
                          <div className="text-[10px] text-navy/40 font-mono truncate max-w-[160px]">
                            {addr.email}
                          </div>
                        )}
                      </td>

                      {/* Items */}
                      <td className="py-4 px-3 align-top max-w-[280px]">
                        {items.length === 0 ? (
                          <span className="text-navy/40 text-[11px] italic">No item details</span>
                        ) : (
                          <div className="space-y-1">
                            {items.map((it, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-1.5 text-[11px] text-navy/80"
                              >
                                <span className="font-mono font-bold text-navy/40">
                                  {it.quantity}x
                                </span>
                                <span className="truncate">{it.name}</span>
                                {it.color && (
                                  <span className="text-[10px] text-navy/40 font-mono">
                                    ({it.color})
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </td>

                      {/* Total */}
                      <td className="py-4 px-3 align-top font-serif font-bold text-navy text-sm">
                        {formatPrice(order.total)}
                      </td>

                      {/* Payment */}
                      <td className="py-4 px-3 align-top">
                        <span className="inline-block px-2.5 py-1 rounded-full bg-[#F6F6F8] text-[10px] font-mono uppercase tracking-wider text-navy/70 border border-gray-200/60 font-medium">
                          {order.payment_method === 'card'
                            ? 'Credit Card'
                            : order.payment_method === 'apple_pay'
                            ? 'Apple Pay'
                            : order.payment_method === 'google_pay'
                            ? 'Google Pay'
                            : order.payment_method === 'cashapp'
                            ? 'Cash App'
                            : 'Reservation / Direct'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-3 align-top">
                        <OrderStatusDropdown orderId={order.id} currentStatus={order.status} />
                      </td>

                      {/* Date */}
                      <td className="py-4 px-3 align-top text-right font-mono text-[11px] text-navy/40 whitespace-nowrap">
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
