'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { AuthShell } from '@/components/auth/AuthShell'
import { ArrowRight, Check, KeyRound } from 'lucide-react'

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
    <AuthShell>
      <div className="space-y-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 bg-white border border-gray-200/80 text-[10px] font-semibold tracking-wider uppercase text-navy/70 mb-3 shadow-2xs">
            <KeyRound size={11} className="text-gold" />
            Security & Recovery
          </div>
          <h1 className="font-sans font-bold text-2xl sm:text-3xl md:text-4xl text-navy tracking-[-0.035em] leading-tight mb-2">
            Reset Password
          </h1>
          <p className="text-xs sm:text-sm text-navy/60 font-sans max-w-sm mx-auto leading-relaxed">
            Enter your email address and we&apos;ll send you a private link to reset your atelier password.
          </p>
        </div>

        {status === 'sent' ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 mx-auto mb-6 bg-emerald-50 border border-emerald-200/80 rounded-full flex items-center justify-center shadow-xs">
              <Check className="w-8 h-8 text-emerald-600" strokeWidth={2.5} />
            </div>
            <h2 className="font-sans font-bold text-xl sm:text-2xl text-navy tracking-[-0.03em] mb-2">
              Reset Link Sent
            </h2>
            <p className="text-xs sm:text-sm text-navy/60 mb-2 font-sans">
              We dispatched instructions to:
            </p>
            <p className="text-sm font-bold text-navy mb-6 font-sans bg-white border border-gray-200/80 rounded-full px-4 py-2 inline-block shadow-2xs">
              {email}
            </p>
            <div className="space-y-3">
              <Link
                href="/login"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#4A4D52] hover:bg-navy text-white rounded-full py-4 text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-sm"
              >
                <span>Return to Sign In</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-[11px] font-sans font-semibold uppercase tracking-wider text-navy/70 mb-2 pl-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full rounded-full bg-white border border-gray-200/90 px-6 py-3.5 text-sm font-sans text-navy placeholder:text-navy/35 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy shadow-xs transition-all duration-200 min-h-[50px]"
              />
            </div>

            {status === 'error' && (
              <div className="flex items-start gap-3 bg-red-50/90 border border-red-200/90 p-4 text-xs font-sans text-red-700 rounded-2xl">
                <span>Unable to send reset link. Please verify your email and try again.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-[#4A4D52] hover:bg-navy text-white rounded-full py-4 text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.08)] flex items-center justify-center gap-2 min-h-[50px] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              {status === 'loading' ? (
                <span>Sending Reset Link…</span>
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>

            <div className="text-center pt-3 border-t border-gray-200/70">
              <Link
                href="/login"
                className="text-xs font-semibold text-navy/70 hover:text-navy transition-colors underline underline-offset-4"
              >
                ← Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </AuthShell>
  )
}
