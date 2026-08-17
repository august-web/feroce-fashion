import { useEffect, useState } from 'react'
import { ArrowUpRight, Boxes, Clock3, ShoppingBag, UserRound, WalletCards } from 'lucide-react'
import { formatMoney } from '../../data/products'
import { supabase } from '../../lib/supabase'

interface LatestOrder { id: string; order_number: string; created_at: string; status: string; total_minor: number; first_name: string; last_name: string; items_count: number }
interface StockBand { label: string; value: number; width: number; color: string }

export function AdminOverview() {
  const [totalSales, setTotalSales] = useState(0)
  const [totalOrders, setTotalOrders] = useState(0)
  const [pendingOrders, setPendingOrders] = useState(0)
  const [customers, setCustomers] = useState(0)
  const [week, setWeek] = useState<{ label: string; total: number; max: number }[]>([])
  const [latest, setLatest] = useState<LatestOrder[]>([])
  const [stock, setStock] = useState<StockBand[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) return
    ;(async () => {
      const ordersRes = await supabase
        .from('orders')
        .select('id,order_number,total_minor,status,created_at,shipping_address->>first_name,shipping_address->>last_name,order_items(count)')
        .order('created_at', { ascending: false })
        .limit(100)
      const orders = (ordersRes.data ?? []) as unknown as (LatestOrder & { total_minor: number; status: string; created_at: string })[]
      const settled = orders.filter(o => !['cancelled', 'refunded'].includes(o.status))
      setTotalSales(settled.reduce((n, o) => n + o.total_minor, 0))
      setTotalOrders(settled.length)
      setPendingOrders(orders.filter(o => o.status === 'pending').length)

      const [customersRes, variantsRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'customer'),
        supabase.from('product_variants').select('product_id,inventory,active,products(status,preorder)'),
      ])
      setCustomers(customersRes.count ?? 0)

      const perProduct = new Map<string, { inventory: number; status: string; preorder: boolean }>()
      for (const v of (variantsRes.data ?? []) as unknown as { product_id: string; inventory: number; active: boolean; products: { status: string; preorder: boolean } | null }[]) {
        const p = v.products
        if (!p) continue
        const row = perProduct.get(v.product_id) ?? { inventory: 0, status: p.status, preorder: p.preorder }
        if (v.active) row.inventory += v.inventory
        perProduct.set(v.product_id, row)
      }
      const products = [...perProduct.values()]
      const active = products.filter(p => p.status === 'active' && !p.preorder)
      const preorders = products.filter(p => p.preorder && p.status === 'active')
      const inStock = active.filter(p => p.inventory > 5).length
      const lowStock = active.filter(p => p.inventory >= 1 && p.inventory <= 5).length
      const out = active.filter(p => p.inventory === 0).length
      const total = Math.max(1, active.length + preorders.length)
      setStock([
        { label: 'In stock', value: inStock, width: Math.round(inStock / total * 100), color: 'bg-moss' },
        { label: 'Low stock', value: lowStock, width: Math.round(lowStock / total * 100), color: 'bg-[#ba7c2f]' },
        { label: 'Out of stock', value: out, width: Math.round(out / total * 100), color: 'bg-oxblood' },
        { label: 'Pre-order', value: preorders.length, width: Math.round(preorders.length / total * 100), color: 'bg-black' },
      ])

      const days: { label: string; total: number; max: number }[] = []
      for (let i = 6; i >= 0; i--) {
        const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - i)
        const next = new Date(d); next.setDate(d.getDate() + 1)
        const dayOrders = settled.filter(o => { const t = new Date(o.created_at); return t >= d && t < next })
        days.push({ label: d.toLocaleDateString('en-GB', { weekday: 'short' }).slice(0, 2), total: dayOrders.reduce((n, o) => n + o.total_minor, 0), max: 0 })
      }
      const max = Math.max(1, ...days.map(d => d.total))
      setWeek(days.map(d => ({ ...d, max })))

      setLatest((orders.slice(0, 5) as LatestOrder[]).map(o => ({
        ...o,
        items_count: (o as unknown as { order_items: { count: number }[] }).order_items?.[0]?.count ?? 0,
        first_name: (o as unknown as { first_name: string }).first_name ?? '',
        last_name: (o as unknown as { last_name: string }).last_name ?? '',
      })))
      setLoading(false)
    })()
  }, [])

  if (loading) return <div className="grid min-h-64 place-items-center"><span className="text-[9px] uppercase tracking-luxury">Loading live store data…</span></div>

  return <div><div className="mb-7"><p className="text-[9px] uppercase tracking-luxury text-black/40">Store at a glance · Live data</p><h1 className="mt-3 font-display text-4xl">Store overview.</h1></div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[
    [WalletCards, 'Total sales', formatMoney(totalSales / 100), 'Verified orders only'],
    [ShoppingBag, 'Total orders', `${totalOrders}`, 'Settled orders'],
    [Clock3, 'Pending orders', `${pendingOrders}`, pendingOrders ? 'Action needed' : 'All clear'],
    [UserRound, 'Customers', `${customers}`, 'Customer accounts'],
  ].map(([Icon, label, value, note]) => <div key={label as string} className="border border-black/10 bg-white p-5"><div className="flex items-center justify-between"><Icon size={18} strokeWidth={1.3} /><ArrowUpRight size={14} className="text-black/35" /></div><p className="mt-8 font-display text-3xl">{value as string}</p><div className="mt-2 flex justify-between"><span className="text-[8px] uppercase tracking-widest text-black/40">{label as string}</span><span className="text-[8px] text-moss">{note as string}</span></div></div>)}</div>
    <div className="mt-5 grid gap-5 xl:grid-cols-[1.5fr_1fr]"><div className="border border-black/10 bg-white p-5 sm:p-7"><div className="flex items-start justify-between"><div><p className="text-[9px] uppercase tracking-luxury text-black/40">Sales performance</p><p className="mt-2 font-display text-2xl">Last 7 days</p></div><span className="text-[8px] uppercase tracking-widest text-black/40">GHS · Live</span></div><div className="mt-9 flex h-52 items-end gap-3 border-b border-black/10 sm:gap-5">{week.map((day, i) => <div key={i} className="flex h-full flex-1 flex-col justify-end gap-2"><div className="group relative w-full bg-ink transition hover:bg-oxblood" style={{ height: `${Math.max(day.total ? 4 : 0, day.total / day.max * 100)}%` }}><span className="absolute -top-6 left-1/2 hidden -translate-x-1/2 text-[8px] group-hover:block">{formatMoney(day.total / 100)}</span></div><span className="pb-2 text-center text-[8px] uppercase text-black/35">{day.label}</span></div>)}</div></div><div className="border border-black/10 bg-white p-5 sm:p-7"><p className="text-[9px] uppercase tracking-luxury text-black/40">Inventory attention</p><p className="mt-2 font-display text-2xl">Stock status</p><div className="mt-8 space-y-6">{stock.map(s => <div key={s.label}><div className="flex justify-between text-[9px]"><span>{s.label}</span><span>{s.value}</span></div><div className="mt-2 h-1 bg-black/10"><div className={`h-full ${s.color}`} style={{ width: `${s.width}%` }} /></div></div>)}</div></div></div>
    <div className="mt-5 border border-black/10 bg-white"><div className="flex items-center justify-between border-b border-black/10 px-5 py-5 sm:px-7"><div><p className="text-[9px] uppercase tracking-luxury text-black/40">Recent activity</p><h2 className="mt-1 font-display text-2xl">Latest orders</h2></div><Boxes size={18} strokeWidth={1.3} /></div>{latest.length ? <div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left"><thead className="text-[8px] uppercase tracking-luxury text-black/40"><tr><th className="px-7 py-4">Order</th><th>Customer</th><th>Date</th><th>Status</th><th>Items</th><th className="pr-7 text-right">Total</th></tr></thead><tbody>{latest.map(o => <tr key={o.id} className="border-t border-black/10 text-xs"><td className="px-7 py-4 font-medium">{o.order_number}</td><td>{[o.first_name, o.last_name].filter(Boolean).join(' ') || '—'}</td><td className="text-black/45">{new Date(o.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</td><td><Status value={o.status} /></td><td>{o.items_count}</td><td className="pr-7 text-right">{formatMoney(o.total_minor / 100)}</td></tr>)}</tbody></table></div> : <p className="px-7 py-10 text-xs text-black/45">No orders yet — they will appear here once the checkout integration is connected.</p>}</div></div>
}

export function Status({ value }: { value: string }) {
  const color = ['delivered', 'paid'].includes(value) ? 'bg-green-700' : ['cancelled', 'refunded'].includes(value) ? 'bg-oxblood' : value === 'pending' ? 'bg-[#ba7c2f]' : 'bg-black'
  const label = value.charAt(0).toUpperCase() + value.slice(1)
  return <span className="inline-flex items-center gap-2 text-[8px] uppercase tracking-widest"><span className={`h-1.5 w-1.5 rounded-full ${color}`} />{label}</span>
}
