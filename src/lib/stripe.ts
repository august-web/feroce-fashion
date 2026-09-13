import Stripe from 'stripe'

/**
 * Lazily-constructed Stripe client. Module-level instantiation breaks
 * `next build` when STRIPE_SECRET_KEY isn't present at build time
 * (page-data collection imports the route modules).
 */
let stripeClient: Stripe | null = null

export function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY is not configured')
    }
    stripeClient = new Stripe(key, { typescript: true })
  }
  return stripeClient
}
