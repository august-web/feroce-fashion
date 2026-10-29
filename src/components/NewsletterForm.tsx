'use client'

import { useState } from 'react'
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setStatus(res.ok ? 'success' : 'error')
      if (res.ok) setEmail('')
    } catch {
      setStatus('error')
    }
    setTimeout(() => setStatus('idle'), 4500)
  }

  if (status === 'success') {
    return (
      <div className="mx-auto inline-flex items-center gap-2.5 rounded-full px-5 py-3 bg-white/10 backdrop-blur-md border border-gold/40 text-white shadow-sm animate-fade-in text-left">
        <CheckCircle2 size={16} className="text-gold shrink-0" />
        <span className="text-xs font-medium tracking-wide">
          Welcome to the Inner Circle. An invitation has been dispatched.
        </span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-md">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-1.5 p-1.5 sm:rounded-full rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 focus-within:border-gold/80 focus-within:ring-2 focus-within:ring-gold/25 transition-all shadow-inner">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          required
          className="flex-1 bg-transparent px-4 sm:px-5 py-3 sm:py-2 text-sm text-white placeholder:text-white/45 focus:outline-none font-sans"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="rounded-full bg-gold hover:bg-gold/90 text-[#0A1128] font-sans font-bold text-[11px] tracking-widest uppercase px-6 py-3 sm:py-2.5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] inline-flex items-center justify-center gap-2 shrink-0 shadow-sm disabled:opacity-50"
        >
          {status === 'loading' ? (
            <>
              <Loader2 size={13} className="animate-spin text-[#0A1128]" />
              <span>Joining...</span>
            </>
          ) : status === 'error' ? (
            <span>Retry</span>
          ) : (
            <>
              <span>Subscribe</span>
              <ArrowRight size={13} className="text-[#0A1128]" />
            </>
          )}
        </button>
      </div>
      {status === 'error' && (
        <p className="text-[11px] text-rose-300 mt-2 font-medium">
          Unable to subscribe right now. Please try again.
        </p>
      )}
    </form>
  )
}
