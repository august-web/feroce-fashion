'use client'

import { useState } from 'react'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      const res = await fetch(url + '/functions/v1/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + key },
        body: JSON.stringify({ type: 'newsletter', to: email, name: email.split('@')[0] }),
      })
      setStatus(res.ok ? 'success' : 'error')
      if (res.ok) setEmail('')
    } catch { setStatus('error') }
    setTimeout(() => setStatus('idle'), 4000)
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-md gap-0 flex-col sm:flex-row">
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address" required
        className="flex-1 border border-line bg-white px-4 py-3 text-[13px] font-sans text-navy placeholder:text-navy/40 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 min-h-[48px] rounded-l-lg sm:rounded-r-none rounded-lg sm:border-r-0 transition-all duration-150" />
      <button type="submit" disabled={status === 'loading'}
        className="bg-navy text-white uppercase font-sans font-medium text-[11px] tracking-[0.2em] rounded-lg sm:rounded-l-none px-8 py-3 min-h-[48px] transition-all duration-150 hover:bg-[#152240] hover:scale-[1.02] active:scale-[0.98] active:bg-[#080e1f] whitespace-nowrap disabled:opacity-50">
        {status === 'loading' ? 'Sending...' : status === 'success' ? 'Subscribed!' : status === 'error' ? 'Try again' : 'Subscribe'}
      </button>
    </form>
  )
}
