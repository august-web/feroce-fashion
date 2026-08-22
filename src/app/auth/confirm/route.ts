import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const token_hash = searchParams.get("token_hash")
  const type = searchParams.get("type") || "signup"
  const next = searchParams.get("next") || "/account"

  // These params come from Supabase generatedLink
  const token = searchParams.get("token")
  const email = searchParams.get("email")

  if (!token_hash && !token) {
    return NextResponse.redirect(new URL("/login?error=missing_token", req.url))
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  const supabase = createClient(supabaseUrl, supabaseKey)

  if (token_hash && type) {
    // Standard Supabase verification flow
    const { error } = await supabase.auth.verifyOtp({
      email: email || "",
      token: token_hash,
      type: type as "signup" | "magiclink" | "recovery" | "email_change",
    })

    if (error) {
      return NextResponse.redirect(new URL("/login?error=verification_failed", req.url))
    }
  } else if (token) {
    // Link-based verification from generateLink
    const { error } = await supabase.auth.verifyOtp({
      email: email || "",
      token: token,
      type: "signup",
    })

    if (error) {
      return NextResponse.redirect(new URL("/login?error=verification_failed", req.url))
    }
  }

  // Email verified — redirect to account
  return NextResponse.redirect(new URL(next + "?verified=true", req.url))
}
