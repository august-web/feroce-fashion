import { Resend } from 'resend'
import { formatPrice } from './types'

const FROM_EMAIL = 'Féroce <orders@feroce-fashion.com>'

interface OrderEmailData {
  orderId: string
  email: string
  customerName: string
  items: Array<{ name: string; color: string; price: number; quantity: number }>
  subtotal: number
  shipping: number
  tax: number
  total: number
  shippingAddress: {
    name: string
    address: string
    apartment?: string
    city: string
    state: string
    zip: string
    country: string
  }
  shippingMethod: string
}

function buildOrderConfirmationHtml(data: OrderEmailData): string {
  const itemsHtml = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #E2DFD8;">
          <p style="margin: 0; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: #0A1128; font-weight: 500;">${item.name}</p>
          <p style="margin: 4px 0 0; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 12px; color: #8a857c;">${item.color} · Qty ${item.quantity}</p>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #E2DFD8; text-align: right;">
          <p style="margin: 0; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: #0A1128;">${formatPrice(item.price * item.quantity)}</p>
        </td>
      </tr>`
    )
    .join('')

  const shippingLabel =
    data.shippingMethod === 'express'
      ? 'Express Shipping (2–3 business days)'
      : 'Standard Shipping (5–7 business days)'

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background-color: #F4F1EA; font-family: 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F4F1EA; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">

          <!-- Logo -->
          <tr>
            <td style="padding: 0 0 30px; text-align: center;">
              <h1 style="margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 28px; color: #0A1128; letter-spacing: 2px;">FÉROCE</h1>
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td style="background: #ffffff; border: 1px solid #E2DFD8; padding: 40px;">
              <!-- Header -->
              <h2 style="margin: 0 0 8px; font-family: Georgia, 'Times New Roman', serif; font-size: 24px; color: #0A1128;">Order Confirmed</h2>
              <p style="margin: 0 0 24px; font-size: 13px; color: #8a857c; letter-spacing: 0.05em;">
                Order #${data.orderId.slice(0, 8).toUpperCase()} · ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>

              <p style="margin: 0 0 24px; font-size: 14px; color: #0A1128; line-height: 1.6;">
                Thank you, ${data.customerName}. Your order has been placed and is being prepared for shipment.
                We'll send you tracking information once it ships.
              </p>

              <!-- Items -->
              <table width="100%" cellpadding="0" cellspacing="0">
                ${itemsHtml}
              </table>

              <!-- Totals -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
                <tr>
                  <td style="padding: 6px 0; font-size: 13px; color: #8a857c;">Subtotal</td>
                  <td style="padding: 6px 0; font-size: 13px; color: #0A1128; text-align: right;">${formatPrice(data.subtotal)}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 13px; color: #8a857c;">Shipping · ${shippingLabel}</td>
                  <td style="padding: 6px 0; font-size: 13px; color: ${data.shipping === 0 ? '#D4AF37' : '#0A1128'}; text-align: right;">${data.shipping === 0 ? 'Free' : formatPrice(data.shipping)}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 13px; color: #8a857c;">Estimated Tax</td>
                  <td style="padding: 6px 0; font-size: 13px; color: #0A1128; text-align: right;">${formatPrice(data.tax)}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0 0; font-size: 15px; font-weight: 600; color: #0A1128; border-top: 1px solid #E2DFD8;">Total</td>
                  <td style="padding: 12px 0 0; font-size: 15px; font-weight: 600; color: #0A1128; border-top: 1px solid #E2DFD8; text-align: right;">${formatPrice(data.total)}</td>
                </tr>
              </table>

              <!-- Shipping Address -->
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E2DFD8;">
                <p style="margin: 0 0 8px; font-size: 11px; color: #8a857c; letter-spacing: 0.1em; text-transform: uppercase;">Shipping To</p>
                <p style="margin: 0; font-size: 14px; color: #0A1128; line-height: 1.6;">
                  ${data.shippingAddress.name}<br>
                  ${data.shippingAddress.address}${data.shippingAddress.apartment ? ', ' + data.shippingAddress.apartment : ''}<br>
                  ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zip}<br>
                  ${data.shippingAddress.country}
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 0; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 12px; color: #8a857c;">
                Questions? Contact us at <a href="mailto:support@feroce-fashion.com" style="color: #0A1128; text-decoration: underline;">support@feroce-fashion.com</a>
              </p>
              <p style="margin: 0; font-size: 11px; color: #b5b2ab; letter-spacing: 0.05em;">
                © 2026 Féroce Fashion · Designed in Dallas
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export async function sendOrderConfirmation(data: OrderEmailData) {
  if (!process.env.RESEND_API_KEY) {
    console.log('RESEND_API_KEY not set — skipping order confirmation email')
    return { success: false, reason: 'no_api_key' }
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const html = buildOrderConfirmationHtml(data)

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: `Order #${data.orderId.slice(0, 8).toUpperCase()} Confirmed — Féroce`,
      html,
    })

    if (error) {
      console.error('Resend error:', error)
      return { success: false, reason: error.message }
    }

    console.log(`Order confirmation email sent to ${data.email}`)
    return { success: true }
  } catch (error) {
    console.error('Email send failed:', error)
    return { success: false, reason: 'unknown' }
  }
}
