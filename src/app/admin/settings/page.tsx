import type { Metadata } from 'next'
import { ChangePasswordForm } from './ChangePasswordForm'
import { Sparkles, ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Settings & Security — FÉROCE Admin',
  description: 'Manage Dallas atelier administrative credentials.',
}

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 text-gold-dark text-[10px] font-mono uppercase tracking-[0.2em] font-semibold mb-2">
          <Sparkles className="w-3 h-3 text-gold" />
          <span>Atelier Security & Credentials</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-navy tracking-tight">
          Admin Settings & Key Access
        </h1>
        <p className="text-xs sm:text-sm text-navy/60 mt-1 max-w-xl">
          Maintain atelier headquarters authentication security and master account credentials.
        </p>
      </div>

      <ChangePasswordForm />
    </div>
  )
}
