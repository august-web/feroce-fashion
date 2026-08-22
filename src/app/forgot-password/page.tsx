'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/login',
      })
      setStatus(error ? 'error' : 'sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="bg-cream min-h-[80svh] flex items-center justify-center px-4 py-12">
      <div className="bg-white border border-line w-full max-w-md p-8 sm:p-10">
        <h1 className="font-serif text-2xl font-semibold text-navy mb-2">Reset Password</h1>
        <p className="text-sm text-navy/50 mb-6">Enter your email and we&apos;ll send you a reset link.</p>

        {status === 'sent' ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <p className="text-sm text-navy mb-2">Check your email.</p>
            <p className="text-xs text-navy/50">We sent a password reset link to <strong>{email}</strong></p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-sans uppercase tracking-[0.1em] text-navy/50 mb-1">Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required
                className="w-full border border-line bg-white px-4 py-3 text-sm font-sans text-navy placeholder:text-navy/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 min-h-[48px] transition-all" />
            </div>
            {status === 'error' && <p className="text-xs text-red-600">Something went wrong. Please try again.</p>}
            <button type="submit" disabled={status === 'loading'}
              className="w-full bg-navy text-white uppercase font-sans font-medium text-[11px] tracking-[0.2em] px-6 py-3.5 min-h-[48px] hover:bg-[#152240] transition-colors disabled:opacity-50">
              {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link href="/login" className="text-xs text-navy/50 hover:text-navy transition-colors">&larr; Back to Sign In</Link>
        </div>
      </div>
    </section>
  )
}
