import { redirect } from 'next/navigation'

/**
 * /checkout now redirects to /bag.
 * Payment is handled by Stripe's hosted Checkout page.
 * Customers click "Proceed to Checkout" in the bag → redirected to Stripe.
 */
export default function CheckoutPage() {
  redirect('/bag')
}
