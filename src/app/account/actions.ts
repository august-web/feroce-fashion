'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function updateCustomerProfile({ fullName }: { fullName: string }) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Authentication required' }

    const trimmed = fullName.trim()
    if (!trimmed) return { error: 'Name cannot be empty' }

    // Update profiles table
    const admin = createAdminClient()
    const { error: profileError } = await admin
      .from('profiles')
      .update({ full_name: trimmed })
      .eq('id', user.id)

    if (profileError) return { error: profileError.message }

    // Update user metadata in auth
    await supabase.auth.updateUser({
      data: { name: trimmed }
    })

    revalidatePath('/account')
    return { success: true }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update profile'
    return { error: message }
  }
}

export async function updateCustomerPassword({ newPassword }: { newPassword: string }) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Authentication required' }

    if (!newPassword || newPassword.length < 8) {
      return { error: 'Password must be at least 8 characters' }
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) return { error: error.message }

    return { success: true }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update password'
    return { error: message }
  }
}
