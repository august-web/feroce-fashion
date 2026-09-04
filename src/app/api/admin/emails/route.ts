import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdminRequest } from '@/lib/admin-auth'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = createAdminClient()


    const body = await req.json()
    const { type, subject, htmlContent, recipientFilter, recipientEmails } = body

    if (!type || !subject || !htmlContent) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    let recipients: string[] = []

    if (recipientFilter === 'all') {
      const { data: profiles } = await supabase.from('profiles').select('email').eq('role', 'customer')
      if (profiles) recipients = profiles.map((p: { email: string }) => p.email)
    } else if (recipientFilter === 'has_orders') {
      const { data: profiles } = await supabase.from('profiles').select('email, id').eq('role', 'customer')
      if (profiles) {
        const withOrders = await Promise.all(
          profiles.map(async (p: { email: string; id: string }) => {
            const { count } = await supabase.from('orders').select('id', { count: 'exact', head: true }).eq('user_id', p.id)
            return { ...p, orderCount: count || 0 }
          })
        )
        recipients = withOrders.filter(c => c.orderCount > 0).map(c => c.email)
      }
    } else if (recipientFilter === 'specific' && recipientEmails?.length) {
      recipients = recipientEmails
    } else {
      return NextResponse.json({ error: 'Invalid recipientFilter' }, { status: 400 })
    }

    if (recipients.length === 0) {
      return NextResponse.json({ error: 'No recipients found' }, { status: 400 })
    }

    const res = await fetch(SUPABASE_URL + '/functions/v1/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + SUPABASE_ANON_KEY },
      body: JSON.stringify({
        type: type,
        to: recipients,
        name: 'there',
        customSubject: subject,
        customHtml: htmlContent,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error('Email send failed:', data)
      return NextResponse.json({ error: data.error || 'Failed to send email' }, { status: 500 })
    }

    // Log the email (table may not exist yet)
    try {
      await supabase.from('email_logs').insert({
        type: type,
        subject: subject,
        recipient_count: recipients.length,
        recipient_filter: recipientFilter,
        sent_by: "admin",
      })
    } catch { /* email_logs table may not exist */ }

    return NextResponse.json({
      success: true,
      id: data.id,
      recipientCount: recipients.length,
      type: type,
    })
  } catch (err: unknown) {
    console.error('Admin email API error:', err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}