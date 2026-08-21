import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'
import { formatPrice } from '@/lib/types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Admin Dashboard — FÉROCE',
  description: 'Féroce store admin dashboard.',
}

async function getStats() {
  const supabase = createAdminClient()

  const [productsRes, ordersRes, customersRes] = await Promise.all([
    supabase.from('products').select('id, stock, active', { count: 'exact' }),
    supabase.from('orders').select('id, total, status, payment_method, created_at, shipping_address', { count: 'exact' }),
    supabase.from('profiles').select('id', { count: 'exact' }),
  ] as any[])

  const products = (productsRes.data || []) as Array<{ id: string; stock: number; active: boolean }>
  const orders = (ordersRes.data || []) as Array<{ id: string; total: number; status: string; payment_method: string; created_at: string; shipping_address: Record<string, unknown> }>
  const customers = (customersRes.data || []) as Array<{ id: string }>

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
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-semibold text-navy">Dashboard</h1>
        <p className="text-sm text-navy/50 mt-1">Overview of your store performance.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white border border-line p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-navy/30">{card.icon}</span>
            </div>
            <p className="text-2xl font-serif font-semibold text-navy">{card.value}</p>
            <p className="text-[10px] font-sans uppercase tracking-[0.15em] text-navy/40 mt-1.5">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white border border-line">
        <div className="px-5 py-4 border-b border-line">
          <h2 className="text-[11px] font-sans uppercase tracking-[0.15em] text-navy font-semibold">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className="px-5 py-3 text-left text-[10px] font-sans uppercase tracking-[0.15em] text-navy/50 font-medium">Order</th>
                <th className="px-5 py-3 text-left text-[10px] font-sans uppercase tracking-[0.15em] text-navy/50 font-medium">Customer</th>
                <th className="px-5 py-3 text-left text-[10px] font-sans uppercase tracking-[0.15em] text-navy/50 font-medium">Payment</th>
                <th className="px-5 py-3 text-left text-[10px] font-sans uppercase tracking-[0.15em] text-navy/50 font-medium">Total</th>
                <th className="px-5 py-3 text-left text-[10px] font-sans uppercase tracking-[0.15em] text-navy/50 font-medium">Status</th>
                <th className="px-5 py-3 text-left text-[10px] font-sans uppercase tracking-[0.15em] text-navy/50 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16">
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
                    <td className="px-5 py-3 font-mono text-xs text-navy">#{order.id.slice(0, 8).toUpperCase()}</td>
                    <td className="px-5 py-3 text-navy/60">
                      {(order.shipping_address as Record<string, string>)?.name || 'Guest'}
                    </td>
                    <td className="px-5 py-3 text-navy/60 text-xs">
                      {order.payment_method === 'card' ? 'Card' :
                       order.payment_method === 'apple_pay' ? 'Apple Pay' :
                       order.payment_method === 'google_pay' ? 'Google Pay' :
                       order.payment_method === 'cashapp' ? 'Cash App' :
                       'Bank Transfer'}
                    </td>
                    <td className="px-5 py-3 font-medium text-navy">{formatPrice(order.total)}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 ${
                        order.status === 'paid' ? 'bg-green-50 text-green-700' :
                        order.status === 'shipped' ? 'bg-blue-50 text-blue-700' :
                        order.status === 'cancelled' ? 'bg-red-50 text-red-700' :
                        'bg-yellow-50 text-yellow-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-navy/40 text-xs">
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
