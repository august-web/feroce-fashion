// SERVER-ONLY request schemas (zod). The checkout boundary validates shape and
// bounds; the database remains the source of truth for prices, stock and currency.
import { z } from 'zod'

export const checkoutLineSchema = z.object({
  productId: z.string().uuid(),
  variant: z.string().trim().min(1).max(80),
  color: z.string().trim().min(1).max(80),
  quantity: z.number().int().min(1).max(10),
})

export const checkoutCustomerSchema = z.object({
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional().default(''),
  firstName: z.string().trim().max(80).optional().default(''),
  lastName: z.string().trim().max(80).optional().default(''),
  address: z.string().trim().max(200).optional().default(''),
  address2: z.string().trim().max(200).optional().default(''),
  city: z.string().trim().max(120).optional().default(''),
  region: z.string().trim().max(120).optional().default(''),
  postalCode: z.string().trim().max(20).optional().default(''),
  country: z.string().trim().max(2).optional().default('GH'),
})

export const checkoutBodySchema = z.object({
  customer: checkoutCustomerSchema,
  shippingMethod: z.string().trim().max(60).optional().default('standard'),
  paymentMethod: z.string().trim().max(60).optional().default('card'),
  lines: z.array(checkoutLineSchema).min(1).max(30),
})

export type CheckoutBody = z.infer<typeof checkoutBodySchema>

/** First issue as a compact human-readable message, e.g. `lines[0].quantity must be <= 10`. */
export function validationMessage(error: z.ZodError): string {
  const issue = error.issues[0]
  if (!issue) return 'Invalid request.'
  const path = issue.path.length ? issue.path.join('.') : 'body'
  return `${path} ${issue.message}`
}
