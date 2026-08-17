import { Edit3, Eye, Plus, Save, Search, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { PageHead } from './AdminOrders'

interface CollectionRow { id: string; name: string; slug: string; description: string | null; status: string; product_collections: { product_id: string }[] }
interface CustomerRow { id: string; email: string | null; first_name: string | null; last_name: string | null; orders: number }

export function AdminCollections() {
  const [rows, setRows] = useState<CollectionRow[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<CollectionRow | null>(null)
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')
  const [status, setStatus] = useState('draft')

  async function load() {
    if (!supabase) return setLoading(false)
    const { data } = await supabase.from('collections').select('id,name,slug,description,status,product_collections(product_id)').order('name')
    setRows((data as unknown as CollectionRow[]) ?? [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  function startCreate() { setName(''); setStatus('draft'); setCreating(true); setEditing(null) }
  function startEdit(c: CollectionRow) { setName(c.name); setStatus(c.status); setEditing(c); setCreating(false) }
  function close() { setCreating(false); setEditing(null) }

  async function save() {
    if (!supabase) return
    const slug = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    if (!slug) return
    const { error } = editing
      ? await supabase.from('collections').update({ name, slug, status }).eq('id', editing.id)
      : await supabase.from('collections').insert({ name, slug, status })
    if (error) return alert(error.message)
    close(); load()
  }
  async function remove(id: string) {
    if (!supabase) return
    if (!confirm('Delete this collection?')) return
    await supabase.from('collections').delete().eq('id', id)
    load()
  }

  return <div><PageHead title="Collections" copy="Create dynamic edits and connect them to products." action={<button onClick={startCreate} className="flex items-center gap-2 bg-ink px-4 py-3 text-[8px] uppercase tracking-luxury text-white"><Plus size={13} /> New collection</button>} />
    {loading ? <p className="py-12 text-xs text-black/45">Loading collections…</p> : <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{rows.map((r, i) => <div key={r.id} className="border border-black/10 bg-white p-5"><div className="flex justify-between"><span className="text-[8px] uppercase tracking-widest text-black/40">{String(i + 1).padStart(2, '0')} · {r.slug}</span><span className={`text-[8px] uppercase tracking-widest ${r.status === 'active' ? 'text-moss' : 'text-black/45'}`}>{r.status}</span></div><h2 className="mt-10 font-display text-3xl">{r.name}</h2><p className="mt-2 text-[9px] text-black/40">{r.product_collections.length} connected products</p><div className="mt-6 flex gap-2 border-t border-black/10 pt-4"><button onClick={() => startEdit(r)} className="flex items-center gap-2 text-[8px] uppercase tracking-widest"><Edit3 size={13} /> Edit</button><button onClick={() => remove(r.id)} className="ml-auto text-oxblood"><Trash2 size={13} /></button></div></div>)}</div>}
    {(creating || editing) && <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 px-5"><div className="relative w-full max-w-md bg-ivory p-7 sm:p-9"><button onClick={close} className="absolute right-5 top-5"><X /></button><p className="text-[8px] uppercase tracking-luxury text-black/40">Live collection editor</p><h2 className="mt-3 font-display text-3xl">{editing ? 'Edit collection' : 'New collection'}</h2><div className="mt-6 space-y-4"><label className="block"><span className="mb-2 block text-[8px] uppercase tracking-widest text-black/45">Name</span><input value={name} onChange={e => setName(e.target.value)} className="w-full border border-black/15 bg-white p-3 text-sm outline-none" /></label><label className="block"><span className="mb-2 block text-[8px] uppercase tracking-widest text-black/45">Status</span><select value={status} onChange={e => setStatus(e.target.value)} className="w-full border border-black/15 bg-white p-3 text-sm"><option value="draft">Draft</option><option value="active">Active</option><option value="archived">Archived</option></select></label></div><button onClick={save} className="mt-6 flex w-full items-center justify-center gap-2 bg-ink px-5 py-3 text-[8px] uppercase tracking-widest text-white"><Save size={13} /> Save collection</button></div></div>}
  </div>
}

export function AdminCustomers() {
  const [rows, setRows] = useState<CustomerRow[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')

  useEffect(() => {
    if (!supabase) return setLoading(false)
    // profiles and orders both reference auth.users, so PostgREST cannot embed orders under profiles;
    // fetch order counts separately and aggregate client-side.
    Promise.all([
      supabase.from('profiles').select('id,email,first_name,last_name').eq('role', 'customer').order('created_at', { ascending: false }),
      supabase.from('orders').select('user_id'),
    ]).then(([profilesRes, ordersRes]) => {
      const counts = new Map<string, number>()
      for (const o of (ordersRes.data as unknown as { user_id: string }[] | null) ?? []) counts.set(o.user_id, (counts.get(o.user_id) ?? 0) + 1)
      setRows(((profilesRes.data as unknown as Omit<CustomerRow, 'orders'>[] | null) ?? []).map(p => ({ ...p, orders: counts.get(p.id) ?? 0 })))
      setLoading(false)
    })
  }, [])

  const found = rows.filter(r => `${r.first_name ?? ''} ${r.last_name ?? ''} ${r.email ?? ''}`.toLowerCase().includes(q.toLowerCase()))

  return <div><PageHead title="Customers" copy="View approved profile details and order history." />
    <div className="border border-black/10 bg-white"><div className="border-b border-black/10 p-4"><div className="flex max-w-sm items-center border border-black/15 px-3"><Search size={14} /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search customers" className="w-full px-3 py-2.5 text-xs outline-none" /></div></div>
      {loading ? <p className="px-5 py-12 text-xs text-black/45">Loading customers…</p> :
        <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left"><thead className="text-[8px] uppercase tracking-luxury text-black/40"><tr><th className="px-5 py-4">Customer</th><th>Email</th><th>Orders</th><th></th></tr></thead><tbody>{found.map(r => <tr key={r.id} className="border-t border-black/10 text-xs"><td className="px-5 py-5 font-medium">{[r.first_name, r.last_name].filter(Boolean).join(' ') || '—'}</td><td className="text-black/50">{r.email ?? '—'}</td><td>{r.orders}</td><td className="px-5 text-right"><button aria-label="View customer"><Eye size={14} /></button></td></tr>)}</tbody></table></div>}
    </div>
    <p className="mt-4 text-[9px] leading-4 text-black/45">Live records from the protected <code>profiles</code> table. Queries return the minimum required customer data and remain restricted to verified admin roles by Row Level Security.</p>
  </div>
}
