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
    <div className="p-5 sm:p-8 lg:p-12 space-y-10 max-w-[1440px] mx-auto font-sans">
      {/* ── Page Header ── */}
      <div className="pb-8 sm:pb-10 border-b border-gray-100 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="max-w-3xl">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 bg-[#F6F6F8] border border-gray-200/80 text-[11px] font-semibold tracking-wider uppercase text-navy/70 mb-4 sm:mb-5 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
            Atelier Fulfillment · Dallas, TX
          </div>

          {/* Large display heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-sans font-bold text-navy tracking-[-0.035em] leading-[1.05]">
            Client Orders & Allocations
          </h1>

          <p className="mt-4 text-sm sm:text-base text-navy/60 max-w-2xl leading-relaxed font-normal">
            Live purchase feed, made-to-order pre-order reservations, and Dallas dispatch registry.
          </p>
        </div>

        {/* Right side stats pill */}
        <div className="flex items-center lg:flex-col lg:items-end gap-3 pt-2 lg:pt-0">
          <div className="backdrop-blur-md bg-[#F6F6F8] border border-gray-200/80 rounded-full px-5 py-2.5 shadow-xs inline-flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-navy tracking-tight">
              {orders.length} Total Dispatches
            </span>
          </div>
        </div>
      </div>

      {/* ── Metric Summaries ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="rounded-[28px] sm:rounded-[32px] bg-[#F6F6F8] border border-gray-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between text-navy/50 mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider font-sans">Total Dispatches</span>
            <div className="w-9 h-9 rounded-xl bg-white border border-gray-200/70 flex items-center justify-center text-navy shadow-2xs">
              <ShoppingBag size={16} />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-bold text-navy tracking-tight">{orders.length}</div>
          <div className="text-xs text-navy/50 font-sans mt-1">All-time order records</div>
        </div>

        <div className="rounded-[28px] sm:rounded-[32px] bg-emerald-50/70 border border-emerald-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between text-emerald-800 mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider font-sans">Paid & Confirmed</span>
            <div className="w-9 h-9 rounded-xl bg-white border border-emerald-200/60 flex items-center justify-center text-emerald-600 shadow-2xs">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-bold text-emerald-950 tracking-tight">{paidCount}</div>
          <div className="text-xs text-emerald-800/70 font-sans mt-1">Ready for packing queue</div>
        </div>

        <div className="rounded-[28px] sm:rounded-[32px] bg-blue-50/70 border border-blue-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between text-blue-800 mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider font-sans">Dispatched</span>
            <div className="w-9 h-9 rounded-xl bg-white border border-blue-200/60 flex items-center justify-center text-blue-600 shadow-2xs">
              <Truck size={16} />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-bold text-blue-950 tracking-tight">{shippedCount}</div>
          <div className="text-xs text-blue-800/70 font-sans mt-1">In transit with carrier</div>
        </div>

        <div className="rounded-[28px] sm:rounded-[32px] bg-amber-50/70 border border-amber-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between text-amber-800 mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider font-sans">Pre-Orders</span>
            <div className="w-9 h-9 rounded-xl bg-white border border-amber-200/60 flex items-center justify-center text-amber-600 shadow-2xs">
              <Clock size={16} />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-bold text-amber-950 tracking-tight">{preorderCount}</div>
          <div className="text-xs text-amber-800/70 font-sans mt-1">Made-to-order crafted</div>
        </div>
      </div>

      {/* ── Orders Table Card ── */}
      <div className="rounded-[32px] sm:rounded-[40px] bg-white border border-gray-200/80 p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.02)] space-y-6">
        <div className="flex items-center justify-between pb-5 border-b border-gray-100">
          <div>
            <h2 className="font-sans font-bold text-xl text-navy tracking-tight">Order Registry</h2>
            <p className="text-xs text-navy/50 font-sans mt-0.5">Showing {orders.length} order allocations</p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-[24px] border border-gray-200/80">
          <table className="w-full text-left text-sm font-sans">
            <thead>
              <tr className="bg-[#F6F6F8] border-b border-gray-200/80 text-[10px] font-bold uppercase tracking-[0.14em] text-navy/55">
                <th className="px-5 py-4">Manifest ID</th>
                <th className="px-5 py-4">Client</th>
                <th className="px-5 py-4">Atelier Pieces</th>
                <th className="px-5 py-4">Total</th>
                <th className="px-5 py-4">Payment Method</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-navy/40 text-xs">
                    No orders registered in the atelier yet.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const addr = (order.shipping_address || {}) as Record<string, string>
                  const clientName = addr?.fullName || addr?.name || 'Private Client'
                  const clientCity = [addr?.city, addr?.state].filter(Boolean).join(', ')
                  const isPre =
                    Boolean(addr?.preorder_reservation) ||
                    order.notes?.toLowerCase().includes('pre-order') ||
                    order.notes?.toLowerCase().includes('preorder')
                  const items = itemsByOrder[order.id] || []

                  return (
                    <tr key={order.id} className="hover:bg-[#FBFBFC] transition-colors">
                      {/* Ref */}
                      <td className="px-5 py-4 align-top">
                        <div className="font-mono text-xs font-bold text-navy tracking-wider">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </div>
                        {isPre && (
                          <span className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200/80 text-[9px] font-bold uppercase tracking-wider shadow-2xs">
                            <Sparkles size={10} className="text-amber-600" />
                            ✦ Pre-Order
                          </span>
                        )}
                      </td>

                      {/* Client */}
                      <td className="px-5 py-4 align-top">
                        <div className="font-bold text-xs text-navy">{clientName}</div>
                        {clientCity && (
                          <div className="text-[11px] text-navy/50 mt-0.5 font-sans">
                            {clientCity}
                          </div>
                        )}
                        {addr?.email && (
                          <div className="text-[10px] text-navy/40 font-mono truncate max-w-[160px] mt-0.5">
                            {addr.email}
                          </div>
                        )}
                      </td>

                      {/* Items */}
                      <td className="px-5 py-4 align-top max-w-[280px]">
                        {items.length === 0 ? (
                          <span className="text-navy/40 text-xs italic">1× Atelier Handbag</span>
                        ) : (
                          <div className="space-y-1">
                            {items.map((it, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-1.5 text-xs text-navy/80"
                              >
                                <span className="font-bold text-navy/40">
                                  {it.quantity}×
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
                      <td className="px-5 py-4 align-top font-bold text-navy text-sm whitespace-nowrap">
                        {formatPrice(order.total)}
                      </td>

                      {/* Payment */}
                      <td className="px-5 py-4 align-top">
                        <span className="inline-block px-3 py-1 rounded-full bg-[#F6F6F8] text-[10px] font-bold uppercase tracking-wider text-navy/70 border border-gray-200/60 shadow-2xs">
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
                      <td className="px-5 py-4 align-top">
                        <OrderStatusDropdown orderId={order.id} currentStatus={order.status} />
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 align-top text-right text-[11px] text-navy/45 whitespace-nowrap">
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
