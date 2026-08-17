import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowRight, Heart, LogOut, MapPin, Package, Plus, Trash2, UserRound } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { ProductCard } from '../components/ProductCard'
import { useToast } from '../context/ToastContext'
import { useCatalog } from '../context/CatalogContext'
import { useWishlist } from '../context/WishlistContext'
import { formatMoney } from '../data/products'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { useSeo } from '../lib/seo'
import type { Session } from '@supabase/supabase-js'

type AuthMode = 'login' | 'register' | 'reset'

interface ProfileRow { id: string; role: string; first_name: string | null; last_name: string | null; phone: string | null }
interface OrderItemRow { product_name: string; quantity: number; unit_price_minor: number; sku: string; selected_color: string | null }
interface OrderRow { id: string; order_number: string; status: string; created_at: string; total_minor: number; email: string; order_items: OrderItemRow[] }
interface AddressRow {
  id: string; label: string | null; first_name: string; last_name: string; phone: string | null
  line1: string; line2: string | null; city: string; region: string | null; postal_code: string | null; country_code: string; is_default: boolean
}

export function AccountPage() {
  useSeo('Your account', 'Manage your FÉROCE profile, orders, addresses and wishlist.')
  const [session, setSession] = useState<Session | null>(null)
  const [preview, setPreview] = useState(false)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (!supabase) { setLoading(false); return }
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false) })
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])
  if (loading) return <main className="grid min-h-[65svh] place-items-center bg-ivory"><span className="text-[9px] uppercase tracking-luxury">Loading private client area…</span></main>
  if (!session && !preview) return <AuthPanel onPreview={() => setPreview(true)} />
  return <Dashboard session={session} preview={preview} onExit={async () => { if (session && supabase) await supabase.auth.signOut(); setSession(null); setPreview(false) }} />
}

function AuthPanel({ onPreview }: { onPreview: () => void }) {
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { notify } = useToast()
  const [busy, setBusy] = useState(false)
  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!supabase) return notify('Secure sign-in is not available yet.')
    setBusy(true)
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } else if (mode === 'register') {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        notify('Check your email to confirm your account.')
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/account` })
        if (error) throw error
        notify('Password reset email sent.')
      }
    } catch (e) { notify(e instanceof Error ? e.message : 'Authentication failed.') }
    finally { setBusy(false) }
  }
  return <main className="grid min-h-[calc(100svh_-_var(--chrome))] bg-ivory lg:grid-cols-2"><div className="relative hidden lg:block"><img src="/images/women-campaign.jpg" alt="FÉROCE private client" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" /><p className="absolute bottom-10 left-10 max-w-md font-display text-4xl text-white">A private space for pieces you love and orders you own.</p></div><div className="flex items-center px-5 py-16 sm:px-12 lg:px-20"><div className="mx-auto w-full max-w-md"><p className="text-[9px] uppercase tracking-luxury text-black/45">Private client</p><h1 className="mt-5 font-display text-5xl">{mode === 'login' ? 'Welcome back.' : mode === 'register' ? 'Enter the world.' : 'Recover access.'}</h1><p className="mt-4 text-sm leading-6 text-black/50">{mode === 'reset' ? 'We will send a secure reset link to your email.' : 'Access your orders, saved pieces, profile and delivery addresses.'}</p>
    {!isSupabaseConfigured && <div className="mt-6 border border-oxblood/30 bg-bone p-4 text-xs leading-5 text-black/60">Secure sign-in is being configured and will be available at launch.</div>}
    <form onSubmit={submit} className="mt-8 space-y-5"><label className="block"><span className="mb-2 block text-[9px] uppercase tracking-[.15em]">Email</span><input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-black/20 bg-transparent px-4 py-4 outline-none focus:border-black" /></label>{mode !== 'reset' && <label className="block"><span className="mb-2 block text-[9px] uppercase tracking-[.15em]">Password</span><input type="password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)} className="w-full border border-black/20 bg-transparent px-4 py-4 outline-none focus:border-black" /></label>}<Button disabled={busy} className="w-full">{busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : mode === 'register' ? 'Create account' : 'Send reset link'}</Button></form>
    <div className="mt-5 flex justify-between text-[10px]"><button onClick={() => setMode(mode === 'register' ? 'login' : 'register')} className="underline underline-offset-4">{mode === 'register' ? 'Already have an account?' : 'Create an account'}</button><button onClick={() => setMode(mode === 'reset' ? 'login' : 'reset')} className="underline underline-offset-4">{mode === 'reset' ? 'Back to sign in' : 'Forgot password?'}</button></div>{!isSupabaseConfigured && <button onClick={onPreview} className="mt-8 flex w-full items-center justify-between border-t border-black/10 pt-5 text-[9px] uppercase tracking-luxury">Preview account dashboard <ArrowRight size={15} /></button>}</div></div></main>
}

const tabs = [['overview', 'Overview'], ['orders', 'Orders'], ['addresses', 'Addresses'], ['wishlist', 'Wishlist']] as const
const STATUS_LABEL: Record<string, string> = { pending: 'Pending', paid: 'Paid', processing: 'Processing', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled', refunded: 'Refunded' }

function Dashboard({ session, preview, onExit }: { session: Session | null; preview: boolean; onExit: () => void }) {
  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') || 'overview'
  const wishlist = useWishlist()
  const email = session?.user.email
  const userId = session?.user.id ?? null

  const { products } = useCatalog()
  const [profile, setProfile] = useState<ProfileRow | null>(null)
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [addresses, setAddresses] = useState<AddressRow[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!supabase || !userId) { setLoading(false); return }
    const [profileRes, ordersRes, addressesRes] = await Promise.all([
      supabase.from('profiles').select('id,role,first_name,last_name,phone').eq('id', userId).maybeSingle(),
      supabase.from('orders').select('id,order_number,status,created_at,total_minor,email,order_items(product_name,quantity,unit_price_minor,sku,selected_color)').eq('user_id', userId).order('created_at', { ascending: false }),
      supabase.from('addresses').select('*').eq('user_id', userId).order('created_at', { ascending: true }),
    ])
    setProfile((profileRes.data as ProfileRow | null) ?? null)
    setOrders((ordersRes.data as OrderRow[] | null) ?? [])
    setAddresses((addressesRes.data as AddressRow[] | null) ?? [])
    setLoading(false)
  }, [userId])
  useEffect(() => { load() }, [load])

  const saved = useMemo(() => products.filter(p => wishlist.ids.includes(p.slug)), [products, wishlist.ids])

  return <main className="min-h-screen bg-ivory"><section className="bg-oxblood px-5 py-12 text-white sm:px-8 md:py-16"><div className="mx-auto flex max-w-7xl flex-col gap-7 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[9px] uppercase tracking-luxury text-white/45">Private client {preview && '· Preview'}{!preview && supabase && ' · Live'}</p><h1 className="mt-4 font-display text-5xl">{profile?.first_name ? `Good to see you, ${profile.first_name}.` : 'Good to see you.'}</h1>{email && <p className="mt-3 text-xs text-white/55">{email}</p>}</div><button onClick={onExit} className="flex items-center gap-2 text-[9px] uppercase tracking-luxury text-white/70"><LogOut size={14} /> {preview ? 'Exit preview' : 'Sign out'}</button></div></section><div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 md:py-16"><nav className="flex gap-7 overflow-x-auto border-b border-black/10" aria-label="Account sections">{tabs.map(([id, label]) => <button key={id} onClick={() => setParams(id === 'overview' ? {} : { tab: id })} className={`shrink-0 border-b-2 pb-4 text-[9px] uppercase tracking-luxury ${tab === id ? 'border-ink' : 'border-transparent text-black/40'}`}>{label}</button>)}</nav><div className="pt-10">
    {loading ? <span className="text-[9px] uppercase tracking-luxury">Loading your data…</span> :
      tab === 'overview' ? <Overview profile={profile} orders={orders} savedCount={saved.length} addresses={addresses} onSaved={p => setProfile(p)} /> :
      tab === 'orders' ? <Orders orders={orders} /> :
      tab === 'addresses' ? <Addresses rows={addresses} userId={userId} onChanged={load} preview={preview} /> :
      <div>{saved.length ? <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{saved.map(p => <ProductCard key={p.id} product={p} />)}</div> : <Empty icon={<Heart />} title="No saved pieces yet." copy="Use the heart on any product to create your personal edit." />}</div>}
  </div></div></main>
}

function Overview({ profile, orders, savedCount, addresses, onSaved }: { profile: ProfileRow | null; orders: OrderRow[]; savedCount: number; addresses: AddressRow[]; onSaved: (p: ProfileRow) => void }) {
  const { notify } = useToast()
  const [firstName, setFirstName] = useState(profile?.first_name ?? '')
  const [lastName, setLastName] = useState(profile?.last_name ?? '')
  const [phone, setPhone] = useState(profile?.phone ?? '')
  const [busy, setBusy] = useState(false)
  const [dirty, setDirty] = useState(false)
  useEffect(() => { setFirstName(profile?.first_name ?? ''); setLastName(profile?.last_name ?? ''); setPhone(profile?.phone ?? ''); setDirty(false) }, [profile])

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault()
    if (!supabase) return
    setBusy(true)
    const { error, data } = await supabase.from('profiles').update({ first_name: firstName || null, last_name: lastName || null, phone: phone || null }).eq('id', profile!.id).select('id,role,first_name,last_name,phone').single()
    setBusy(false)
    if (error) return notify(error.message)
    onSaved(data as ProfileRow)
    setDirty(false)
    notify('Profile updated.')
  }

  return <div><div className="grid gap-px bg-black/10 sm:grid-cols-3">{[{ Icon: Package, label: 'Orders', value: `${orders.length}` }, { Icon: Heart, label: 'Saved pieces', value: `${savedCount}` }, { Icon: MapPin, label: 'Addresses', value: `${addresses.length}` }].map(({ Icon, label, value }) => <div key={label} className="bg-bone p-7"><Icon size={20} strokeWidth={1.2} /><p className="mt-7 font-display text-3xl">{value}</p><p className="mt-2 text-[9px] uppercase tracking-luxury text-black/45">{label}</p></div>)}</div>
    <div className="mt-10 border border-black/10 p-7"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><UserRound size={20} strokeWidth={1.2} /><h2 className="font-display text-2xl">Profile details</h2></div></div>
      <form onSubmit={saveProfile} className="mt-7 grid gap-4 sm:grid-cols-2">
        <label><span className="mb-2 block text-[8px] uppercase tracking-widest text-black/45">First name</span><input value={firstName} onChange={e => { setFirstName(e.target.value); setDirty(true) }} className="w-full border border-black/20 bg-white px-4 py-3 text-sm outline-none focus:border-black" /></label>
        <label><span className="mb-2 block text-[8px] uppercase tracking-widest text-black/45">Last name</span><input value={lastName} onChange={e => { setLastName(e.target.value); setDirty(true) }} className="w-full border border-black/20 bg-white px-4 py-3 text-sm outline-none focus:border-black" /></label>
        <label className="sm:col-span-2"><span className="mb-2 block text-[8px] uppercase tracking-widest text-black/45">Phone</span><input value={phone} onChange={e => { setPhone(e.target.value); setDirty(true) }} className="w-full border border-black/20 bg-white px-4 py-3 text-sm outline-none focus:border-black" /></label>
        <div className="flex items-center justify-between sm:col-span-2"><p className="text-[9px] text-black/40">Your sign-in email is managed by your FÉROCE account.</p><Button disabled={busy || !dirty}>{busy ? 'Saving…' : 'Save changes'}</Button></div>
      </form></div></div>
}

function Orders({ orders }: { orders: OrderRow[] }) {
  if (!orders.length) return <Empty icon={<Package />} title="No orders yet." copy="Your confirmed purchases will appear here after payment verification." />
  return <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left"><thead className="border-b border-black/15 text-[8px] uppercase tracking-luxury text-black/45"><tr><th className="py-4">Order</th><th>Date</th><th>Status</th><th>Items</th><th>Total</th></tr></thead><tbody className="text-xs">{orders.map(o => <tr key={o.id} className="border-b border-black/10"><td className="py-5 font-medium">{o.order_number}</td><td>{new Date(o.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td><td><OrderStatus status={o.status} /></td><td>{o.order_items.reduce((n, i) => n + i.quantity, 0)}</td><td>{formatMoney(o.total_minor / 100)}</td></tr>)}</tbody></table></div>
}
function OrderStatus({ status }: { status: string }) {
  const color = ['delivered', 'paid'].includes(status) ? 'bg-green-700' : ['cancelled', 'refunded'].includes(status) ? 'bg-oxblood' : status === 'pending' ? 'bg-[#ba7c2f]' : 'bg-black'
  return <span className="inline-flex items-center gap-2 text-[8px] uppercase tracking-widest"><span className={`h-1.5 w-1.5 rounded-full ${color}`} />{STATUS_LABEL[status] ?? status}</span>
}

interface AddressForm { label: string; first_name: string; last_name: string; phone: string; line1: string; line2: string; city: string; region: string; postal_code: string; country_code: string }
const emptyAddress: AddressForm = { label: '', first_name: '', last_name: '', phone: '', line1: '', line2: '', city: '', region: '', postal_code: '', country_code: 'GH' }
function Addresses({ rows, userId, onChanged, preview }: { rows: AddressRow[]; userId: string | null; onChanged: () => void; preview: boolean }) {
  const { notify } = useToast()
  const [editing, setEditing] = useState<AddressRow | null>(null)
  const [creating, setCreating] = useState(false)
  const [busy, setBusy] = useState(false)
  const [form, setForm] = useState<AddressForm>(emptyAddress)
  const field = (k: keyof AddressForm, v: string) => setForm(f => ({ ...f, [k]: v }))

  function startCreate() { setForm(emptyAddress); setCreating(true); setEditing(null) }
  function startEdit(a: AddressRow) { setForm({ label: a.label ?? '', first_name: a.first_name, last_name: a.last_name, phone: a.phone ?? '', line1: a.line1, line2: a.line2 ?? '', city: a.city, region: a.region ?? '', postal_code: a.postal_code ?? '', country_code: a.country_code }); setEditing(a); setCreating(false) }
  function close() { setCreating(false); setEditing(null) }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!supabase || !userId) return
    setBusy(true)
    const payload = { ...form, first_name: form.first_name || '—', last_name: form.last_name || '—' }
    const { error } = editing
      ? await supabase.from('addresses').update(payload).eq('id', editing.id)
      : await supabase.from('addresses').insert({ ...payload, user_id: userId })
    setBusy(false)
    if (error) return notify(error.message)
    notify(editing ? 'Address updated.' : 'Address saved.')
    close(); onChanged()
  }
  async function remove(id: string) {
    if (!supabase) return
    if (!confirm('Remove this saved address?')) return
    const { error } = await supabase.from('addresses').delete().eq('id', id)
    if (!error) { notify('Address removed.'); onChanged() }
  }
  async function makeDefault(id: string) {
    if (!supabase) return
    await supabase.from('addresses').update({ is_default: false }).eq('user_id', userId).eq('is_default', true)
    await supabase.from('addresses').update({ is_default: true }).eq('id', id)
    onChanged()
  }

  if (preview) return <Empty icon={<MapPin />} title="No addresses saved." copy="Your saved addresses will appear here once you add a delivery address." />
  return <div>{rows.length > 0 && <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{rows.map(a => <div key={a.id} className="border border-black/10 bg-white p-6"><div className="flex items-start justify-between"><p className="text-[8px] uppercase tracking-luxury text-black/45">{a.label || 'Address'}</p>{a.is_default && <span className="text-[8px] uppercase tracking-widest text-moss">Default</span>}</div><p className="mt-4 text-sm font-medium">{a.first_name} {a.last_name}</p><p className="mt-2 text-xs leading-5 text-black/55">{a.line1}{a.line2 ? `, ${a.line2}` : ''}<br />{a.city}{a.region ? `, ${a.region}` : ''} {a.postal_code}<br />{a.country_code}{a.phone ? ` · ${a.phone}` : ''}</p><div className="mt-5 flex gap-3 border-t border-black/10 pt-4 text-[8px] uppercase tracking-widest"><button onClick={() => startEdit(a)}>Edit</button>{!a.is_default && <button onClick={() => makeDefault(a.id)}>Set default</button>}<button onClick={() => remove(a.id)} className="ml-auto flex items-center gap-1 text-oxblood"><Trash2 size={12} /> Remove</button></div></div>)}</div>}
    <button onClick={startCreate} className="mt-6 flex items-center gap-2 border border-black/20 px-4 py-3 text-[8px] uppercase tracking-luxury transition hover:bg-ink hover:text-white"><Plus size={13} /> Add delivery address</button>
    {(creating || editing) && <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 px-5"><div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto bg-ivory p-6 sm:p-9"><button onClick={close} className="absolute right-5 top-5 text-xs">Close</button><p className="text-[8px] uppercase tracking-luxury text-black/40">Private client</p><h2 className="mt-3 font-display text-3xl">{editing ? 'Edit address' : 'New address'}</h2><form onSubmit={save} className="mt-6 grid gap-4 sm:grid-cols-2"><AddressField label="Label (Home / Office)" value={form.label} onChange={v => field('label', v)} /><AddressField label="First name *" value={form.first_name} onChange={v => field('first_name', v)} /><AddressField label="Last name *" value={form.last_name} onChange={v => field('last_name', v)} /><AddressField label="Phone" value={form.phone} onChange={v => field('phone', v)} /><div className="sm:col-span-2"><AddressField label="Address line 1 *" value={form.line1} onChange={v => field('line1', v)} /></div><div className="sm:col-span-2"><AddressField label="Address line 2" value={form.line2} onChange={v => field('line2', v)} /></div><AddressField label="City *" value={form.city} onChange={v => field('city', v)} /><AddressField label="Region / State" value={form.region} onChange={v => field('region', v)} /><AddressField label="Postal / ZIP" value={form.postal_code} onChange={v => field('postal_code', v)} /><AddressField label="Country code (GH, GB…)" value={form.country_code} onChange={v => field('country_code', v)} />        {/* Primary/secondary: save is the commit action (dark); cancel discards without saving (outline). */}<div className="flex justify-end gap-3 border-t border-black/10 pt-5 sm:col-span-2"><Button type="button" variant="outline" onClick={close}>Cancel</Button><Button disabled={busy}>{busy ? 'Saving…' : editing ? 'Save changes' : 'Save address'}</Button></div></form></div></div>}
  </div>
}
function AddressField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return <label><span className="mb-2 block text-[8px] uppercase tracking-widest text-black/45">{label}</span><input value={value} onChange={e => onChange(e.target.value)} className="w-full border border-black/20 bg-white px-4 py-3 text-sm outline-none focus:border-black" /></label>
}

function Empty({ icon, title, copy }: { icon: React.ReactNode; title: string; copy: string }) {
  return <div className="flex min-h-72 flex-col items-center justify-center text-center">{icon}<h2 className="mt-5 font-display text-3xl">{title}</h2><p className="mt-3 max-w-sm text-sm leading-6 text-black/50">{copy}</p></div>
}
