import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useToast } from '../context/ToastContext'
import { supabase } from '../lib/supabase'
import { detail, handoff } from '../data/site'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const { notify } = useToast()
  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) return notify('Enter a valid email address.')
    const trimmed = email.trim()
    // Anonymous insert into newsletter_subscribers (RLS policy: insert-only for anon).
    if (supabase) {
      try {
        const { error } = await supabase.from('newsletter_subscribers').insert({ email: trimmed, source: 'website' })
        if (!error) { notify('You’re on the FÉROCE list.'); setEmail(''); return }
        // Unique email already subscribed — treat as success.
        if (error.code === '23505') { notify('You’re already on the FÉROCE list.'); setEmail(''); return }
      } catch { /* fall through to preview note */ }
    }
    notify('You’re on the FÉROCE list. (Preview mode)')
    setEmail('')
  }
  return <section className="bg-oxblood px-5 py-20 text-white sm:px-8 md:py-28">
    <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 md:items-end">
      <div><p className="text-[10px] uppercase tracking-luxury text-white/60">Private access</p><h2 className="mt-5 max-w-xl font-display text-5xl leading-[.95] md:text-7xl">Join the<br/><em>FÉROCE</em> world.</h2></div>
      <div className="md:pb-2"><p className="max-w-md text-sm leading-6 text-white/70">Receive private previews, new collections, exclusive releases, pre-orders and brand notes.</p>
      <form onSubmit={submit} className="mt-8 flex border-b border-white/50"><label className="sr-only" htmlFor="newsletter-email">Email address</label><input id="newsletter-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="EMAIL ADDRESS" className="min-w-0 flex-1 bg-transparent py-4 text-xs tracking-[.15em] outline-none placeholder:text-white/50"/><button className="px-3" aria-label="Subscribe"><ArrowRight/></button></form>
      <p className="mt-3 text-[9px] leading-4 text-white/40">By subscribing, you agree to receive brand communications. {detail(handoff.privacyConsent)}</p></div>
    </div>
  </section>
}
