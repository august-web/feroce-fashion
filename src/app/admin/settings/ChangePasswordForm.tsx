'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { KeyRound, ShieldCheck, CheckCircle2, AlertCircle, Lock } from 'lucide-react'

const MIN_LENGTH = 8

export function ChangePasswordForm() {
  const [email, setEmail] = useState<string | null>(null)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null)
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required.')
      return
    }
    if (newPassword.length < MIN_LENGTH) {
      setError(`New password must be at least ${MIN_LENGTH} characters.`)
      return
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.')
      return
    }
    if (newPassword === currentPassword) {
      setError('New password must be different from the current one.')
      return
    }

    setSaving(true)
    const supabase = createClient()

    try {
      if (!email) {
        setError('Could not determine your account email. Please sign in again.')
        setSaving(false)
        return
      }
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email,
        password: currentPassword,
      })
      if (verifyError) {
        setError('Current password is incorrect.')
        setSaving(false)
        return
      }

      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword })
      if (updateError) {
        setError(updateError.message)
        setSaving(false)
        return
      }

      setSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const inputClass =
    'w-full rounded-2xl border border-gray-200/90 bg-white px-5 py-3.5 text-sm text-navy placeholder:text-gray-400 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all font-sans shadow-2xs'
  const labelClass =
    'block text-[11px] font-sans uppercase tracking-[0.14em] text-navy/60 font-semibold mb-2'

  return (
    <div className="bg-[#F6F6F8] rounded-[32px] sm:rounded-[40px] border border-gray-200/80 p-6 sm:p-8 max-w-xl shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-5 border-b border-gray-200/70">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white text-gold border border-gray-200/70 flex items-center justify-center shadow-2xs">
            <KeyRound size={20} />
          </div>
          <div>
            <h2 className="font-sans font-bold text-lg text-navy tracking-tight">Update Director Passkey</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs text-navy/60 font-sans">
                Active account: <strong className="text-navy">{email || '...'}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="current-password" className={labelClass}>
            Current Passkey
          </label>
          <input
            id="current-password"
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••••••"
            className={inputClass}
            required
          />
        </div>

        <div>
          <label htmlFor="new-password" className={labelClass}>
            New Master Passkey
          </label>
          <input
            id="new-password"
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••••••"
            className={inputClass}
            required
          />
          <p className="mt-2 text-xs text-navy/50 font-sans">
            Requires at least {MIN_LENGTH} characters with numbers and symbols.
          </p>
        </div>

        <div>
          <label htmlFor="confirm-password" className={labelClass}>
            Verify New Master Passkey
          </label>
          <input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••••••"
            className={inputClass}
            required
          />
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700 flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-700 flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>Master credentials updated successfully. Please retain your new passkey.</span>
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-[#4A4D52] hover:bg-navy text-white text-xs font-semibold uppercase tracking-wider py-3.5 rounded-full transition-all duration-300 shadow-sm hover:shadow-md hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                <span>Updating Credentials...</span>
              </>
            ) : (
              <>
                <Lock size={14} className="text-gold" />
                <span>Save New Passkey</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
