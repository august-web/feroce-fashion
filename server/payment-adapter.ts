// SERVER-ONLY payment adapters. Keep this module out of the browser bundle.
// The provider interface is neutral so additional adapters (PayPal, Cash App, Corner, …)
// can be registered here after merchant eligibility is confirmed.
import Stripe from 'stripe'

export interface CheckoutLine { name: string; quantity: number; unitAmountMinor: number; currency: string }

export interface CreateSessionInput {
  lines: CheckoutLine[]
  successUrl: string
  cancelUrl: string
  customerEmail?: string
  metadata: Record<string, string>
}

export interface ProviderSession { providerReference: string; redirectUrl: string }
export interface WebhookEvent { type: string; providerReference: string }

export interface PaymentProvider {
  createCheckoutSession(input: CreateSessionInput): Promise<ProviderSession>
  verifyWebhook(rawBody: string | Buffer, signature: string): WebhookEvent
}

export class StripeProvider implements PaymentProvider {
  private stripe: Stripe
  private webhookSecret: string

  constructor(secretKey: string, webhookSecret: string) {
    this.stripe = new Stripe(secretKey)
    this.webhookSecret = webhookSecret
  }

  async createCheckoutSession(input: CreateSessionInput): Promise<ProviderSession> {
    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: input.lines.map(l => ({
        price_data: {
          currency: l.currency.toLowerCase(),
          product_data: { name: l.name },
          unit_amount: l.unitAmountMinor,
        },
        quantity: l.quantity,
      })),
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
      customer_email: input.customerEmail,
      metadata: input.metadata,
      // Sessions are short-lived; the webhook cancels still-pending orders on expiry.
      expires_at: Math.floor(Date.now() / 1000) + 60 * 30,
    })
    if (!session.url) throw new Error('Provider did not return a redirect URL.')
    return { providerReference: session.id, redirectUrl: session.url }
  }

  verifyWebhook(rawBody: string | Buffer, signature: string): WebhookEvent {
    const event = this.stripe.webhooks.constructEvent(rawBody, signature, this.webhookSecret)
    const session = event.data.object as Stripe.Checkout.Session
    return { type: event.type, providerReference: session.id }
  }
}

export function requireServerEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing server configuration: ${name}`)
  return value
}
