import crypto from 'node:crypto'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { loadEnv } from './config'
import type { OrderEmailData } from './email-templates'

const env = loadEnv()

/** Server-only client. Never import this module from the browser bundle. */
export const admin: SupabaseClient = createClient(env.VITE_SUPABASE_URL ?? '', env.SUPABASE_SERVICE_ROLE_KEY ?? '', {
  auth: { persistSession: false },
})

export function isAdminConfigured() {
  return Boolean(env.VITE_SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY)
}

export class CheckoutError extends Error {
  constructor(message: string, public status = 400) { super(message) }
}

export interface BrowserLine { productId: string; variant: string; color: string; quantity: number }
export interface CustomerFields { email: string; phone?: string; firstName?: string; lastName?: string; line1?: string; line2?: string; city?: string; region?: string; postalCode?: string; country?: string }

interface DbVariant { id: string; name: string; color_name: string | null; price_minor: number | null; inventory: number; active: boolean; sku: string }
interface DbProduct { id: string; name: string; slug: string; base_price_minor: number; currency: string; status: string; product_variants: DbVariant[] | null }

export interface CreatedCheckout {
  orderId: string; orderNumber: string; paymentId: string; totalMinor: number; currency: string
  items: { name: string; quantity: number; unitAmountMinor: number }[]
}

/**
 * Re-reads every line's price, stock and currency from the database (never trusts the browser),
 * snapshots the order items, creates a pending order + payment, and returns references for the
 * provider session. Throws CheckoutError with an HTTP status for client-visible failures.
 */
export async function createPendingOrder(lines: BrowserLine[], customer: CustomerFields, userId: string | null): Promise<CreatedCheckout> {
  if (!isAdminConfigured()) throw new CheckoutError('Checkout database is not configured.', 503)
  if (!Array.isArray(lines) || lines.length === 0 || lines.length > 30) throw new CheckoutError('Invalid cart.', 400)
  if (!/^\S+@\S+\.\S+$/.test(customer.email || '')) throw new CheckoutError('Enter a valid email address.', 400)
  if (lines.some(l => !l.productId || !Number.isInteger(l.quantity) || l.quantity < 1 || l.quantity > 10)) throw new CheckoutError('Invalid line item.', 400)

  const ids = [...new Set(lines.map(l => l.productId))]
  const { data: rows, error } = await admin
    .from('products')
    .select('id,name,slug,base_price_minor,currency,status,product_variants(id,name,color_name,price_minor,inventory,active,sku)')
    .in('id', ids)
    .eq('status', 'active')
  if (error) throw new CheckoutError('Unable to verify the catalog.', 503)
  const products = (rows as unknown as DbProduct[] | null) ?? []
  const byId = new Map(products.map(p => [p.id, p]))

  interface Snapshot { productId: string; variantId: string; productName: string; sku: string; selectedColor: string; selectedVariant: string; unitPriceMinor: number; quantity: number }
  const snapshots: Snapshot[] = []
  for (const line of lines) {
    const product = byId.get(line.productId)
    if (!product) throw new CheckoutError('One of the selected pieces is no longer available.', 422)
    const variant = (product.product_variants ?? []).find(v => v.active && v.name === line.variant && (v.color_name ?? '') === line.color)
    if (!variant) throw new CheckoutError(`Configuration for ${product.name} has changed; remove it and add it again.`, 422)
    if (variant.inventory < line.quantity) throw new CheckoutError(`Insufficient stock for ${product.name}.`, 422)
    snapshots.push({
      productId: product.id,
      variantId: variant.id,
      productName: product.name,
      sku: variant.sku,
      selectedColor: line.color,
      selectedVariant: line.variant,
      unitPriceMinor: variant.price_minor ?? product.base_price_minor,
      quantity: line.quantity,
    })
  }

  const currency = products[0]?.currency ?? 'GHS'
  const subtotalMinor = snapshots.reduce((n, s) => n + s.unitPriceMinor * s.quantity, 0)
  const shippingMinor = 0 // Approved shipping rates are not configured yet.
  const taxMinor = 0
  const totalMinor = subtotalMinor + shippingMinor + taxMinor

  const { data: num, error: numErr } = await admin.rpc('next_order_number')
  if (numErr || typeof num !== 'string') throw new CheckoutError('Unable to allocate an order number.', 503)
  const orderNumber = num as string

  const shippingAddress = {
    first_name: customer.firstName ?? '',
    last_name: customer.lastName ?? '',
    line1: customer.line1 ?? '',
    line2: customer.line2 ?? '',
    city: customer.city ?? '',
    region: customer.region ?? '',
    postal_code: customer.postalCode ?? '',
    country_code: (customer.country ?? 'GH').slice(0, 2),
  }

  const { data: order, error: orderErr } = await admin.from('orders').insert({
    order_number: orderNumber,
    user_id: userId,
    email: customer.email,
    phone: customer.phone ?? null,
    status: 'pending',
    currency,
    subtotal_minor: subtotalMinor,
    shipping_minor: shippingMinor,
    tax_minor: taxMinor,
    total_minor: totalMinor,
    shipping_address: shippingAddress,
    shipping_method: 'standard',
  }).select('id').single()
  if (orderErr) throw new CheckoutError('Unable to create the order.', 503)
  const orderId = order.id as string

  const { error: itemsErr } = await admin.from('order_items').insert(snapshots.map(s => ({
    order_id: orderId,
    product_id: s.productId,
    variant_id: s.variantId,
    product_name: s.productName,
    sku: s.sku,
    selected_color: s.selectedColor,
    selected_variant: s.selectedVariant,
    unit_price_minor: s.unitPriceMinor,
    quantity: s.quantity,
  })))
  if (itemsErr) { await admin.from('orders').delete().eq('id', orderId); throw new CheckoutError('Unable to record order items.', 503) }

  const { data: payment, error: payErr } = await admin.from('payments').insert({
    order_id: orderId,
    provider: 'stripe',
    status: 'pending',
    amount_minor: totalMinor,
    currency,
    raw_metadata: {},
  }).select('id').single()
  if (payErr) { await admin.from('orders').delete().eq('id', orderId); throw new CheckoutError('Unable to record the payment.', 503) }

  return {
    orderId,
    orderNumber,
    paymentId: payment.id as string,
    totalMinor,
    currency,
    items: snapshots.map(s => ({ name: s.productName, quantity: s.quantity, unitAmountMinor: s.unitPriceMinor })),
  }
}

export interface PaymentStatus {
  status: 'paid' | 'pending' | 'cancelled' | 'failed' | 'refunded' | 'unknown'
  orderNumber?: string
  email?: string
  totalMinor?: number
  currency?: string
  items?: { productName: string; quantity: number; unitPriceMinor: number }[]
}

/** Minimal, safe read used by the confirmation page — never returns shipping or payment details. */
export async function getPaymentStatus(providerReference: string): Promise<PaymentStatus> {
  const { data: payment } = await admin
    .from('payments')
    .select('status,orders(order_number,email,total_minor,currency,order_items(product_name,quantity,unit_price_minor))')
    .eq('provider_payment_id', providerReference)
    .maybeSingle()
  if (!payment?.status) return { status: 'unknown' }
  const order = payment.orders as unknown as { order_number: string; email: string; total_minor: number; currency: string; order_items: { product_name: string; quantity: number; unit_price_minor: number }[] } | null
  if (payment.status !== 'paid' || !order) return { status: payment.status as PaymentStatus['status'] }
  return {
    status: 'paid',
    orderNumber: order.order_number,
    email: order.email,
    totalMinor: order.total_minor,
    currency: order.currency,
    items: order.order_items.map(i => ({ productName: i.product_name, quantity: i.quantity, unitPriceMinor: i.unit_price_minor })),
  }
}

export function generateStateToken() {
  return crypto.randomBytes(12).toString('hex')
}

// --- Transactional email data ---------------------------------------------------------------

interface DbOrderForEmail {
  order_number: string
  email: string
  status: string
  currency: string
  subtotal_minor: number
  shipping_minor: number
  tax_minor: number
  total_minor: number
  shipping_address: {
    first_name?: string | null
    last_name?: string | null
    line1?: string | null
    line2?: string | null
    city?: string | null
    region?: string | null
    postal_code?: string | null
    country_code?: string | null
  } | null
  shipping_method?: string | null
  estimated_delivery?: string | null
  order_items: {
    product_name: string
    sku: string | null
    selected_color: string | null
    selected_variant: string | null
    quantity: number
    unit_price_minor: number
  }[]
}

export interface OrderEmailBundle { email: string; kind: 'pending' | 'paid' | 'cancelled'; data: OrderEmailData }

/** Load an order + its items in the shape the transactional templates need. */
export async function getOrderForEmail(orderId: string): Promise<OrderEmailBundle | null> {
  const { data, error } = await admin
    .from('orders')
    .select('order_number,email,status,currency,subtotal_minor,shipping_minor,tax_minor,total_minor,shipping_address,shipping_method,estimated_delivery,order_items(product_name,sku,selected_color,selected_variant,quantity,unit_price_minor)')
    .eq('id', orderId)
    .maybeSingle()
  if (error || !data) return null
  const order = data as unknown as DbOrderForEmail
  const kind: OrderEmailBundle['kind'] = order.status === 'paid' ? 'paid' : order.status === 'cancelled' ? 'cancelled' : 'pending'
  const address = order.shipping_address
  return {
    email: order.email,
    kind,
    data: {
      orderNumber: order.order_number,
      currency: order.currency,
      subtotalMinor: order.subtotal_minor,
      shippingMinor: order.shipping_minor,
      taxMinor: order.tax_minor,
      totalMinor: order.total_minor,
      firstName: address?.first_name || undefined,
      items: order.order_items.map(i => ({
        productName: i.product_name,
        quantity: i.quantity,
        unitPriceMinor: i.unit_price_minor,
        color: i.selected_color ?? undefined,
        variant: i.selected_variant ?? undefined,
      })),
      shipping: address
        ? {
            line1: address.line1 ?? '',
            line2: address.line2 ?? undefined,
            city: address.city ?? '',
            region: address.region ?? undefined,
            postalCode: address.postal_code ?? undefined,
            countryCode: address.country_code ?? '',
          }
        : undefined,
      shippingMethod: order.shipping_method ?? undefined,
      estimatedDelivery: order.estimated_delivery ?? undefined,
    },
  }
}
