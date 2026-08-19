'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function registerAction(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!name || !email || !password) {
    return { error: 'All fields are required.' }
  }

  const supabase = await createClient()

  // Create auth user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, role: 'customer' },
    },
  })

  if (error) {
    return { error: error.message }
  }

  // Create profile row
  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        email: data.user.email!,
        role: 'customer',
      } as never)

    if (profileError) {
      console.error('Profile creation error:', profileError)
      // Don't block registration if profile creation fails
    }
  }

  redirect('/account')
}

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Check user role to redirect appropriately
  if (data.user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    if (profile && (profile as { role: string }).role === 'admin') {
      redirect('/admin')
    }
  }

  redirect('/account')
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
