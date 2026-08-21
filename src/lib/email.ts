const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const ADMIN_EMAIL = "Ferocefashionff@gmail.com";

export type EmailType =
  | "welcome"
  | "verify-email"
  | "password-reset"
  | "order-confirmation"
  | "order-shipped"
  | "order-cancelled"
  | "new-order-admin"
  | "newsletter";

export interface EmailParams {
  type: EmailType;
  to: string | string[];
  name?: string;
  verificationUrl?: string;
  resetUrl?: string;
  orderId?: string;
  items?: Array<{ name: string; quantity: number; price: number }>;
  total?: number;
  shippingAddress?: Record<string, string>;
  paymentMethod?: string;
  trackingNumber?: string;
  customerEmail?: string;
}

async function triggerEmail(params: EmailParams): Promise<boolean> {
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (!res.ok) {
      console.error("Email send failed:", data);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Email error:", err);
    return false;
  }
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  return triggerEmail(params);
}

// Convenience: order confirmation + admin notification
export async function sendOrderConfirmation(params: {
  orderId: string;
  email: string;
  customerName: string;
  items: Array<{ name: string; color?: string; price: number; quantity: number }>;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: Record<string, string>;
  shippingMethod: string;
}) {
  const emailItems = params.items.map((i) => ({
    name: i.name + (i.color ? " — " + i.color : ""),
    quantity: i.quantity,
    price: i.price,
  }));

  // Send to customer
  await triggerEmail({
    type: "order-confirmation",
    to: params.email,
    name: params.customerName,
    orderId: params.orderId,
    items: emailItems,
    total: params.total,
    shippingAddress: params.shippingAddress,
    paymentMethod: params.shippingMethod,
  });

  // Notify admin
  await triggerEmail({
    type: "new-order-admin",
    to: ADMIN_EMAIL,
    orderId: params.orderId,
    customerEmail: params.email,
    items: emailItems,
    total: params.total,
    paymentMethod: params.shippingMethod,
  });
}

// Convenience: order shipped
export async function sendOrderShipped(params: {
  orderId: string;
  email: string;
  customerName: string;
  trackingNumber?: string;
}) {
  await triggerEmail({
    type: "order-shipped",
    to: params.email,
    name: params.customerName,
    orderId: params.orderId,
    trackingNumber: params.trackingNumber,
  });
}

// Convenience: order cancelled
export async function sendOrderCancelled(params: {
  orderId: string;
  email: string;
  customerName: string;
}) {
  await triggerEmail({
    type: "order-cancelled",
    to: params.email,
    name: params.customerName,
    orderId: params.orderId,
  });
}
