import { ArrowLeft, Check, ChevronDown, LockKeyhole, ShoppingBag, X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, ButtonLink } from '../components/ui/Button'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { formatMoney } from '../data/products'
import { createCheckoutSession, serializeLines } from '../lib/payments'
import { useSeo } from '../lib/seo'

const countries = ['Ghana','Nigeria','Côte d’Ivoire','United Kingdom','United States','Other']
const methods = [
  { id:'card', label:'Card / Apple Pay', note:'Cards and digital wallets' },
  { id:'paypal', label:'PayPal', note:'Pay with your PayPal account' },
  { id:'cashapp', label:'Cash App', note:'Pay with Cash App' },
  { id:'corner', label:'Corner', note:'Pay with Corner' },
  { id:'other', label:'Other provider', note:'More options at checkout' },
]

export function CheckoutPage() {
  useSeo('Secure checkout','Complete your FÉROCE order through a secure, provider-hosted checkout.')
  const cart=useCart(); const {notify}=useToast(); const [payment,setPayment]=useState('card'); const [notice,setNotice]=useState(false); const [loading,setLoading]=useState(false)
  const [form,setForm]=useState<Record<string,string>>({firstName:'',lastName:'',email:'',phone:'',address:'',city:'',region:'',country:'Ghana',postalCode:''})
  const shipping=0; const taxes=0; const total=cart.subtotal+shipping+taxes
  function field(name:string,value:string){setForm(f=>({...f,[name]:value}))}
  async function placeOrder(){
    const required=['firstName','lastName','email','phone','address','city','country']
    if(required.some(k=>!form[k]?.trim())) return notify('Complete all required customer and shipping fields.')
    if(!/^\S+@\S+\.\S+$/.test(form.email)) return notify('Enter a valid email address.')
    setLoading(true)
    try { const session=await createCheckoutSession({customer:form,shippingMethod:'configured-at-launch',paymentMethod:payment,lines:serializeLines(cart.lines)}); window.location.assign(session.redirectUrl) }
    catch (e) { const message=e instanceof Error?e.message:''; if(/not configured/i.test(message)) setNotice(true); else notify(message||'Unable to start secure payment.') }
    finally {setLoading(false)}
  }
  if(!cart.lines.length) return <main className="grid min-h-[70svh] place-items-center bg-ivory px-5 text-center"><div><ShoppingBag className="mx-auto" size={36} strokeWidth={1}/><h1 className="mt-6 font-display text-5xl">Your bag is empty.</h1><p className="mt-4 text-sm text-black/50">Add a piece before beginning checkout.</p><ButtonLink to="/shop" className="mt-8">Explore the collection</ButtonLink></div></main>
  return <main className="min-h-screen bg-ivory"><div className="mx-auto grid max-w-[1400px] lg:grid-cols-[1fr_470px]">
    <section className="px-5 py-10 sm:px-10 md:py-16 lg:px-16 xl:px-24"><Link to="/shop" className="inline-flex items-center gap-2 text-[9px] uppercase tracking-luxury"><ArrowLeft size={14}/> Continue shopping</Link><div className="mt-10 flex items-end justify-between border-b border-black/10 pb-7"><div><p className="text-[9px] uppercase tracking-luxury text-black/45">Private client checkout</p><h1 className="mt-4 font-display text-5xl sm:text-6xl">Complete your order.</h1></div><LockKeyhole className="hidden sm:block" strokeWidth={1}/></div>
      <div className="mt-10"><StepTitle number="01" title="Contact & delivery"/><div className="mt-6 grid gap-4 sm:grid-cols-2"><Field label="First name *" value={form.firstName} onChange={v=>field('firstName',v)}/><Field label="Last name *" value={form.lastName} onChange={v=>field('lastName',v)}/><Field type="email" label="Email *" value={form.email} onChange={v=>field('email',v)}/><Field type="tel" label="Phone *" value={form.phone} onChange={v=>field('phone',v)}/><div className="sm:col-span-2"><Field label="Shipping address *" value={form.address} onChange={v=>field('address',v)}/></div><Field label="City *" value={form.city} onChange={v=>field('city',v)}/><Field label="State / Province" value={form.region} onChange={v=>field('region',v)}/><label className="relative"><span className="mb-2 block text-[9px] uppercase tracking-[.15em] text-black/60">Country *</span><select value={form.country} onChange={e=>field('country',e.target.value)} className="w-full appearance-none border border-black/20 bg-transparent px-4 py-3.5 text-sm outline-none focus:border-black">{countries.map(c=><option key={c}>{c}</option>)}</select><ChevronDown size={14} className="pointer-events-none absolute bottom-4 right-4"/></label><Field label="Postal / ZIP code" value={form.postalCode} onChange={v=>field('postalCode',v)}/></div></div>
      <div className="mt-12"><StepTitle number="02" title="Shipping"/><div className="mt-6 border border-oxblood bg-white p-5"><div className="flex items-center justify-between"><div><p className="text-sm font-medium">Delivery method — client to supply</p><p className="mt-2 text-xs leading-5 text-black/50">Approved shipping markets, rates and delivery windows are pending brand confirmation.</p></div><Check className="text-oxblood" size={18}/></div></div></div>
      <div className="mt-12"><StepTitle number="03" title="Payment"/><p className="mt-4 max-w-xl text-xs leading-5 text-black/50">Choose a preferred method. No card or wallet details are stored on this site — a secure payment provider handles them at checkout.</p><div className="mt-5 grid gap-2 sm:grid-cols-2">{methods.map(m=><button key={m.id} onClick={()=>setPayment(m.id)} className={`p-4 text-left transition ${payment===m.id?'bg-ink text-white':'border border-black/15 bg-white'}`}><div className="flex items-center gap-3"><span className={`grid h-4 w-4 place-items-center rounded-full border ${payment===m.id?'border-white':'border-black/40'}`}>{payment===m.id&&<span className="h-1.5 w-1.5 rounded-full bg-white"/>}</span><span className="text-xs font-medium">{m.label}</span></div><p className={`ml-7 mt-2 text-[9px] leading-4 ${payment===m.id?'text-white/55':'text-black/45'}`}>{m.note}</p></button>)}</div></div>
      <div className="mt-10 flex items-start gap-3 bg-bone p-4"><LockKeyhole size={16} className="mt-0.5 shrink-0"/><p className="text-[10px] leading-5 text-black/55">Your payment details are handled by a secure provider, never by this site. Your total is confirmed from the live catalog before you pay.</p></div>
    </section>
    <aside className="border-l border-black/10 bg-bone px-5 py-10 sm:px-10 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:py-16"><p className="text-[9px] uppercase tracking-luxury text-black/50">Order summary</p><div className="mt-7 space-y-5">{cart.lines.map(line=><div key={cart.lineKey(line)} className="grid grid-cols-[78px_1fr_auto] gap-3"><div className="relative"><img src={line.product.image} alt={line.product.name} className="aspect-square object-cover"/><span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[8px] text-white">{line.quantity}</span></div><div><h3 className="font-display text-lg">{line.product.name}</h3><p className="mt-1 text-[9px] text-black/50">{line.color} · {line.variant}</p></div><div className="text-right"><p className="text-xs">{formatMoney(line.product.price*line.quantity)}</p></div></div>)}</div><div className="mt-8 space-y-3 border-y border-black/10 py-6 text-xs"><SummaryRow label="Subtotal" value={formatMoney(cart.subtotal)}/><SummaryRow label="Shipping" value="Calculated at checkout"/><SummaryRow label="Taxes" value="Calculated at checkout"/></div><div className="flex items-end justify-between py-6"><span className="font-display text-2xl">Total</span><div className="text-right"><span className="font-display text-2xl">{formatMoney(total)}</span></div></div><Button onClick={placeOrder} disabled={loading} className="w-full">{loading?'Connecting securely…':'Place order'}</Button><p className="mt-4 text-center text-[9px] leading-4 text-black/45">You are not charged until your order is confirmed.</p></aside>
  </div>
  {notice&&<div className="fixed inset-0 z-[100] grid place-items-center bg-black/55 px-5 backdrop-blur-sm"><div className="relative max-w-lg bg-ivory p-7 shadow-2xl sm:p-10"><button onClick={()=>setNotice(false)} className="absolute right-5 top-5" aria-label="Close"><X size={19}/></button><p className="text-[9px] uppercase tracking-luxury text-oxblood">Secure checkout</p><h2 className="mt-5 font-display text-4xl">Checkout is not live yet.</h2><p className="mt-5 text-sm leading-6 text-black/60">No payment was attempted and no order was created. Secure online checkout will open once the approved payment provider is connected before launch.</p>{/* Primary/secondary: return to checkout is the task action (dark); preview confirmation is exploratory (outline). */}<div className="mt-7 flex flex-wrap gap-3"><Button onClick={()=>setNotice(false)}>Return to checkout</Button><ButtonLink to="/order-confirmation?preview=true" variant="outline">Preview confirmation</ButtonLink></div></div></div>}
  </main>
}

function Field({label,value,onChange,type='text'}:{label:string;value:string;onChange:(v:string)=>void;type?:string}){return <label><span className="mb-2 block text-[9px] uppercase tracking-[.15em] text-black/60">{label}</span><input type={type} value={value} onChange={e=>onChange(e.target.value)} className="w-full border border-black/20 bg-transparent px-4 py-3.5 text-sm outline-none transition focus:border-black"/></label>}
function StepTitle({number,title}:{number:string;title:string}){return <div className="flex items-center gap-3"><span className="grid h-7 w-7 place-items-center border border-black/20 text-[8px]">{number}</span><h2 className="font-display text-2xl">{title}</h2></div>}
function SummaryRow({label,value}:{label:string;value:string}){return <div className="flex justify-between gap-3"><span className="text-black/50">{label}</span><span className="text-right">{value}</span></div>}
