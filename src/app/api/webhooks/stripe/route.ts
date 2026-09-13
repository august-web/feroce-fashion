import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { sendOrderConfirmation } from '@/lib/email';
import { getStripe } from '@/lib/stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

/**
 * Stripe Webhook Handler
 *
 * 1. Verify the webhook signature (prevents forged orders)
 * 2. Handle checkout.session.completed — create order + send email
 * 3. Handle payment_intent.payment_failed — log for admin
 *
 * Never mark an order as paid from the client — only from this webhook.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const sig = request.headers.get('stripe-signature');

    if (!sig) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET is not set');
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    // Verify webhook signature — throws if invalid
    let event: Stripe.Event;
    try {
      event = getStripe().webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('Webhook signature verification failed:', message);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // ── checkout.session.completed ──
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.order_id;
      const email = session.customer_email || session.customer_details?.email || session.metadata?.email;

      if (orderId && email) {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!,
        );

        // Mark paid and capture the address Stripe collected at checkout
        // (the hosted flow creates the order before an address exists).
        const addr = session.shipping_details?.address;
        const shippingAddress: Record<string, string> = {
          email,
          ...(session.customer_details?.name ? { name: session.customer_details.name } : {}),
          ...(session.customer_details?.phone ? { phone: session.customer_details.phone } : {}),
          ...(addr?.line1 ? { address: addr.line1 } : {}),
          ...(addr?.line2 ? { apartment: addr.line2 } : {}),
          ...(addr?.city ? { city: addr.city } : {}),
          ...(addr?.state ? { state: addr.state } : {}),
          ...(addr?.postal_code ? { zip: addr.postal_code } : {}),
          ...(addr?.country ? { country: addr.country } : {}),
        };

        const { data: existingOrder } = await supabase
          .from('orders')
          .select('status, shipping_address')
          .eq('id', orderId)
          .single();

        // Idempotency: webhook deliveries can repeat — don't re-apply
        // side effects (stock decrement, confirmation email) for an
        // order that is already past pending.
        if (existingOrder && existingOrder.status !== 'pending') {
          return NextResponse.json({ received: true, duplicate: true });
        }

        // Only mark paid if the money actually arrived (async payment
        // methods can complete the session while unpaid).
        if (session.payment_status !== 'paid') {
          return NextResponse.json({ received: true, unpaid: true });
        }

        const hasAddress = (() => {
          const current = existingOrder?.shipping_address as Record<string, string> | null | undefined;
          return !!(current && Object.keys(current).length > 0);
        })();

        // Stripe's charge is authoritative for money — record the real
        // amount (cents → dollars) plus the payment intent id.
        await supabase
          .from('orders')
          .update({
            status: 'paid',
            total: (session.amount_total ?? 0) / 100,
            ...(session.payment_intent ? { stripe_payment_intent_id: session.payment_intent as string } : {}),
            ...(hasAddress ? {} : { shipping_address: shippingAddress }),
          })
          .eq('id', orderId);

        // Atomically decrement stock for every line item. Runs only on the
        // pending → paid transition (guarded by the idempotency check above).
        const { data: items } = await supabase
          .from('order_items')
          .select('product_id, quantity')
          .eq('order_id', orderId);

        for (const item of items || []) {
          if (!item.product_id) continue;
          const { error: stockError } = await supabase.rpc('decrement_stock', {
            p_product_id: item.product_id,
            p_quantity: item.quantity,
          });
          if (stockError) {
            console.error('Stock decrement failed for ' + item.product_id + ':', stockError.message);
          }
        }

        // Fetch order details
        const { data: order } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (order) {
          // Fetch order details for the email (names + quantities + prices)
          const { data: fullItems } = await supabase
            .from('order_items')
            .select('name, price, quantity')
            .eq('order_id', orderId);

          const shippingAddr = order.shipping_address as Record<string, string>;

          // Send confirmation email
          await sendOrderConfirmation({
            orderId: order.id,
            email,
            customerName: shippingAddr?.name || 'Customer',
            items: (fullItems || []).map((item) => ({
              name: item.name,
              color: '',
              price: item.price,
              quantity: item.quantity,
            })),
            subtotal: order.total - Math.round(order.total * 0.0825),
            shipping: 0,
            tax: Math.round(order.total * 0.0825),
            total: order.total,
            shippingAddress: {
              name: shippingAddr?.name || '',
              address: shippingAddr?.address || '',
              apartment: shippingAddr?.apartment,
              city: shippingAddr?.city || '',
              state: shippingAddr?.state || '',
              zip: shippingAddr?.zip || '',
              country: shippingAddr?.country || 'US',
            },
            shippingMethod: 'standard',
          }).catch((err) => console.error('Failed to send confirmation email:', err));
        }

        console.log('Order ' + orderId + ' marked as paid via webhook');
      }
    }

    // ── payment_intent.payment_failed ──
    if (event.type === 'payment_intent.payment_failed') {
      const intent = event.data.object as Stripe.PaymentIntent;
      console.error('Payment failed for intent ' + intent.id + ': ' + (intent.last_payment_error?.message || 'Unknown'));
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 },
    );
  }
}
