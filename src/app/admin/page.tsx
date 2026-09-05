import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'
import { formatPrice } from '@/lib/types'
import { OrderStatusDropdown } from './orders/OrderStatusDropdown'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Admin Dashboard — FÉROCE',
  description: 'Féroce store admin dashboard.',
}

async function getStats() {
  const supabase = createAdminClient()

  const [productsRes, ordersRes, customersRes] = await Promise.all([
    supabase.from('products').select('id, stock, active', { count: 'exact' }),
    supabase.from('orders').select('id, total, status, payment_method, created_at, shipping_address', { count: 'exact' }).order('created_at', { ascending: false }),
    supabase.from('profiles').select('id', { count: 'exact' }),
  ] as any[])

  const products = (productsRes.data || []) as Array<{ id: string; stock: number; active: boolean }>
  const orders = (ordersRes.data || []) as Array<{ id: string; total: number; status: string; payment_method: string; created_at: string; shipping_address: Record<string, unknown> }>
  const customers = (customersRes.data || []) as Array<{ id: string }>

  // Group order line items per order (handles both the legacy `name`
  // column and the newer `product_name`/`color` columns).
  const itemsByOrder: Record<string, Array<{ name: string; quantity: number }>> = {}
  const orderIds = orders.map((o) => o.id)
  if (orderIds.length > 0) {
    const { data: items } = await supabase
      .from('order_items')
      .select('order_id, name, product_name, color, quantity')
      .in('order_id', orderIds)
    for (const it of (items || []) as Array<Record<string, unknown>>) {
      const base = String(it.product_name || it.name || 'Item')
      const color = String(it.color || '')
      const label = color ? `${base} — ${color}` : base
      const key = String(it.order_id)
      const list = itemsByOrder[key] ?? (itemsByOrder[key] = [])
      const existing = list.find((i) => i.name === label)
      if (existing) existing.quantity += Number(it.quantity)
      else list.push({ name: label, quantity: Number(it.quantity) })
    }
  }

  const totalRevenue = orders
    .filter((o) => o.status === 'paid' || o.status === 'shipped')
    .reduce((sum, o) => sum + o.total, 0)

  return {
    revenue: totalRevenue,
    orderCount: orders.length,
    customerCount: customers.length,
    productCount: products.length,
    activeProducts: products.filter((p) => p.active).length,
    recentOrders: orders.slice(0, 10),
    itemsByOrder,
    // Paid = payment confirmed, not yet shipped → needs packing.
    readyToPack: orders.filter((o) => o.status === 'paid').slice(0, 10),
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const statCards = [
    {
      label: 'Total Revenue',
      value: formatPrice(stats.revenue),
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
        </svg>
      ),
    },
    {
      label: 'Orders',
      value: stats.orderCount.toString(),
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
    },
    {
      label: 'Customers',
      value: stats.customerCount.toString(),
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
        </svg>
      ),
    },
    {
      label: 'Products',
      value: stats.activeProducts.toString(),
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
      ),
    },
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="font-serif text-2xl font-semibold text-navy">Dashboard</h1>
        <p className="text-sm text-navy/50 mt-1">Overview of your store performance.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white border border-line p-4 sm:p-5 min-w-0">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <span className="text-navy/30">{card.icon}</span>
            </div>
            <p className="text-xl sm:text-2xl font-serif font-semibold text-navy truncate">{card.value}</p>
            <p className="text-[10px] font-sans uppercase tracking-[0.15em] text-navy/40 mt-1.5">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Ready to Pack — paid orders awaiting shipment */}
      {stats.readyToPack.length > 0 && (
        <div className="bg-white border border-gold/40 mb-6 sm:mb-8">
          <div className="px-4 sm:px-5 py-4 border-b border-line flex items-center justify-between gap-3 flex-wrap">
            <h2 className="text-[11px] font-sans uppercase tracking-[0.15em] text-navy font-semibold">
              Ready to Pack — {stats.readyToPack.length} paid {stats.readyToPack.length === 1 ? 'order' : 'orders'}
            </h2>
            <span className="text-[9px] font-sans uppercase tracking-wider text-gold">Payment confirmed — prepare for shipping</span>
          </div>
          <div className="divide-y divide-line">
            {stats.readyToPack.map((order) => {
              const addr = (order.shipping_address as Record<string, string>) || {}
              const items = stats.itemsByOrder[order.id] || []
              return (
                <div key={order.id} className="p-4 sm:px-5 sm:py-4 flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-medium text-navy">#{order.id.slice(0, 8).toUpperCase()}</span>
                      <span className="text-[10px] text-navy/40">
                        {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="text-xs font-medium text-navy">{formatPrice(order.total)}</span>
                    </div>
                    <ul className="mt-2 space-y-1">
                      {items.map((it, idx) => (
                        <li key={idx} className="text-xs text-navy/70">
                          <span className="font-medium text-navy">{it.quantity}×</span> {it.name}
                        </li>
                      ))}
                      {items.length === 0 && (
                        <li className="text-xs text-navy/40">No item records — check this order in Stripe.</li>
                      )}
                    </ul>
                    {(addr.address || addr.name) && (
                      <div className="mt-3 text-[11px] text-navy/50 leading-relaxed">
                        <p className="text-[9px] font-sans uppercase tracking-[0.15em] text-navy/30 mb-1">Ship to</p>
                        <p className="text-navy/70">{addr.name || '—'}</p>
                        <p>{addr.address}{addr.apartment ? `, ${addr.apartment}` : ''}</p>
                        <p>{addr.city}{addr.city ? ', ' : ''}{addr.state} {addr.zip}</p>
                        {addr.phone && <p>{addr.phone}</p>}
                      </div>
                    )}
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 sm:gap-3 flex-shrink-0">
                    <OrderStatusDropdown orderId={order.id} currentStatus={order.status} />
                    <span className="text-[9px] font-sans uppercase tracking-wider text-navy/30 text-right">Mark shipped once sent</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Recent orders */}
      <div className="bg-white border border-line">
        <div className="px-5 py-4 border-b border-line">
          <h2 className="text-[11px] font-sans uppercase tracking-[0.15em] text-navy font-semibold">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className="px-3 sm:px-5 py-3 text-left text-[10px] font-sans uppercase tracking-[0.15em] text-navy/50 font-medium">Order</th>
                <th className="px-3 sm:px-5 py-3 text-left text-[10px] font-sans uppercase tracking-[0.15em] text-navy/50 font-medium">Customer</th>
                <th className="hidden md:table-cell px-3 sm:px-5 py-3 text-left text-[10px] font-sans uppercase tracking-[0.15em] text-navy/50 font-medium">Items</th>
                <th className="hidden lg:table-cell px-3 sm:px-5 py-3 text-left text-[10px] font-sans uppercase tracking-[0.15em] text-navy/50 font-medium">Payment</th>
                <th className="px-3 sm:px-5 py-3 text-left text-[10px] font-sans uppercase tracking-[0.15em] text-navy/50 font-medium">Total</th>
                <th className="px-3 sm:px-5 py-3 text-left text-[10px] font-sans uppercase tracking-[0.15em] text-navy/50 font-medium">Status</th>
                <th className="hidden md:table-cell px-3 sm:px-5 py-3 text-left text-[10px] font-sans uppercase tracking-[0.15em] text-navy/50 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center">
                        <svg className="w-5 h-5 text-navy/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" />
                        </svg>
                      </div>
                      <p className="text-sm text-navy/40">No orders yet.</p>
                      <p className="text-[10px] text-navy/30">Orders will appear here once customers start purchasing.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                stats.recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-line/50 last:border-0 hover:bg-cream/50 transition-colors">
                    <td className="px-3 sm:px-5 py-3 font-mono text-xs text-navy whitespace-nowrap">#{order.id.slice(0, 8).toUpperCase()}</td>
                    <td className="px-3 sm:px-5 py-3 text-navy/60 truncate max-w-[90px] sm:max-w-none">
                      {(order.shipping_address as Record<string, string>)?.name || 'Guest'}
                    </td>
                    <td className="hidden md:table-cell px-3 sm:px-5 py-3 text-navy/60 text-xs max-w-[220px]">
                      {(() => {
                        const items = stats.itemsByOrder[order.id] || []
                        if (items.length === 0) return '—'
                        const shown = items.slice(0, 2).map((i) => `${i.quantity}× ${i.name}`).join(', ')
                        return items.length > 2 ? `${shown} +${items.length - 2} more` : shown
                      })()}
                    </td>
                    <td className="hidden lg:table-cell px-3 sm:px-5 py-3 text-navy/60 text-xs">
                      {order.payment_method === 'card' ? 'Card' :
                       order.payment_method === 'apple_pay' ? 'Apple Pay' :
                       order.payment_method === 'google_pay' ? 'Google Pay' :
                       order.payment_method === 'cashapp' ? 'Cash App' :
                       'Bank Transfer'}
                    </td>
                    <td className="px-3 sm:px-5 py-3 font-medium text-navy whitespace-nowrap">{formatPrice(order.total)}</td>
                    <td className="px-3 sm:px-5 py-3">
                      <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 ${
                        order.status === 'paid' ? 'bg-green-50 text-green-700' :
                        order.status === 'shipped' ? 'bg-blue-50 text-blue-700' :
                        order.status === 'cancelled' ? 'bg-red-50 text-red-700' :
                        'bg-yellow-50 text-yellow-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="hidden md:table-cell px-3 sm:px-5 py-3 text-navy/40 text-xs whitespace-nowrap">
                      {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
