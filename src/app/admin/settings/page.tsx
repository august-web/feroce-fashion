import type { Metadata } from 'next'
import { ChangePasswordForm } from './ChangePasswordForm'

export const metadata: Metadata = {
  title: 'Settings — FÉROCE Admin',
}

export default function AdminSettingsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="font-serif text-2xl font-semibold text-navy">Settings</h1>
        <p className="text-sm text-navy/50 mt-1">Manage your admin account.</p>
      </div>
      <ChangePasswordForm />
    </div>
  )
}
