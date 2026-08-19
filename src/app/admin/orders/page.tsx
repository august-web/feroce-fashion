import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'
import { formatPrice } from '@/lib/types'
import { OrderStatusDropdown } from './OrderStatusDropdown'

export const metadata: Metadata = {
  title: 'Orders — FÉROCE Admin',
  description: 'Manage your Féroce orders.',
}

async function getOrders() {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false }) as { data: Array<{
      id: string
      total: number
      status: string
      payment_method: string
      payment_provider: string
      shipping_address: Record<string, unknown>
      created_at: string
    }> | null }
  return data || []
}

export default async function AdminOrdersPage() {
  const orders = await getOrders()

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-semibold text-navy">Orders</h1>
        <p className="text-sm text-navy/50 mt-1">{orders.length} orders</p>
      </div>

      <div className="bg-white border border-line overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line">
              <th className="px-5 py-3 text-left text-[10px] font-sans uppercase tracking-luxury text-navy/50 font-medium">Order</th>
              <th className="px-5 py-3 text-left text-[10px] font-sans uppercase tracking-luxury text-navy/50 font-medium">Customer</th>
              <th className="px-5 py-3 text-left text-[10px] font-sans uppercase tracking-luxury text-navy/50 font-medium">Items</th>
              <th className="px-5 py-3 text-left text-[10px] font-sans uppercase tracking-luxury text-navy/50 font-medium">Total</th>
              <th className="px-5 py-3 text-left text-[10px] font-sans uppercase tracking-luxury text-navy/50 font-medium">Payment</th>
              <th className="px-5 py-3 text-left text-[10px] font-sans uppercase tracking-luxury text-navy/50 font-medium">Status</th>
              <th className="px-5 py-3 text-left text-[10px] font-sans uppercase tracking-luxury text-navy/50 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-16 text-center text-sm text-navy/40">
                  No orders yet.
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const addr = order.shipping_address as Record<string, string>
                return (
                  <tr key={order.id} className="border-b border-line/50 last:border-0 hover:bg-cream/50 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs text-navy">#{order.id.slice(0, 8).toUpperCase()}</td>
                    <td className="px-5 py-3 text-navy/60">{addr?.name || 'Guest'}</td>
                    <td className="px-5 py-3 text-navy/60">—</td>
                    <td className="px-5 py-3 font-medium text-navy">{formatPrice(order.total)}</td>
                    <td className="px-5 py-3 text-navy/60 text-xs">
                      {order.payment_method === 'paypal' ? 'PayPal' :
                       order.payment_method === 'card' ? 'Card' :
                       order.payment_method === 'apple_pay' ? 'Apple Pay' :
                       order.payment_method === 'google_pay' ? 'Google Pay' :
                       order.payment_method === 'cashapp' ? 'Cash App' :
                       'Bank Transfer'}
                      <span className="text-navy/30 ml-1">({order.payment_provider})</span>
                    </td>
                    <td className="px-5 py-3">
                      <OrderStatusDropdown orderId={order.id} currentStatus={order.status} />
                    </td>
                    <td className="px-5 py-3 text-navy/40 text-xs">
                      {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
