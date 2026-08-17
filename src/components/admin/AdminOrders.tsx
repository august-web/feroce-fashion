import { ChevronDown, Search, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { formatMoney } from '../../data/products'
import { supabase } from '../../lib/supabase'
import { Status } from './AdminOverview'

const statuses = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']

interface OrderItem { id: string; product_name: string; sku: string; selected_color: string | null; selected_variant: string | null; unit_price_minor: number; quantity: number; line_total_minor: number }
interface OrderRow {
  id: string; order_number: string; email: string; phone: string | null; status: string; created_at: string; total_minor: number
  subtotal_minor: number; shipping_minor: number; tax_minor: number
  first_name: string; last_name: string
  shipping_address: Record<string, string>; order_items: OrderItem[]
}

export function AdminOrders() {
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('')
  const [open, setOpen] = useState<OrderRow | null>(null)
  const [saving, setSaving] = useState(false)

  async function load() {
    if (!supabase) return setLoading(false)
    const { data } = await supabase
      .from('orders')
      .select('id,order_number,email,phone,status,created_at,total_minor,subtotal_minor,shipping_minor,tax_minor,shipping_address->>first_name,shipping_address->>last_name,shipping_address,order_items(product_name,sku,selected_color,selected_variant,unit_price_minor,quantity,line_total_minor)')
      .order('created_at', { ascending: false })
    setOrders((data as unknown as OrderRow[]) ?? [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  async function updateStatus(id: string, status: string) {
    if (!supabase) return
    setSaving(true)
    const { error } = await supabase.from('orders').update({ status }).eq('id', id)
    setSaving(false)
    if (error) return
    setOrders(x => x.map(o => o.id === id ? { ...o, status } : o))
    setOpen(o => o?.id === id ? { ...o, status } : o)
  }

  const found = useMemo(() => orders.filter(o =>
    (!filter || o.status === filter) &&
    `${o.order_number} ${o.email} ${o.first_name} ${o.last_name}`.toLowerCase().includes(q.toLowerCase()),
  ), [orders, q, filter])

  return <div><PageHead title="Order management" copy="Search, review and progress customer orders." />
    <div className="border border-black/10 bg-white"><div className="flex flex-col gap-3 border-b border-black/10 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex max-w-sm flex-1 items-center border border-black/15 px-3"><Search size={14} /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search order or customer" className="w-full px-3 py-2.5 text-xs outline-none" /></div>
      <label className="relative"><select value={filter} onChange={e => setFilter(e.target.value)} className="appearance-none border border-black/15 bg-white py-2.5 pl-3 pr-8 text-[9px] uppercase tracking-widest"><option value="">All statuses</option>{statuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}</select><ChevronDown className="absolute right-3 top-3" size={12} /></label>
    </div>
      {loading ? <p className="px-5 py-12 text-xs text-black/45">Loading orders…</p> : !found.length ? <p className="px-5 py-12 text-xs text-black/45">No orders found. Orders are created by the verified checkout integration.</p> :
      <div className="overflow-x-auto"><table className="w-full min-w-[750px] text-left"><thead className="text-[8px] uppercase tracking-luxury text-black/40"><tr><th className="px-5 py-4">Order</th><th>Customer</th><th>Date</th><th>Status</th><th>Items</th><th className="text-right">Total</th><th></th></tr></thead><tbody>{found.map(o => <tr key={o.id} className="border-t border-black/10 text-xs"><td className="px-5 py-4 font-medium">{o.order_number}</td><td><p>{[o.first_name, o.last_name].filter(Boolean).join(' ') || '—'}</p><p className="mt-1 text-[9px] text-black/40">{o.email}</p></td><td>{new Date(o.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td><td><Status value={o.status} /></td><td>{o.order_items.reduce((n, i) => n + i.quantity, 0)}</td><td className="text-right">{formatMoney(o.total_minor / 100)}</td><td className="px-5 text-right"><button onClick={() => setOpen(o)} className="text-[8px] uppercase tracking-widest underline">Open</button></td></tr>)}</tbody></table></div>}
    </div>
    {open && <div className="fixed inset-0 z-50 flex justify-end bg-black/45"><button className="absolute inset-0" onClick={() => setOpen(null)} aria-label="Close order" /><aside className="relative h-full w-full max-w-lg overflow-y-auto bg-[#f8f6f2] p-6 shadow-2xl sm:p-9"><button onClick={() => setOpen(null)} className="absolute right-5 top-5"><X /></button><p className="text-[8px] uppercase tracking-luxury text-black/40">Order detail · Live</p><h2 className="mt-4 font-display text-4xl">{open.order_number}</h2>
      <div className="mt-8 grid grid-cols-2 gap-4 border-y border-black/10 py-6"><Info label="Customer" value={[open.first_name, open.last_name].filter(Boolean).join(' ') || '—'} /><Info label="Email" value={open.email} /><Info label="Placed" value={new Date(open.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} /><Info label="Total" value={formatMoney(open.total_minor / 100)} /></div>
      <div className="mt-7"><p className="text-[9px] uppercase tracking-widest">Items</p><div className="mt-3 space-y-3">{open.order_items.map(i => <div key={i.id} className="flex items-center justify-between bg-white p-4"><div><p className="text-xs font-medium">{i.product_name}</p><p className="mt-1 text-[9px] text-black/40">{i.sku}{i.selected_color ? ` · ${i.selected_color}` : ''}{i.selected_variant ? ` · ${i.selected_variant}` : ''}</p></div><div className="text-right text-xs"><p>{formatMoney(i.line_total_minor / 100)}</p><p className="mt-1 text-[9px] text-black/40">× {i.quantity}</p></div></div>)}</div></div>
      <div className="mt-7"><p className="text-[9px] uppercase tracking-widest">Update status</p><div className="mt-3 grid grid-cols-2 gap-2">{statuses.map(s => <button key={s} disabled={saving} onClick={() => updateStatus(open.id, s)} className={`border p-3 text-[8px] uppercase tracking-widest ${open.status === s ? 'border-ink bg-ink text-white' : 'border-black/15 bg-white'}`}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>)}</div></div>
      <div className="mt-7 bg-white p-5"><p className="text-[9px] uppercase tracking-widest">Shipping information</p><p className="mt-3 text-xs leading-5 text-black/60">{['first_name', 'last_name'].map(k => open.shipping_address?.[k]).filter(Boolean).join(' ')}{open.shipping_address?.line1 ? <><br />{open.shipping_address.line1}</> : ''}{open.shipping_address?.line2 ? <><br />{open.shipping_address.line2}</> : ''}<br />{[open.shipping_address?.city, open.shipping_address?.region, open.shipping_address?.postal_code].filter(Boolean).join(', ')}{open.shipping_address?.country_code ? <><br />{open.shipping_address.country_code}</> : ''}{open.phone ? <><br />{open.phone}</> : ''}</p></div>
      <div className="mt-4 bg-white p-5"><p className="text-[9px] uppercase tracking-widest">Payment</p><p className="mt-3 text-xs leading-5 text-black/50">Payment confirmation is recorded by the verified webhook integration. Totals are stored in minor units (GHS).</p></div>
    </aside></div>}
  </div>
}
export function PageHead({ title, copy, action }: { title: string; copy: string; action?: React.ReactNode }) {
  return <div className="mb-7 flex items-end justify-between gap-5"><div><p className="text-[9px] uppercase tracking-luxury text-black/40">Store command</p><h1 className="mt-3 font-display text-4xl">{title}</h1><p className="mt-2 text-xs text-black/45">{copy}</p></div>{action}</div>
}
function Info({ label, value }: { label: string; value: string }) {
  return <div><p className="text-[8px] uppercase tracking-widest text-black/40">{label}</p><p className="mt-2 text-xs">{value}</p></div>
}
