'use client'

import Link from 'next/link'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { loginAction } from '@/lib/auth-actions'

export function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    setError(null)
    const result = await loginAction(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-5" noValidate>
      {/* Heading */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 bg-white border border-gray-200/80 text-[10px] font-semibold tracking-wider uppercase text-navy/70 mb-3 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-gold" />
          Private Access
        </div>
        <h1 className="font-sans font-bold text-2xl sm:text-3xl md:text-4xl text-navy tracking-[-0.035em] leading-tight mb-2">
          Sign In to The Circle
        </h1>
        <p className="text-xs sm:text-sm text-navy/60 font-sans max-w-sm mx-auto leading-relaxed">
          Access your saved creations, active pre-orders, and exclusive atelier allocations.
        </p>
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
        <div className="flex items-center justify-between mb-2 pl-2 pr-1">
          <label
            htmlFor="password"
            className="block text-[11px] font-sans font-semibold uppercase tracking-wider text-navy/70"
          >
            Password
          </label>
          <Link
            href="/forgot-password"
            className="text-[11px] text-navy/50 hover:text-navy transition-colors font-medium hover:underline underline-offset-4"
          >
            Forgot Password?
          </Link>
        </div>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            className={`w-full rounded-full bg-white border pl-6 pr-14 py-3.5 text-sm font-sans text-navy placeholder:text-navy/35 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy shadow-xs transition-all duration-200 min-h-[50px] ${
              error ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : 'border-gray-200/90'
            }`}
            required
            autoComplete="current-password"
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
              Authenticating…
            </span>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </div>

      {/* Switch to Register */}
      <div className="text-center pt-3 border-t border-gray-200/70">
        <p className="text-xs text-navy/60 font-sans">
          Not yet a member of The Circle?{' '}
          <Link
            href="/register"
            className="font-semibold text-navy hover:text-gold transition-colors underline underline-offset-4"
          >
            Create an Account
          </Link>
        </p>
      </div>
    </form>
  )
}
