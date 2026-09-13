import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'

/**
 * POST /api/newsletter — newsletter signup.
 * The send-email edge function only accepts the service-role key, so the
 * browser can't call it directly; this server route does it on their behalf.
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const ok = await sendEmail({
      type: 'newsletter',
      to: email,
      name: email.split('@')[0],
    })

    if (!ok) {
      return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}
