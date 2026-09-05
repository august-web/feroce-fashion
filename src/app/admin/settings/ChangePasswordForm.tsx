'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

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
      // Re-verify identity with the current password before allowing a change.
      if (!email) {
        setError('Could not determine your account email. Please sign in again.')
        setSaving(false)
        return
      }
      const { error: verifyError } = await supabase.auth.signInWithPassword({ email, password: currentPassword })
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
    'w-full border border-line bg-white px-4 py-3 text-[16px] font-sans text-navy placeholder:text-navy/30 focus:outline-none focus:border-navy/40 min-h-[48px]'
  const labelClass = 'block text-[10px] font-sans uppercase tracking-[0.15em] text-navy/50 mb-1.5'

  return (
    <div className="bg-white border border-line p-5 sm:p-6 max-w-md">
      <div className="mb-5">
        <h2 className="font-serif text-lg font-semibold text-navy">Change Password</h2>
        <p className="text-xs text-navy/50 mt-1">
          Signed in as <span className="text-navy/80 font-medium">{email || '…'}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="current-password" className={labelClass}>Current Password</label>
          <input
            id="current-password"
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label htmlFor="new-password" className={labelClass}>New Password</label>
          <input
            id="new-password"
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={inputClass}
            required
          />
          <p className="mt-1 text-[10px] text-navy/40">At least {MIN_LENGTH} characters.</p>
        </div>
        <div>
          <label htmlFor="confirm-password" className={labelClass}>Confirm New Password</label>
          <input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={inputClass}
            required
          />
        </div>

        {error && (
          <div className="border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">{error}</div>
        )}
        {success && (
          <div className="border border-green-200 bg-green-50 px-4 py-3 text-xs text-green-700">
            Password updated. Use it next time you sign in.
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-navy text-white py-3 text-[11px] font-sans uppercase tracking-[0.2em] hover:bg-navy/90 transition-colors min-h-[48px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Updating…' : 'Update Password'}
        </button>
      </form>
    </div>
  )
}
