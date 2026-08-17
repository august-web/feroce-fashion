import { ArrowUpRight, Mail, MapPin, MessageSquare, Phone } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../components/ui/Button'
import { useToast } from '../context/ToastContext'
import { contact, detail, handoff, type HandoffDetail } from '../data/site'
import { useSeo } from '../lib/seo'
import { supabase } from '../lib/supabase'

type SubmitState = 'idle' | 'sent' | 'preview'
export function ContactPage(){
  useSeo('Contact the house','Contact FÉROCE for product, order, press and partnership enquiries.')
  const {notify}=useToast();const [state,setState]=useState<SubmitState>('idle');const [form,setForm]=useState({name:'',email:'',subject:'',message:''})
  async function submit(e:React.FormEvent){
    e.preventDefault()
    // Anonymous insert into contact_messages (RLS policy: insert-only for anon).
    // Falls back to the preview note when Supabase is unconfigured or the write fails.
    if (supabase) {
      try {
        const { error } = await supabase.from('contact_messages').insert({ name: form.name, email: form.email, subject: form.subject, message: form.message })
        if (!error) { setState('sent'); notify('Message received — the house will be in touch.'); return }
      } catch { /* fall through to preview note */ }
    }
    setState('preview'); notify('Your message was validated — online messaging will be activated at launch.')
  }
  return <main className="bg-ivory"><section className="grid lg:grid-cols-2"><div className="relative min-h-[480px] lg:min-h-[calc(100svh_-_var(--chrome))]"><img src="/images/men-campaign.jpg" alt="FÉROCE client services" className="absolute inset-0 h-full w-full object-cover"/><div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent"/><div className="absolute bottom-8 left-6 text-white sm:bottom-12 sm:left-10"><p className="text-[9px] uppercase tracking-luxury text-white/55">Client services</p><p className="mt-3 max-w-md font-display text-4xl">Every detail deserves attention.</p></div></div><div className="px-5 py-16 sm:px-12 lg:px-16 xl:px-24"><p className="text-[9px] uppercase tracking-luxury text-black/45">Speak with the house</p><h1 className="mt-5 font-display text-6xl">Contact.</h1><p className="mt-5 max-w-lg text-sm leading-7 text-black/50">For collection, order, press or partnership enquiries, leave a message below — or reach us directly at hello@feroce.com.</p>{state==='sent'&&<div className="mt-6 border border-moss/30 bg-bone p-4 text-xs leading-5"><strong>Message received.</strong> Thank you — the house will respond as soon as possible.</div>}
    {state==='preview'&&<div className="mt-6 border border-moss/30 bg-bone p-4 text-xs leading-5"><strong>Message ready:</strong> Your message was validated but not sent — online messaging will be activated at launch.</div>}<form onSubmit={submit} className="mt-8 space-y-5"><Field label="Name" value={form.name} onChange={v=>setForm({...form,name:v})}/><Field type="email" label="Email" value={form.email} onChange={v=>setForm({...form,email:v})}/><Field label="Subject" value={form.subject} onChange={v=>setForm({...form,subject:v})}/><label className="block"><span className="mb-2 block text-[9px] uppercase tracking-[.15em]">Message</span><textarea required rows={5} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} className="w-full resize-none border border-black/20 bg-transparent px-4 py-3 text-sm outline-none focus:border-black"/></label><Button>Send enquiry</Button></form></div></section>
  <section className="bg-bone px-5 py-20 sm:px-8"><div className="mx-auto max-w-7xl"><div className="grid gap-px bg-black/10 sm:grid-cols-2 lg:grid-cols-4">{[{Icon:Mail,title:'Email',value:contact.email,note:detail(handoff.emailInbox)},{Icon:Phone,title:'Telephone',value:detail(handoff.phone)},{Icon:MapPin,title:'Location',value:detail(handoff.location)},{Icon:MessageSquare,title:'Client hours',value:detail(handoff.hours)}].map(({Icon,title,value,note})=><div key={title} className="bg-bone p-7"><Icon size={20} strokeWidth={1.2}/><h2 className="mt-8 font-display text-2xl">{title}</h2><p className="mt-2 text-xs text-black/45">{value}</p>{note&&<p className="mt-2 text-[9px] leading-4 text-black/35">{note}</p>}</div>)}</div><div className="mt-16 grid gap-10 md:grid-cols-2"><div><p className="text-[9px] uppercase tracking-luxury text-black/45">Social</p><h2 className="mt-4 font-display text-4xl">Follow the instinct.</h2></div><div className="flex flex-col">{( [['Instagram', contact.instagram, null], ['TikTok', handoff.tiktok.value, handoff.tiktok], ['Pinterest', handoff.pinterest.value, handoff.pinterest]] as [string, string | null, HandoffDetail | null][] ).map(([name, url, h])=>url?<a key={name} href={url} target="_blank" rel="noreferrer" className="flex items-center justify-between border-b border-black/15 py-4 text-xs transition hover:text-black">{name}<ArrowUpRight size={15}/></a>:<span key={name} className="flex items-center justify-between border-b border-black/15 py-4 text-xs opacity-45">{h ? detail(h) : `${name} — to be supplied`}</span>)}</div></div></div></section></main>
}
function Field({label,value,onChange,type='text'}:{label:string;value:string;onChange:(v:string)=>void;type?:string}){return <label className="block"><span className="mb-2 block text-[9px] uppercase tracking-[.15em]">{label}</span><input required type={type} value={value} onChange={e=>onChange(e.target.value)} className="w-full border border-black/20 bg-transparent px-4 py-3 text-sm outline-none focus:border-black"/></label>}
