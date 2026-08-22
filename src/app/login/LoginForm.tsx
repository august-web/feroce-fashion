'use client'

import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
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

  const labelClass = "block text-[11px] font-sans uppercase tracking-[0.08em] text-navy/60 mb-1.5"
  const inputBase = "w-full border border-[#d1cec7] bg-white px-4 text-[16px] font-sans text-navy placeholder:text-[#8a857c]/60 min-h-[48px] transition-all duration-150 ease-out outline-none"
  const inputNormal = `${inputBase} shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] focus:border-gold focus:ring-2 focus:ring-gold/30`
  const inputError = `${inputBase} border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200`

  return (
    <form action={handleSubmit} className="space-y-5" noValidate>
      {/* Heading */}
      <div className="mb-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-navy mb-2">
          Sign In
        </h1>
        <p className="text-sm font-sans" style={{ color: '#8a857c' }}>
          Welcome back to Féroce.
        </p>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className={labelClass}>
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          className={error ? inputError : inputNormal}
          required
          autoComplete="email"
        />
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className={labelClass}>
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Your password"
            className={`${error ? inputError : inputNormal} pr-12`}
            required
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 top-0 flex h-[48px] w-12 items-center justify-center text-[#8a857c] hover:text-navy transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 p-3 text-xs text-red-700 rounded-lg">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0 mt-0.5">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-navy text-white uppercase font-sans font-medium text-[11px] tracking-[0.2em] rounded-lg px-6 py-3.5 min-h-[48px] transition-all duration-150 hover:bg-[#152240] hover:scale-[1.02] active:scale-[0.98] active:bg-[#080e1f] disabled:opacity-50 disabled:pointer-events-none"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Signing In…
          </span>
        ) : (
          'Sign In'
        )}
      </button>

      {/* Links — Forgot = neutral gray, Create one = gold for conversion */}
      <div className="flex items-center justify-between pt-1">
        <a href="/forgot-password" className="text-xs text-[#8a857c] hover:text-navy transition-colors underline underline-offset-2">
          Forgot your password?
        </a>
        <Link href="/register" className="text-xs font-medium text-gold hover:text-navy transition-colors underline underline-offset-2">
          Create one
        </Link>
      </div>
    </form>
  )
}
