import type { CartLine } from '../types'
import { supabase } from './supabase'

export type CheckoutPayload = {
  customer: Record<string, string>
  shippingMethod: string
  paymentMethod: string
  lines: { productId: string; variant: string; color: string; quantity: number }[]
}

/**
 * Calls the same-origin checkout server. The server re-reads prices and stock from the
 * database, creates a pending order, then a provider session. Never trust totals or price
 * data supplied by the browser. The Supabase session is attached so the order is linked
 * to the signed-in account and appears in their dashboard.
 */
export async function createCheckoutSession(payload: CheckoutPayload): Promise<{ redirectUrl: string; orderNumber: string }> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  const { data } = supabase ? await supabase.auth.getSession() : { data: null }
  if (data?.session?.access_token) headers.Authorization = `Bearer ${data.session.access_token}`

  const response = await fetch('/api/checkout/session', {
    method: 'POST',
    headers,
    credentials: 'include',
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    const detail = await response.json().catch(() => ({ message: 'Payment service is not configured.' }))
    throw new Error(detail.message || 'Unable to start secure payment.')
  }
  return response.json()
}

export function serializeLines(lines: CartLine[]) {
  return lines.map(l => ({ productId: l.product.id, variant: l.variant, color: l.color, quantity: l.quantity }))
}
