import type { Metadata } from 'next'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { formatPrice } from '@/lib/types'
import { OrderStatusDropdown } from './orders/OrderStatusDropdown'
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  Sparkles,
  ArrowRight,
  Truck,
  CheckCircle2,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Atelier Dashboard — FÉROCE Admin',
  description: 'FÉROCE Dallas atelier operations and performance command center.',
}

async function getStats() {
  const supabase = createAdminClient()

  const [productsRes, ordersRes, customersRes] = await Promise.all([
    supabase.from('products').select('id, name, stock, active, preorder', { count: 'exact' }),
    supabase
      .from('orders')
      .select('id, total, status, payment_method, created_at, shipping_address, notes', {
        count: 'exact',
      })
      .order('created_at', { ascending: false }),
    supabase.from('profiles').select('id', { count: 'exact' }),
  ] as any[])

  const products = (productsRes.data || []) as Array<{
    id: string
    name: string
    stock: number
    active: boolean
    preorder?: boolean
  }>
  const orders = (ordersRes.data || []) as Array<{
    id: string
    total: number
    status: string
    payment_method: string
    created_at: string
    shipping_address: Record<string, unknown>
    notes?: string
  }>
  const customers = (customersRes.data || []) as Array<{ id: string }>

  // Group line items per order
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
      const label = color ? `${base} (${color})` : base
      const key = String(it.order_id)
      const list = itemsByOrder[key] ?? (itemsByOrder[key] = [])
      const existing = list.find((i) => i.name === label)
      if (existing) {
        existing.quantity += Number(it.quantity) || 1
      } else {
        list.push({ name: label, quantity: Number(it.quantity) || 1 })
      }
    }
  }

  const totalRevenue = orders
    .filter((o) => o.status === 'paid' || o.status === 'shipped')
    .reduce((sum, o) => sum + (Number(o.total) || 0), 0)

  const preorderOrders = orders.filter(
    (o) =>
      Boolean((o.shipping_address as Record<string, unknown>)?.preorder_reservation) ||
      o.notes?.toLowerCase().includes('pre-order') ||
      o.notes?.toLowerCase().includes('preorder'),
  )

  return {
    revenue: totalRevenue,
    orderCount: orders.length,
    preorderCount: preorderOrders.length,
    customerCount: customers.length,
    productCount: products.length,
    activeProducts: products.filter((p) => p.active).length,
    preorderProducts: products.filter((p) => p.preorder).length,
    recentOrders: orders.slice(0, 8),
    itemsByOrder,
    readyToPack: orders.filter((o) => o.status === 'paid').slice(0, 6),
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const statCards = [
    {
      label: 'Gross Atelier Revenue',
      value: formatPrice(stats.revenue),
      subtext: 'Settled via Stripe payments',
      icon: DollarSign,
      pill: 'Audited',
    },
    {
      label: 'Orders & Allocations',
      value: stats.orderCount.toString(),
      subtext: `${stats.preorderCount} Pre-Order Allocations`,
      icon: ShoppingBag,
      pill: 'Active',
    },
    {
      label: 'The Circle Members',
      value: stats.customerCount.toString(),
      subtext: 'Registered client accounts',
      icon: Users,
      pill: 'Clients',
    },
    {
      label: 'Catalog & Inventory',
      value: stats.activeProducts.toString(),
      subtext: `${stats.preorderProducts} Made-to-Order drops`,
      icon: Package,
      pill: 'In Stock',
    },
  ]

  return (
    <div className="p-5 sm:p-8 lg:p-12 space-y-10 max-w-[1440px] mx-auto">
      {/* ── Page Header ── */}
      <div className="pb-8 sm:pb-10 border-b border-gray-100 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="max-w-3xl">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 bg-[#F6F6F8] border border-gray-200/80 text-[11px] font-semibold tracking-wider uppercase text-navy/70 mb-4 sm:mb-5 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
            Atelier Management · Dallas, TX
          </div>

          {/* Large display heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-sans font-bold text-navy tracking-[-0.035em] leading-[1.05]">
            Atelier Operations & Performance
          </h1>

          <p className="mt-4 text-sm sm:text-base text-navy/60 max-w-2xl leading-relaxed font-normal">
            Real-time Dallas workshop activity, pre-order reservation allocations, and client dispatch registry.
          </p>
        </div>

        {/* Right side stats pill & meta */}
        <div className="flex flex-wrap items-center lg:flex-col lg:items-end gap-3 pt-2 lg:pt-0">
          <div className="backdrop-blur-md bg-[#F6F6F8] border border-gray-200/80 rounded-full px-5 py-2.5 shadow-xs inline-flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-navy tracking-tight">
              Dallas Backoffice Active
            </span>
          </div>

          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 bg-[#4A4D52] hover:bg-navy text-white text-xs font-semibold uppercase tracking-wider rounded-full px-6 py-2.5 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-[1.01]"
          >
            <Package size={14} className="text-gold" />
            <span>Manage Catalog</span>
          </Link>
        </div>
      </div>

      {/* ── Key Performance Metrics Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.label}
              className="rounded-[32px] sm:rounded-[36px] bg-[#F6F6F8] border border-gray-200/80 p-6 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_8px_32px_rgba(0,0,0,0.05)] hover:border-gray-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-2xl bg-white border border-gray-200/70 flex items-center justify-center text-navy shadow-2xs">
                  <Icon size={18} className="text-gold" />
                </div>
                <span className="rounded-full px-3 py-1 bg-white border border-gray-200/80 text-[10px] font-bold uppercase tracking-wider text-navy/70 shadow-2xs">
                  {card.pill}
                </span>
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-navy/50 font-sans">
                {card.label}
              </p>
              <p className="font-sans font-bold text-3xl sm:text-4xl text-navy tracking-tight mt-1.5">
                {card.value}
              </p>
              <p className="text-xs text-navy/60 font-sans mt-1.5">
                {card.subtext}
              </p>
            </div>
          )
        })}
      </div>

      {/* ── Ready to Pack & Dispatch Section (If Any) ── */}
      {stats.readyToPack.length > 0 && (
        <div className="rounded-[32px] sm:rounded-[40px] bg-white border border-emerald-200/80 p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200/60 shadow-2xs">
                <Truck size={18} />
              </div>
              <div>
                <h2 className="font-sans font-bold text-lg text-navy tracking-tight">
                  Ready to Pack & Ship
                </h2>
                <p className="text-xs text-navy/55 font-sans mt-0.5">
                  {stats.readyToPack.length} paid orders ready for signature dust bag boxing and white-glove dispatch.
                </p>
              </div>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-navy hover:text-gold uppercase tracking-wider flex items-center gap-1.5 py-1 px-3 rounded-full hover:bg-[#F6F6F8] transition-colors"
            >
              <span>View All</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.readyToPack.map((order) => {
              const addr = order.shipping_address as Record<string, string>
              const items = stats.itemsByOrder[order.id] || []
              return (
                <div
                  key={order.id}
                  className="rounded-[28px] bg-[#F6F6F8] border border-gray-200/80 p-5 space-y-3.5 hover:border-gray-300 transition-all shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-navy">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span className="rounded-full px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                      Paid · Pack Now
                    </span>
                  </div>

                  <div>
                    <p className="font-sans font-bold text-sm text-navy">{addr?.fullName || addr?.name || 'Client'}</p>
                    <p className="text-[11px] text-navy/55 mt-0.5">{addr?.city || 'Dallas'}, {addr?.state || 'TX'}</p>
                  </div>

                  <div className="text-[11px] text-navy/70 border-t border-gray-200/60 pt-2.5 space-y-0.5">
                    {items.length === 0 ? (
                      <span>1× Handcrafted Piece</span>
                    ) : (
                      items.map((i, idx) => (
                        <p key={idx} className="truncate">
                          <strong>{i.quantity}×</strong> {i.name}
                        </p>
                      ))
                    )}
                  </div>

                  <div className="pt-2.5 border-t border-gray-200/60 flex items-center justify-between">
                    <span className="font-sans font-bold text-sm text-navy">
                      {formatPrice(order.total)}
                    </span>
                    <OrderStatusDropdown orderId={order.id} currentStatus={order.status} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Recent Atelier Orders & Pre-Order Allocations Table ── */}
      <div className="rounded-[32px] sm:rounded-[40px] bg-white border border-gray-200/80 p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.02)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-gray-100">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 bg-[#F6F6F8] border border-gray-200 text-[10px] font-bold tracking-wider uppercase text-navy/60 mb-2 shadow-2xs">
              <Sparkles size={11} className="text-gold" />
              Live Order Stream
            </div>
            <h2 className="font-sans font-bold text-xl sm:text-2xl text-navy tracking-tight">
              Recent Orders & Pre-Order Allocations
            </h2>
          </div>

          <Link
            href="/admin/orders"
            className="rounded-full px-4 py-2 bg-[#F6F6F8] hover:bg-gray-200/70 text-xs font-semibold uppercase tracking-wider text-navy transition-colors inline-flex items-center gap-1.5 shadow-2xs"
          >
            <span>View All Orders</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto rounded-[24px] border border-gray-200/80">
          <table className="w-full text-left text-sm font-sans">
            <thead>
              <tr className="bg-[#F6F6F8] border-b border-gray-200/80 text-[10px] font-bold uppercase tracking-[0.14em] text-navy/55">
                <th className="px-5 py-4">Manifest ID</th>
                <th className="px-5 py-4">Client / Destination</th>
                <th className="px-5 py-4 hidden md:table-cell">Pieces</th>
                <th className="px-5 py-4">Allocation Type</th>
                <th className="px-5 py-4">Total</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 hidden lg:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats.recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-navy/40 text-xs">
                    No orders or pre-orders recorded yet.
                  </td>
                </tr>
              ) : (
                stats.recentOrders.map((order) => {
                  const addr = order.shipping_address as Record<string, string>
                  const isPreorder =
                    Boolean(addr?.preorder_reservation) ||
                    order.notes?.toLowerCase().includes('pre-order') ||
                    order.notes?.toLowerCase().includes('preorder')
                  const items = stats.itemsByOrder[order.id] || []

                  return (
                    <tr key={order.id} className="hover:bg-[#FBFBFC] transition-colors">
                      <td className="px-5 py-4 font-mono text-xs font-bold text-navy whitespace-nowrap">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-xs text-navy">
                          {addr?.fullName || addr?.name || 'Circle Guest'}
                        </p>
                        <p className="text-[10px] text-navy/45 mt-0.5 truncate max-w-[150px]">
                          {addr?.city ? `${addr.city}, ${addr.state || 'TX'}` : 'Dallas, TX'}
                        </p>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell text-xs text-navy/70 max-w-[200px] truncate">
                        {items.length === 0 ? (
                          '1× Atelier Handbag'
                        ) : (
                          items.map((i) => `${i.quantity}× ${i.name}`).join(', ')
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {isPreorder ? (
                          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 bg-amber-50 border border-amber-200/80 text-[10px] font-bold uppercase tracking-wider text-amber-900 shadow-2xs">
                            <Sparkles size={10} className="text-amber-600" />
                            ✦ Pre-Order
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 bg-emerald-50 border border-emerald-200/80 text-[10px] font-bold uppercase tracking-wider text-emerald-800 shadow-2xs">
                            In Stock
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 font-bold text-xs text-navy whitespace-nowrap">
                        {formatPrice(order.total)}
                      </td>
                      <td className="px-5 py-4">
                        <OrderStatusDropdown orderId={order.id} currentStatus={order.status} />
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell text-[11px] text-navy/50 whitespace-nowrap">
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
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
