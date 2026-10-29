'use client'

import Link from 'next/link'
import { Eye, EyeOff, ArrowRight, Check, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { registerAction } from '@/lib/auth-actions'

export function RegisterForm() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [success, setSuccess] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    setError(null)
    setSubmittedEmail((formData.get('email') as string) || '')
    const result = await registerAction(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-4">
        <div className="w-16 h-16 mx-auto mb-6 bg-emerald-50 border border-emerald-200/80 rounded-full flex items-center justify-center shadow-xs">
          <Check className="w-8 h-8 text-emerald-600" strokeWidth={2.5} />
        </div>
        <h2 className="font-sans font-bold text-2xl sm:text-3xl text-navy tracking-[-0.03em] mb-2">
          Verify Your Atelier Access
        </h2>
        <p className="text-xs sm:text-sm text-navy/60 mb-2 font-sans">
          We sent a verification link to your inbox:
        </p>
        <p className="text-sm font-bold text-navy mb-6 font-sans bg-white border border-gray-200/80 rounded-full px-4 py-2 inline-block shadow-2xs">
          {submittedEmail || 'your email address'}
        </p>
        <p className="text-xs text-navy/50 max-w-sm mx-auto mb-8 leading-relaxed font-sans">
          Click the link in the message to activate your profile and unlock immediate private reservations and order tracking.
        </p>
        <div className="space-y-3">
          <Link
            href="/login"
            className="w-full inline-flex items-center justify-center gap-2 bg-[#4A4D52] hover:bg-navy text-white rounded-full py-4 text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-sm"
          >
            <span>Proceed to Sign In</span>
            <ArrowRight size={14} />
          </Link>
          <Link
            href="/"
            className="block text-xs font-medium text-navy/50 hover:text-navy transition-colors py-2"
          >
            Return to Boutique
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form action={handleSubmit} className="space-y-5" noValidate>
      {/* Heading */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 bg-white border border-gray-200/80 text-[10px] font-semibold tracking-wider uppercase text-navy/70 mb-3 shadow-2xs">
          <Sparkles size={11} className="text-gold" />
          The FÉROCE Circle
        </div>
        <h1 className="font-sans font-bold text-2xl sm:text-3xl md:text-4xl text-navy tracking-[-0.035em] leading-tight mb-2">
          Join The Circle
        </h1>
        <p className="text-xs sm:text-sm text-navy/60 font-sans max-w-sm mx-auto leading-relaxed mb-4">
          Create your atelier profile for exclusive drop invitations, bespoke commissions, and saved creations.
        </p>

        {/* Member Benefits Pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          <span className="rounded-full px-2.5 py-1 bg-white border border-gray-200 text-[10px] font-medium text-navy/70">
            ✦ Private Drops
          </span>
          <span className="rounded-full px-2.5 py-1 bg-white border border-gray-200 text-[10px] font-medium text-navy/70">
            ✦ Atelier Concierge
          </span>
          <span className="rounded-full px-2.5 py-1 bg-white border border-gray-200 text-[10px] font-medium text-navy/70">
            ✦ Express Delivery
          </span>
        </div>
      </div>

      {/* Full Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-[11px] font-sans font-semibold uppercase tracking-wider text-navy/70 mb-2 pl-2"
        >
          Full Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="First & Last Name"
          className="w-full rounded-full bg-white border border-gray-200/90 px-6 py-3.5 text-sm font-sans text-navy placeholder:text-navy/35 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy shadow-xs transition-all duration-200 min-h-[50px]"
          required
          autoComplete="name"
        />
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-[11px] font-sans font-semibold uppercase tracking-wider text-navy/70 mb-2 pl-2"
        >
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="name@example.com"
          className={`w-full rounded-full bg-white border px-6 py-3.5 text-sm font-sans text-navy placeholder:text-navy/35 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy shadow-xs transition-all duration-200 min-h-[50px] ${
            error ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : 'border-gray-200/90'
          }`}
          required
          autoComplete="email"
        />
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="block text-[11px] font-sans font-semibold uppercase tracking-wider text-navy/70 mb-2 pl-2"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Minimum 6 characters"
            className={`w-full rounded-full bg-white border pl-6 pr-14 py-3.5 text-sm font-sans text-navy placeholder:text-navy/35 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy shadow-xs transition-all duration-200 min-h-[50px] ${
              error ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : 'border-gray-200/90'
            }`}
            minLength={6}
            required
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-navy/50 hover:text-navy transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={16} strokeWidth={1.8} /> : <Eye size={16} strokeWidth={1.8} />}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 bg-red-50/90 border border-red-200/90 p-4 text-xs font-sans text-red-700 rounded-2xl">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span className="leading-relaxed">{error}</span>
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#4A4D52] hover:bg-navy text-white rounded-full py-4 text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.08)] flex items-center justify-center gap-2 min-h-[50px] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Creating Atelier Profile…
            </span>
          ) : (
            <>
              <span>Join The Circle</span>
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </div>

      {/* Legal Disclaimer */}
      <p className="text-[11px] text-navy/50 text-center leading-relaxed">
        By creating an atelier profile you agree to our{' '}
        <Link href="/terms" className="text-navy hover:underline underline-offset-2">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="text-navy hover:underline underline-offset-2">
          Privacy Policy
        </Link>
        .
      </p>

      {/* Switch to Login */}
      <div className="text-center pt-3 border-t border-gray-200/70">
        <p className="text-xs text-navy/60 font-sans">
          Already a member of The Circle?{' '}
          <Link
            href="/login"
            className="font-semibold text-navy hover:text-gold transition-colors underline underline-offset-4"
          >
            Sign In
          </Link>
        </p>
      </div>
    </form>
  )
}
