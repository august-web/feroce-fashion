// SERVER-ONLY transactional email templates (rendered to inline-styled HTML).
// Keep out of the browser bundle. Branding is the current preview identity; the
// footer flags that copy should be replaced with approved brand templates.

export type EmailKind = 'pending' | 'paid' | 'cancelled'

export interface OrderEmailLine {
  productName: string
  quantity: number
  unitPriceMinor: number
  color?: string
  variant?: string
}

export interface OrderEmailData {
  orderNumber: string
  currency: string
  subtotalMinor: number
  shippingMinor: number
  taxMinor: number
  totalMinor: number
  firstName?: string
  items: OrderEmailLine[]
  shipping?: {
    line1: string
    line2?: string
    city: string
    region?: string
    postalCode?: string
    countryCode: string
  }
  shippingMethod?: string
  estimatedDelivery?: string
}

export function formatMinor(minor: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en', { style: 'currency', currency, minimumFractionDigits: 0 }).format(minor / 100)
  } catch {
    return `${currency} ${(minor / 100).toFixed(2)}`
  }
}

const esc = (s: string | undefined | null) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

function layout(title: string, body: string, footerNote: string): string {
  return `<!doctype html>
<html lang="en">
<body style="margin:0;padding:0;background:#f8f6f2;font-family:Georgia,'Times New Roman',serif;color:#1a1a1a;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8f6f2;padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e5e0d8;">
        <tr><td style="padding:28px 32px;border-bottom:1px solid #e5e0d8;">
          <div style="font-size:24px;letter-spacing:4px;">FÉROCE</div>
          <div style="font-size:9px;letter-spacing:3px;color:#8a857c;margin-top:2px;">FASHION_FF</div>
        </td></tr>
        <tr><td style="padding:32px;">
          <div style="font-size:11px;letter-spacing:3px;color:#8a857c;text-transform:uppercase;">${title}</div>
          ${body}
        </td></tr>
        <tr><td style="padding:20px 32px;border-top:1px solid #e5e0d8;font-size:10px;line-height:1.7;color:#8a857c;">
          ${footerNote}<br/>FÉROCE FASHION_FF · Designed for presence.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function itemsTable(items: OrderEmailLine[], currency: string): string {
  const rows = items
    .map(
      item => `<tr>
        <td style="padding:10px 0;border-bottom:1px solid #eee;font-size:13px;">${esc(item.productName)}
          ${item.color || item.variant ? `<div style="font-size:10px;color:#8a857c;margin-top:2px;">${[item.variant, item.color].filter(Boolean).map(esc).join(' · ')}</div>` : ''}
        </td>
        <td align="right" style="padding:10px 0;border-bottom:1px solid #eee;font-size:11px;color:#8a857c;">×${item.quantity}</td>
        <td align="right" style="padding:10px 0;border-bottom:1px solid #eee;font-size:13px;white-space:nowrap;">${formatMinor(item.unitPriceMinor * item.quantity, currency)}</td>
      </tr>`,
    )
    .join('')
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;">${rows}</table>`
}

function totals(data: OrderEmailData): string {
  const line = (label: string, value: string, strong = false) =>
    `<tr><td style="padding:4px 0;font-size:12px;color:${strong ? '#1a1a1a' : '#8a857c'};${strong ? 'font-weight:bold;' : ''}">${label}</td><td align="right" style="padding:4px 0;font-size:12px;${strong ? 'font-weight:bold;' : 'color:#8a857c;'}">${value}</td></tr>`
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:14px;">
    ${line('Subtotal', formatMinor(data.subtotalMinor, data.currency))}
    ${line('Shipping', formatMinor(data.shippingMinor, data.currency))}
    ${line('Tax', formatMinor(data.taxMinor, data.currency))}
    <tr><td style="padding-top:8px;border-top:2px solid #1a1a1a;font-size:14px;font-weight:bold;">Total</td><td align="right" style="padding-top:8px;border-top:2px solid #1a1a1a;font-size:14px;font-weight:bold;">${formatMinor(data.totalMinor, data.currency)}</td></tr>
  </table>`
}

function orderNumber(data: OrderEmailData): string {
  return `<div style="margin-top:10px;font-size:13px;color:#8a857c;">Order <span style="color:#1a1a1a;font-weight:bold;">${esc(data.orderNumber)}</span></div>`
}

function shippingBlock(data: OrderEmailData): string {
  if (!data.shipping) return ''
  const a = data.shipping
  const lines = [a.line1, a.line2, [a.city, a.region].filter(Boolean).join(', '), [a.postalCode, a.countryCode].filter(Boolean).join(' ')].filter(Boolean)
  return `<div style="margin-top:24px;border-left:2px solid #1a1a1a;padding-left:14px;">
    <div style="font-size:10px;letter-spacing:2px;color:#8a857c;text-transform:uppercase;">Deliver to</div>
    ${data.shippingMethod ? `<div style="font-size:11px;color:#8a857c;margin-top:2px;">Method: ${esc(data.shippingMethod)}</div>` : ''}
    ${data.estimatedDelivery ? `<div style="font-size:11px;color:#8a857c;">Est. delivery: ${esc(data.estimatedDelivery)}</div>` : ''}
    <div style="margin-top:6px;font-size:13px;line-height:1.6;">${lines.map(esc).join('<br/>')}</div>
  </div>`
}

export interface RenderedEmail { subject: string; html: string }

export function renderOrderEmail(kind: EmailKind, data: OrderEmailData, storeUrl: string): RenderedEmail {
  const greeting = data.firstName ? `Dear ${esc(data.firstName)},` : 'Dear client,'
  const shopLink = `<a href="${esc(storeUrl)}/shop" style="color:#1a1a1a;text-decoration:underline;">browse the collection</a>`

  if (kind === 'pending') {
    return {
      subject: `We received your order ${data.orderNumber}`,
      html: layout(
        'Order received',
        `<p style="font-size:15px;line-height:1.8;">${greeting}</p>
         <p style="font-size:13px;line-height:1.8;color:#5a554e;">Thank you for your order. We're confirming your payment with our secure provider — no charge will be finalised until it clears.</p>
         ${orderNumber(data)}
         ${itemsTable(data.items, data.currency)}
         ${totals(data)}
         <p style="font-size:12px;line-height:1.8;color:#5a554e;margin-top:24px;">You'll receive a confirmation email as soon as your payment is verified. Need to adjust anything? Reply to this email and we'll assist.</p>`,
        'SAMPLE STOREFRONT — branded transactional templates pending launch approval.',
      ),
    }
  }

  if (kind === 'cancelled') {
    return {
      subject: `Your order ${data.orderNumber} was cancelled`,
      html: layout(
        'Order cancelled',
        `<p style="font-size:15px;line-height:1.8;">${greeting}</p>
         <p style="font-size:13px;line-height:1.8;color:#5a554e;">Your order ${esc(data.orderNumber)} was cancelled because its payment session expired before completion. No payment was taken.</p>
         ${orderNumber(data)}
         ${itemsTable(data.items, data.currency)}
         <p style="font-size:13px;line-height:1.8;color:#5a554e;margin-top:24px;">If you'd still like these pieces, simply ${shopLink} and check out again — your items are waiting.</p>`,
        'SAMPLE STOREFRONT — branded transactional templates pending launch approval.',
      ),
    }
  }

  return {
    subject: `Your FÉROCE order ${data.orderNumber} is confirmed`,
    html: layout(
      'Order confirmed',
      `<p style="font-size:15px;line-height:1.8;">${greeting}</p>
       <p style="font-size:13px;line-height:1.8;color:#5a554e;">Payment verified. Your pieces are being prepared for dispatch and will ship to the address below.</p>
       ${orderNumber(data)}
       ${itemsTable(data.items, data.currency)}
       ${totals(data)}
       ${shippingBlock(data)}
       <p style="font-size:12px;line-height:1.8;color:#5a554e;margin-top:24px;">A separate email with tracking details will follow once your order ships. Questions? Reply to this email.</p>`,
      'SAMPLE STOREFRONT — branded transactional templates pending launch approval.',
    ),
  }
}
