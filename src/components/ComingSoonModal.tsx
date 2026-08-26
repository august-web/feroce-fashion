'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

interface ComingSoonModalProps {
  open: boolean
  onClose: () => void
}

export function ComingSoonModal({ open, onClose }: ComingSoonModalProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null
  if (typeof window === 'undefined') return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) return
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
    } catch {
      setStatus('error')
    }
    setTimeout(() => setStatus('idle'), 4000)
  }

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      {/* Backdrop */}
      <div
        style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(10, 17, 40, 0.7)', backdropFilter: 'blur(6px)' }}
        onClick={onClose}
      />

      {/* Modal card */}
      <div className="relative bg-white border border-line max-w-md w-full px-8 py-10 sm:px-10 sm:py-12 text-center animate-slide-up overflow-hidden">
        {/* Logo backdrop */}
        <div
          className="absolute inset-0 flex items-center justify-center opacity-[0.06] pointer-events-none"
          aria-hidden="true"
        >
          <img src="/logo.png" alt="" className="w-[120%] max-w-none" />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-navy/40 hover:text-navy transition-colors"
          aria-label="Close"
        >
          <X size={18} strokeWidth={1.5} />
        </button>

        {/* Gold accent line */}
        <div className="w-10 h-px bg-gold mx-auto mb-6" />

        {/* Logo */}
        <img src="/logo.png" alt="FÉROCE" className="h-12 sm:h-14 mx-auto mb-2" />

        {/* Badge */}
        <span className="inline-block text-[9px] uppercase tracking-[0.3em] text-gold font-sans font-medium mb-4">
          Coming Soon
        </span>

        <h2 className="font-serif text-xl sm:text-2xl font-semibold text-navy mb-3 leading-snug">
          We're Launching Soon
        </h2>
        <p className="text-sm text-navy/50 mb-6 leading-relaxed max-w-xs mx-auto">
          Fierce elegance, structured luxury. Be the first to shop our handcrafted collection.
        </p>

        {status !== 'success' ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email for early access"
              required
              className="w-full border border-line rounded-lg px-4 py-3.5 text-sm text-navy placeholder:text-navy/35 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all"
            />
            {status === 'error' && (
              <p className="text-xs text-red-500">Something went wrong. Please try again.</p>
            )}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full btn-primary py-3.5 min-h-[48px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'Signing Up...' : 'Get Early Access'}
            </button>
          </form>
        ) : (
          <div className="py-2">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm font-medium text-navy mb-1">You're on the list!</p>
            <p className="text-xs text-navy/50">We'll notify you when we launch.</p>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-6 text-[10px] text-navy/40 uppercase tracking-wider hover:text-navy transition-colors"
        >
          Continue Browsing
        </button>
      </div>
    </div>,
    document.body
  )
}
