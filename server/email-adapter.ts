// SERVER-ONLY transactional email adapter (Resend). The base URL is configurable
// so the full send path can be verified against a stub without a real API key.
import { renderOrderEmail, type EmailKind, type OrderEmailData } from './email-templates'

export interface EmailProvider {
  send(input: { to: string; subject: string; html: string }): Promise<void>
}

export class ResendEmailProvider implements EmailProvider {
  constructor(
    private apiKey: string,
    private from: string,
    private baseUrl = 'https://api.resend.com',
  ) {}

  async send(input: { to: string; subject: string; html: string }): Promise<void> {
    const res = await fetch(`${this.baseUrl}/emails`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: this.from, to: [input.to], subject: input.subject, html: input.html }),
    })
    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      throw new Error(`Resend API ${res.status}: ${detail.slice(0, 300)}`)
    }
  }
}

/** Null when RESEND_API_KEY is absent — the storefront keeps working, emails are skipped with a log line. */
export function buildEmailProvider(env: Record<string, string>): EmailProvider | null {
  if (!env.RESEND_API_KEY) return null
  return new ResendEmailProvider(
    env.RESEND_API_KEY,
    env.MAIL_FROM || 'FÉROCE FASHION_FF <orders@feroce.example>',
    env.RESEND_API_URL || 'https://api.resend.com',
  )
}

/**
 * Render + send one order email. Never throws: a delivery failure is logged so the
 * webhook still acks (Stripe retries would otherwise hammer the endpoint).
 * Returns true when the message was handed to the provider.
 */
export async function sendOrderEmail(
  provider: EmailProvider | null,
  kind: EmailKind,
  data: OrderEmailData,
  to: string,
  storeUrl: string,
): Promise<boolean> {
  if (!provider) {
    console.log(`[email] skipped ${kind} email to ${to} (${data.orderNumber}): RESEND_API_KEY not configured`)
    return false
  }
  const { subject, html } = renderOrderEmail(kind, data, storeUrl)
  try {
    await provider.send({ to, subject, html })
    console.log(`[email] sent ${kind} email to ${to} (${data.orderNumber})`)
    return true
  } catch (error) {
    console.error(`[email] ${kind} send failed for ${data.orderNumber}:`, error instanceof Error ? error.message : error)
    return false
  }
}
