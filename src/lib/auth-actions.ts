'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const SITE_URL = 'https://www.ferocefashionff.com'

async function triggerEmail(type: string, to: string, params: Record<string, unknown> = {}) {
  try {
    await fetch(SUPABASE_URL + "/functions/v1/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ type, to, ...params }),
    })
  } catch (err) {
    console.error("Email trigger failed:", type, err)
  }
}

export async function registerAction(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!name || !email || !password) {
    return { error: "All fields are required." }
  }

  const supabase = await createClient()

  // Sign up the user (Supabase may send its own email too — disable in Dashboard if needed)
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, role: "customer" },
      emailRedirectTo: SITE_URL + "/auth/confirm",
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.user) {
    // Create profile row
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({ id: data.user.id, email: data.user.email!, role: "customer" } as never)
    if (profileError) console.error("Profile creation error:", profileError)

    // Generate verification link via Supabase admin API
    const { data: linkData } = await supabase.auth.admin.generateLink({
      type: "signup",
      email,
      password,
      options: { redirectTo: SITE_URL + "/auth/confirm" },
    })

    if (linkData && linkData.properties && linkData.properties.action_link) {
      // Send our branded verification email via Resend
      await triggerEmail("verify-email", email, {
        name,
        verificationUrl: linkData.properties.action_link,
      })
    } else {
      console.warn("Could not generate verification link")
      await triggerEmail("welcome", email, { name })
    }
  }

  redirect("/register?success=true")
}
export async function resendVerificationEmail(email: string) {
  const supabase = await createClient()
  const { data: linkData } = await supabase.auth.admin.generateLink({
    type: "signup",
    email,
    password: "placeholder",
    options: { redirectTo: SITE_URL + "/auth/confirm" },
  })

  if (linkData && linkData.properties && linkData.properties.action_link) {
    await triggerEmail("verify-email", email, {
      name: email.split("@")[0],
      verificationUrl: linkData.properties.action_link,
    })
    return { success: true }
  }
  return { error: "Could not generate verification link" }
}

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email and password are required." }
  }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: error.message }
  }

  if (data.user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single()

    if (profile && (profile as { role: string }).role === "admin") {
      redirect("/admin")
    }
  }

  redirect("/account")
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/")
}
