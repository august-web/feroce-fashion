import type { Metadata } from 'next'
import { AuthShell } from '@/components/auth/AuthShell'
import { RegisterForm } from './RegisterForm'

export const metadata: Metadata = {
  title: 'Create Account — FÉROCE',
  description: 'Create your Féroce account to track orders and save favorites.',
}

export default function RegisterPage() {
  return (
    <AuthShell>
      <RegisterForm />
    </AuthShell>
  )
}
