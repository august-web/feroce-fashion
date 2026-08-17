// FÉROCE FASHION_FF checkout server.
// Runs on API_PORT (default 8787); the Vite dev server proxies /api here.
import express, { type Request, type Response } from 'express'
import { loadEnv } from './config'
import { admin, isAdminConfigured, CheckoutError, createPendingOrder, getPaymentStatus, getOrderForEmail, type CustomerFields } from './admin'
import { StripeProvider, type PaymentProvider } from './payment-adapter'
import { buildEmailProvider, sendOrderEmail, type EmailProvider } from './email-adapter'
import { checkoutBodySchema, validationMessage } from './validation'
import { rateLimit } from './rate-limit'

const env = loadEnv()
const port = Number(env.API_PORT || 8787)

const intEnv = (name: string, fallback: number) => {
  const value = Number(env[name])
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : fallback
}

// Fixed-window limits (per minute, in-memory — see server/rate-limit.ts).
const rate = {
  checkoutIp: intEnv('RATE_LIMIT_CHECKOUT_IP', 15),
  checkoutUser: intEnv('RATE_LIMIT_CHECKOUT_USER', 30),
  webhookIp: intEnv('RATE_LIMIT_WEBHOOK_IP', 120),
  statusIp: intEnv('RATE_LIMIT_STATUS_IP', 60),
}
const RATE_WINDOW_MS = 60_000

function buildProvider(): PaymentProvider | null {
  if (!env.STRIPE_SECRET_KEY || !env.STRIPE_WEBHOOK_SECRET) return null
  return new StripeProvider(env.STRIPE_SECRET_KEY, env.STRIPE_WEBHOOK_SECRET)
}
const provider = buildProvider()
const emailProvider: EmailProvider | null = buildEmailProvider(env)
const storeUrl = (env.APP_URL || `http://localhost:${port}`).replace(/\/$/, '')

/** Send the transactional email for an order after a real state transition. */
async function emailForOrder(orderId: string): Promise<void> {
  const bundle = await getOrderForEmail(orderId)
  if (!bundle) {
    console.error('[email] order data missing for', orderId)
    return
  }
  await sendOrderEmail(emailProvider, bundle.kind, bundle.data, bundle.email, storeUrl)
}

const app = express()
// The webhook route must capture the RAW body before any JSON parsing middleware runs,
// because signature verification signs the exact bytes Stripe sent.
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req: Request, res: Response) => {
  const ip = (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown'
  const wh = rateLimit(`wh:${ip}`, rate.webhookIp, RATE_WINDOW_MS)
  if (wh.limited) return rateLimitedResponse(res, wh.retryAfterSeconds)
  try {
    if (!provider) return json(res, 503, { message: 'Webhook handling is not configured.' })
    const signature = req.headers['stripe-signature']
    if (typeof signature !== 'string') return json(res, 400, { message: 'Missing signature.' })
    const event = provider.verifyWebhook(req.body as Buffer, signature)

    const { data: payment } = await admin.from('payments').select('id,status').eq('provider_payment_id', event.providerReference).maybeSingle()
    if (!payment) return json(res, 200, { received: true, ignored: 'unknown session' })

    if (event.type === 'checkout.session.completed') {
      if (payment.status !== 'pending') return json(res, 200, { received: true, ignored: 'already handled' })
      // The RPC returns the order id only when the payment actually transitioned,
      // so replays/races can never fire a second confirmation email.
      const { data: confirmed } = await admin.rpc('confirm_order_payment', { p_payment_id: payment.id })
      if (typeof confirmed === 'string') await emailForOrder(confirmed)
    } else if (event.type === 'checkout.session.expired') {
      if (payment.status !== 'pending') return json(res, 200, { received: true, ignored: 'already handled' })
      const { data: cancelled } = await admin.rpc('cancel_order_payment', { p_payment_id: payment.id })
      if (typeof cancelled === 'string') await emailForOrder(cancelled)
    }
    return json(res, 200, { received: true })
  } catch (error) {
    console.error('stripe_webhook_error', error instanceof Error ? error.message : 'invalid signature or payload')
    return json(res, 400, { error: 'Webhook verification failed.' })
  }
})
app.use(express.json({ limit: '100kb' }))

// Same-origin redirect targets. In dev the browser's own origin is used so any Vite port works.
function baseUrl(req: Request) {
  const origin = req.headers.origin || req.headers.referer
  if (origin) return origin.replace(/\/$/, '')
  return (env.APP_URL || `http://localhost:${port}`).replace(/\/$/, '')
}

function json(res: Response, status: number, body: unknown) {
  res.status(status).json(body)
}

function rateLimitedResponse(res: Response, retryAfterSeconds: number) {
  res.set('Retry-After', String(retryAfterSeconds))
  return json(res, 429, { message: 'Too many requests. Please try again shortly.' })
}

// --- POST /api/checkout/session ---------------------------------------------------------------
app.post('/api/checkout/session', async (req: Request, res: Response) => {
  const ip = (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown'
  const ipHit = rateLimit(`ip:${ip}`, rate.checkoutIp, RATE_WINDOW_MS)
  if (ipHit.limited) return rateLimitedResponse(res, ipHit.retryAfterSeconds)
  try {
    // Validate first — cheap, and an unconfigured server should not leak its state to malformed calls.
    const parsed = checkoutBodySchema.safeParse(req.body)
    if (!parsed.success) return json(res, 400, { message: `Invalid checkout payload: ${validationMessage(parsed.error)}` })

    if (!isAdminConfigured()) return json(res, 503, { message: 'Payment is not configured. Add server environment values.' })
    if (!provider) return json(res, 503, { message: 'Payment is not configured. Add STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET, then restart the server.' })

    // Associate the order with the signed-in Supabase user when a session token is present.
    let userId: string | null = null
    const authHeader = req.headers.authorization
    if (authHeader?.startsWith('Bearer ')) {
      const { data } = await admin.auth.getUser(authHeader.slice(7))
      userId = data.user?.id ?? null
    }

    if (userId) {
      const userHit = rateLimit(`user:${userId}`, rate.checkoutUser, RATE_WINDOW_MS)
      if (userHit.limited) return rateLimitedResponse(res, userHit.retryAfterSeconds)
    }

    const c = parsed.data.customer
    const customer: CustomerFields = {
      email: c.email,
      phone: c.phone || undefined,
      firstName: c.firstName || undefined,
      lastName: c.lastName || undefined,
      line1: c.address || undefined,
      line2: c.address2 || undefined,
      city: c.city || undefined,
      region: c.region || undefined,
      postalCode: c.postalCode || undefined,
      country: c.country || undefined,
    }

    const order = await createPendingOrder(parsed.data.lines, customer, userId)
    const origin = baseUrl(req)
    let session
    try {
      session = await provider.createCheckoutSession({
        // Line items and amounts come from the verified database snapshots, never the browser.
        lines: order.items.map(i => ({ name: i.name, quantity: i.quantity, unitAmountMinor: i.unitAmountMinor, currency: order.currency })),
        successUrl: `${origin}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${origin}/checkout?cancelled=1`,
        customerEmail: customer.email,
        metadata: { order_id: order.orderId, order_number: order.orderNumber },
      })
    } catch (e) {
      // Provider call failed — remove the pending order (cascades items + payment) so no orphan
      // orders are left behind; the customer retries from the bag.
      await admin.from('orders').delete().eq('id', order.orderId)
      throw new CheckoutError(`Payment provider error: ${e instanceof Error ? e.message : 'unknown'}`, 502)
    }

    await admin.from('payments').update({ provider_payment_id: session.providerReference, raw_metadata: { session_id: session.providerReference } }).eq('id', order.paymentId)

    // Order received while payment is being verified.
    const bundle = await getOrderForEmail(order.orderId)
    if (bundle) await sendOrderEmail(emailProvider, 'pending', bundle.data, bundle.email, storeUrl)

    return json(res, 200, { redirectUrl: session.redirectUrl, orderNumber: order.orderNumber })
  } catch (error) {
    if (error instanceof CheckoutError) return json(res, error.status, { message: error.message })
    console.error('checkout_session_error', error instanceof Error ? error.message : 'unknown')
    return json(res, 500, { message: 'Unable to start secure payment.' })
  }
})

// --- GET /api/checkout/status -----------------------------------------------------------------
// Verified read used by the confirmation page. Returns minimal order data only when the
// provider webhook has marked the payment paid — a browser success redirect is never proof.
app.get('/api/checkout/status', async (req: Request, res: Response) => {
  const ip = (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown'
  const st = rateLimit(`st:${ip}`, rate.statusIp, RATE_WINDOW_MS)
  if (st.limited) return rateLimitedResponse(res, st.retryAfterSeconds)
  const sessionId = String(req.query.session_id || '')
  if (!sessionId) return json(res, 400, { message: 'Missing session_id.' })
  try {
    const status = await getPaymentStatus(sessionId)
    return json(res, status.status === 'unknown' ? 404 : 200, status)
  } catch (error) {
    console.error('checkout_status_error', error instanceof Error ? error.message : 'unknown')
    return json(res, 500, { message: 'Unable to check order status.' })
  }
})

app.get('/api/health', (_req: Request, res: Response) => json(res, 200, { ok: true, provider: provider ? 'stripe' : 'unconfigured' }))

const server = app.listen(port, () => {
  console.log(`[feroce-api] listening on http://localhost:${port} — provider: ${provider ? 'stripe (configured)' : 'stripe (not configured)'}`)
})
server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') console.error(`[feroce-api] port ${port} is already in use.`)
  else console.error('[feroce-api] failed to start:', error.message)
  process.exit(1)
})
