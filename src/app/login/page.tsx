import type { Metadata } from 'next'
import { AuthShell } from '@/components/auth/AuthShell'
import { LoginForm } from './LoginForm'

export const metadata: Metadata = {
  title: 'Sign In — FÉROCE',
  description: 'Sign in to your Féroce account.',
}

export default function LoginPage() {
  return (
    <AuthShell>
      <LoginForm />
    </AuthShell>
  )
}
