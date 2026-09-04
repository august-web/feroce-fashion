import { createClient } from '@/lib/supabase/server'

/**
 * Verifies the current request comes from an authenticated admin
 * (session cookie -> Supabase user -> profiles.role = 'admin').
 * Use this at the top of every /api/admin route handler — the
 * middleware only protects /admin pages, not API routes.
 */
export async function isAdminRequest(): Promise<boolean> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return false

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  return (profile as { role?: string } | null)?.role === 'admin'
}
