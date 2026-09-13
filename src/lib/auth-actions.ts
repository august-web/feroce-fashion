'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
// The send-email edge function rejects the public anon key — it only
// accepts the service-role key, so email can't be sent by third parties.
const EMAIL_FUNCTION_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const SITE_URL = 'https://www.ferocefashionff.com'

async function triggerEmail(type: string, to: string, params: Record<string, unknown> = {}) {
  try {
    await fetch(SUPABASE_URL + "/functions/v1/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + EMAIL_FUNCTION_KEY,
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

    // Generate verification link via Supabase admin API. This requires the
    // service-role key (the anon-key server client would always fail), so
    // use the admin client — server-side only; the link goes to the user's
    // own email address.
    const adminSupabase = createAdminClient()
    const { data: linkData } = await adminSupabase.auth.admin.generateLink({
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

    // Land the customer where they want to be instead of the signup screen.
    // If Supabase already returned a session (email confirmation disabled),
    // go straight to the account dashboard; otherwise try an immediate
    // password sign-in. If confirmation is still pending, let them browse
    // the shop — the branded verification email is already on its way.
    if (data.session) {
      redirect("/account")
    }
    const { data: signIn } = await supabase.auth.signInWithPassword({ email, password })
    if (signIn.session) {
      redirect("/account")
    }
    redirect("/shop")
  }

  redirect("/register?success=true")
}
export async function resendVerificationEmail(email: string) {
  // Service-role client — generateLink is an admin API call and fails with
  // the anon key. Only emailed to the address itself, so no link leakage.
  const adminSupabase = createAdminClient()
  const { data: linkData } = await adminSupabase.auth.admin.generateLink({
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
