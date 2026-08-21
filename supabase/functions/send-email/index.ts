import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@3.2.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const FROM_EMAIL = "FÉROCE <hello@ferocefashionff.com>";
const ADMIN_EMAIL = "Ferocefashionff@gmail.com";
const SITE_URL = "https://feroce-fashion.vercel.app";

const sharedHead = `
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body { margin: 0; padding: 0; background-color: #F4F1EA; font-family: 'Montserrat', sans-serif; color: #0A1128; }
    .container { max-width: 600px; margin: 0 auto; background: #fff; }
    .header { background: #0A1128; padding: 32px 40px; text-align: center; }
    .header h1 { font-family: 'Playfair Display', serif; color: #fff; font-size: 28px; margin: 0; letter-spacing: 0.1em; }
    .header .tagline { color: #D4AF37; font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; margin-top: 8px; }
    .body { padding: 40px; }
    .body h2 { font-family: 'Playfair Display', serif; font-size: 24px; margin: 0 0 16px; color: #0A1128; }
    .body p { font-size: 14px; line-height: 1.7; color: #6b6b6b; margin: 0 0 16px; }
    .btn { display: inline-block; background: #0A1128; color: #fff; text-decoration: none; padding: 16px 36px; font-size: 11px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; }
    .btn-gold { background: #D4AF37; color: #0A1128; }
    .divider { height: 1px; background: #E2DFD8; margin: 32px 0; }
    .footer { background: #F4F1EA; padding: 32px 40px; text-align: center; border-top: 1px solid #E2DFD8; }
    .footer p { font-size: 11px; color: #8a857c; margin: 4px 0; }
    .footer a { color: #0A1128; text-decoration: none; }
    .order-table { width: 100%; border-collapse: collapse; margin: 24px 0; }
    .order-table th { text-align: left; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #8a857c; padding: 8px 0; border-bottom: 1px solid #E2DFD8; }
    .order-table td { padding: 12px 0; border-bottom: 1px solid #E2DFD8; font-size: 14px; color: #0A1128; }
    .total-row td { border-bottom: none; font-weight: 600; font-size: 16px; }
    .badge { display: inline-block; padding: 4px 12px; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 600; }
    .badge-paid { background: #d4edda; color: #155724; }
    .badge-shipped { background: #cce5ff; color: #004085; }
    .badge-cancelled { background: #f8d7da; color: #721c24; }
    .label { font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #8a857c; margin-bottom: 4px; }
    .value { font-size: 14px; color: #0A1128; margin-bottom: 16px; }
  </style>
`;

function wrap(body) {
  return '<!DOCTYPE html><html><head>' + sharedHead + '</head><body><div class="container">'
    + '<div class="header"><h1>FÉROCE</h1><div class="tagline">Designed in Dallas</div></div>'
    + body
    + '<div class="footer"><p><strong>FÉROCE</strong> — Luxury Handbags</p>'
    + '<p>Designed in Dallas. Handcrafted worldwide.</p>'
    + '<p style="margin-top:16px;"><a href="' + SITE_URL + '">feroce-fashion.com</a> · '
    + '<a href="' + SITE_URL + '/privacy">Privacy</a> · '
    + '<a href="' + SITE_URL + '/terms">Terms</a></p>'
    + '<p style="margin-top:16px;font-size:10px;color:#aaa;">© 2026 FÉROCE. All rights reserved.</p>'
    + '</div></div></body></html>';
}

// 1. WELCOME
function welcomeEmail(name) {
  return {
    subject: "Welcome to FÉROCE — The Attitude is Fierce",
    html: wrap('<div class="body"><h2>Welcome to FÉROCE, ' + name + '.</h2>'
      + '<p>You\'ve just joined a community that refuses to blend in. FÉROCE is luxury with attitude — handcrafted bags designed in Dallas for those who lead, never follow.</p>'
      + '<p>As a member, you\'ll get early access to new collections, exclusive offers, and a first look at what\'s next from FÉROCE.</p>'
      + '<div class="divider"></div>'
      + '<p style="font-family:\'Playfair Display\',serif;font-size:18px;color:#0A1128;text-align:center;font-style:italic;margin:24px 0;">"The attitude is Féroce."</p>'
      + '<div style="text-align:center;margin:32px 0;"><a href="' + SITE_URL + '/shop" class="btn">SHOP THE COLLECTION</a></div>'
      + '<p style="font-size:12px;color:#8a857c;text-align:center;">Use code <strong style="color:#D4AF37;">WELCOME10</strong> for 10% off your first order.</p></div>'),
  };
}

// 2. VERIFY EMAIL
function verifyEmail(name, url) {
  return {
    subject: "Verify Your FÉROCE Account",
    html: wrap('<div class="body"><h2>Verify your email, ' + name + '.</h2>'
      + '<p>Thanks for creating your FÉROCE account. Click the button below to verify your email and start shopping.</p>'
      + '<div style="text-align:center;margin:32px 0;"><a href="' + url + '" class="btn">VERIFY MY EMAIL</a></div>'
      + '<p style="font-size:12px;color:#8a857c;">If you didn\'t create this account, you can safely ignore this email. This link expires in 24 hours.</p></div>'),
  };
}

// 3. PASSWORD RESET
function passwordReset(name, url) {
  return {
    subject: "Reset Your FÉROCE Password",
    html: wrap('<div class="body"><h2>Password reset request.</h2>'
      + '<p>Hi ' + name + ', we received a request to reset your FÉROCE password. Click below to choose a new one.</p>'
      + '<div style="text-align:center;margin:32px 0;"><a href="' + url + '" class="btn">RESET PASSWORD</a></div>'
      + '<p style="font-size:12px;color:#8a857c;">If you didn\'t request this, your password stays unchanged. This link expires in 1 hour.</p></div>'),
  };
}

// 4. ORDER CONFIRMATION
function orderConfirmation(name, orderId, items, total, addr, method) {
  var fmt = function(c) { return "$" + (c / 100).toFixed(2); };
  var rows = items.map(function(i) {
    return '<tr><td>' + i.name + '</td><td style="text-align:center;">' + i.quantity + '</td><td style="text-align:right;">' + fmt(i.price * i.quantity) + '</td></tr>';
  }).join('');
  var shipping = addr ? (addr.address || '') + ', ' + (addr.city || '') + ', ' + (addr.state || '') + ' ' + (addr.zip || '') : 'On file';
  return {
    subject: "Order Confirmed — #" + orderId.slice(0, 8).toUpperCase(),
    html: wrap('<div class="body">'
      + '<div style="text-align:center;margin-bottom:32px;"><span class="badge badge-paid">ORDER CONFIRMED</span></div>'
      + '<h2>Thank you, ' + name + '.</h2>'
      + '<p>Your order has been placed successfully. We\'re preparing it now and you\'ll receive another email when it ships.</p>'
      + '<div class="divider"></div>'
      + '<div class="label">ORDER NUMBER</div>'
      + '<div class="value" style="font-weight:600;font-size:16px;">#' + orderId.slice(0, 8).toUpperCase() + '</div>'
      + '<table class="order-table"><thead><tr><th>Item</th><th style="text-align:center;">Qty</th><th style="text-align:right;">Price</th></tr></thead>'
      + '<tbody>' + rows
      + '<tr class="total-row"><td colspan="2">Total</td><td style="text-align:right;">' + fmt(total) + '</td></tr>'
      + '</tbody></table>'
      + '<div class="divider"></div>'
      + '<div class="label">SHIPPING TO</div><div class="value">' + shipping + '</div>'
      + '<div class="label">PAYMENT METHOD</div><div class="value">' + (method || 'Card') + '</div>'
      + '<div style="text-align:center;margin:32px 0;"><a href="' + SITE_URL + '/account" class="btn">VIEW MY ORDER</a></div>'
      + '</div>'),
  };
}

// 5. ORDER SHIPPED
function orderShipped(name, orderId, tracking) {
  return {
    subject: "Your FÉROCE Order #" + orderId.slice(0, 8).toUpperCase() + " Has Shipped",
    html: wrap('<div class="body">'
      + '<div style="text-align:center;margin-bottom:32px;"><span class="badge badge-shipped">SHIPPED</span></div>'
      + '<h2>Your order is on its way, ' + name + '.</h2>'
      + '<p>Great news — your FÉROCE order has been shipped.' + (tracking ? '<br><br>Tracking: <strong>' + tracking + '</strong>' : '') + '</p>'
      + '<p>Estimated delivery: 5–7 business days (standard), 2–3 (express).</p>'
      + '<div style="text-align:center;margin:32px 0;"><a href="' + SITE_URL + '/account" class="btn">TRACK ORDER</a></div>'
      + '</div>'),
  };
}

// 6. ORDER CANCELLED
function orderCancelled(name, orderId) {
  return {
    subject: "FÉROCE Order #" + orderId.slice(0, 8).toUpperCase() + " Cancelled",
    html: wrap('<div class="body">'
      + '<div style="text-align:center;margin-bottom:32px;"><span class="badge badge-cancelled">CANCELLED</span></div>'
      + '<h2>Your order has been cancelled.</h2>'
      + '<p>Order #' + orderId.slice(0, 8).toUpperCase() + ' has been cancelled. If charged, a refund will process within 5–10 business days.</p>'
      + '<div style="text-align:center;margin:32px 0;"><a href="mailto:' + ADMIN_EMAIL + '" class="btn">CONTACT US</a></div>'
      + '</div>'),
  };
}

// 7. NEW ORDER ADMIN
function newOrderAdmin(orderId, customerEmail, items, total, method) {
  var fmt = function(c) { return "$" + (c / 100).toFixed(2); };
  var rows = items.map(function(i) {
    return '<tr><td>' + i.name + '</td><td style="text-align:center;">' + i.quantity + '</td><td style="text-align:right;">' + fmt(i.price * i.quantity) + '</td></tr>';
  }).join('');
  return {
    subject: "New Order #" + orderId.slice(0, 8).toUpperCase() + " — " + fmt(total),
    html: wrap('<div class="body">'
      + '<h2>New order received.</h2>'
      + '<p>A new order has been placed on FÉROCE.</p>'
      + '<div class="divider"></div>'
      + '<div class="label">ORDER NUMBER</div>'
      + '<div class="value" style="font-weight:600;font-size:16px;">#' + orderId.slice(0, 8).toUpperCase() + '</div>'
      + '<div class="label">CUSTOMER</div><div class="value">' + customerEmail + '</div>'
      + '<table class="order-table"><thead><tr><th>Item</th><th style="text-align:center;">Qty</th><th style="text-align:right;">Price</th></tr></thead>'
      + '<tbody>' + rows
      + '<tr class="total-row"><td colspan="2">Total</td><td style="text-align:right;">' + fmt(total) + '</td></tr>'
      + '</tbody></table>'
      + '<div class="label">PAYMENT</div><div class="value">' + (method || 'Card') + '</div>'
      + '<div style="text-align:center;margin:32px 0;"><a href="' + SITE_URL + '/admin/orders" class="btn">VIEW IN DASHBOARD</a></div>'
      + '</div>'),
  };
}

// 8. NEWSLETTER
function newsletterEmail(name) {
  return {
    subject: "Stay in the Loop — FÉROCE Updates",
    html: wrap('<div class="body">'
      + '<h2>You\'re in the circle, ' + name + '.</h2>'
      + '<p>Welcome to the FÉROCE inner circle. You\'ll be the first to know about new collections, exclusive offers, and everything behind the scenes.</p>'
      + '<div class="divider"></div>'
      + '<div style="text-align:center;margin:32px 0;"><a href="' + SITE_URL + '/shop" class="btn btn-gold">SHOP NEW ARRIVALS</a></div>'
      + '</div>'),
  };
}

// ─── MAIN HANDLER ────────────────────────────────────────────────
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }
  try {
    var body = await req.json();
    var type = body.type;
    var to = body.to;
    var params = Object.assign({}, body);
    delete params.type;
    delete params.to;

    if (!type || !to) {
      return new Response(JSON.stringify({ error: "Missing 'type' or 'to' field" }), {
        status: 400, headers: { "Content-Type": "application/json" }
      });
    }

    var emailData;
    switch (type) {
      case "welcome":
        emailData = welcomeEmail(params.name || "there"); break;
      case "verify-email":
        emailData = verifyEmail(params.name || "there", params.verificationUrl || SITE_URL + "/verify"); break;
      case "password-reset":
        emailData = passwordReset(params.name || "there", params.resetUrl || SITE_URL + "/reset"); break;
      case "order-confirmation":
        emailData = orderConfirmation(params.name || "Valued Customer", params.orderId || "unknown", params.items || [], params.total || 0, params.shippingAddress || {}, params.paymentMethod || "Card"); break;
      case "order-shipped":
        emailData = orderShipped(params.name || "Valued Customer", params.orderId || "unknown", params.trackingNumber || null); break;
      case "order-cancelled":
        emailData = orderCancelled(params.name || "Valued Customer", params.orderId || "unknown"); break;
      case "new-order-admin":
        emailData = newOrderAdmin(params.orderId || "unknown", params.customerEmail || "unknown", params.items || [], params.total || 0, params.paymentMethod || "Card"); break;
      case "newsletter":
        emailData = newsletterEmail(params.name || "there"); break;
      default:
        return new Response(JSON.stringify({ error: "Unknown type: " + type }), {
          status: 400, headers: { "Content-Type": "application/json" }
        });
    }

    var recipients = Array.isArray(to) ? to : [to];
    var result = await resend.emails.send({
      from: FROM_EMAIL,
      to: recipients,
      subject: emailData.subject,
      html: emailData.html,
    });

    return new Response(
      JSON.stringify({ success: true, id: result.data && result.data.id, type: type, to: recipients }),
      { status: 200, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "Failed to send email" }),
      { status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    );
  }
});
