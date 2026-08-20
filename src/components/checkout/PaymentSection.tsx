'use client'

import { useState, useEffect } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/types'
import { StripeProvider } from './StripeProvider'

interface PaymentSectionProps {
  total: number
  email: string
  shippingAddress: {
    name: string
    address: string
    apartment: string
    city: string
    state: string
    zip: string
    country: string
    phone: string
  }
  shippingMethod: string
  onSuccess: (orderId: string) => void
}

function PaymentForm({
  total,
  email,
  shippingAddress,
  shippingMethod,
  onSuccess,
}: PaymentSectionProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { items, clearCart } = useCartStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setProcessing(true)
    setError(null)

    try {
      // Confirm the payment with Stripe
      const { error: stripeError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
          payment_method_data: {
            billing_details: {
              name: shippingAddress.name,
              email,
              phone: shippingAddress.phone || undefined,
              address: {
                line1: shippingAddress.address,
                line2: shippingAddress.apartment || undefined,
                city: shippingAddress.city,
                state: shippingAddress.state,
                postal_code: shippingAddress.zip,
                country: 'US',
              },
            },
          },
        },
        redirect: 'if_required',
      })

      if (stripeError) {
        setError(stripeError.message || 'Payment failed. Please try again.')
        setProcessing(false)
        return
      }

      // If we get here without redirect, payment succeeded in-page
      // Now create the order in our database
      const res = await fetch('/api/checkout/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            image: i.image,
            color: i.color,
          })),
          email,
          shippingAddress,
          shippingMethod,
          paymentMethod: 'card',
        }),
      })

      const data = await res.json()
      if (data.orderId) {
        clearCart()
        onSuccess(data.orderId)
      } else if (data.error) {
        setError(data.error)
        setProcessing(false)
      }
    } catch {
      setError('Something went wrong. Please try again.')
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Stripe Payment Element */}
      <div className="border border-line p-4 bg-white">
        <PaymentElement
          options={{
            layout: 'tabs',
            wallets: {
              applePay: 'auto',
              googlePay: 'auto',
            },
          }}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-3 text-xs text-red-700">
          {error}
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={!stripe || !elements || processing}
        className="mt-4 w-full btn-primary py-4 min-h-[48px] text-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Processing…
          </span>
        ) : (
          `Place Order — ${formatPrice(total)}`
        )}
      </button>

      {/* Security note */}
      <p className="text-center text-[10px] text-navy/40 mt-3">
        Your payment info is encrypted and secure. We never store your card details.
      </p>
    </form>
  )
}

/**
 * PaymentSection — wraps the Stripe Payment Element in a provider.
 * Creates a PaymentIntent on mount and renders the real Stripe form.
 */
export function PaymentSection(props: PaymentSectionProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [intentError, setIntentError] = useState<string | null>(null)
  const { items } = useCartStore()

  useEffect(() => {
    // Calculate the total to send to the server
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shipping = subtotal >= 20000 ? 0 : (props.shippingMethod === 'express' ? 1800 : 1500)
    const tax = Math.round(subtotal * 0.0825)
    const total = subtotal + shipping + tax

    // Create PaymentIntent
    fetch('/api/checkout/stripe/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: total,
        email: props.email,
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          color: i.color,
        })),
        shippingAddress: props.shippingAddress,
        shippingMethod: props.shippingMethod,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret)
        } else if (data.error) {
          setIntentError(data.error)
        }
      })
      .catch(() => {
        setIntentError('Failed to initialize payment. Please try again.')
      })
  }, [props.email, props.shippingAddress, props.shippingMethod, items])

  if (intentError) {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          <p className="font-medium mb-1">Payment unavailable</p>
          <p className="text-xs">{intentError}</p>
        </div>
        <p className="text-center text-[10px] text-navy/40">
          Please check your payment details or try a different browser.
        </p>
      </div>
    )
  }

  if (!clientSecret) {
    return (
      <div className="space-y-4">
        {/* Loading skeleton for payment form */}
        <div className="border border-line p-4 bg-white space-y-3">
          <div className="h-10 bg-cream animate-pulse rounded" />
          <div className="h-10 bg-cream animate-pulse rounded" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-10 bg-cream animate-pulse rounded" />
            <div className="h-10 bg-cream animate-pulse rounded" />
          </div>
        </div>
        <div className="h-12 bg-navy/10 animate-pulse rounded" />
        <p className="text-center text-[10px] text-navy/30">Loading secure payment form…</p>
      </div>
    )
  }

  return (
    <StripeProvider clientSecret={clientSecret}>
      <PaymentForm {...props} />
    </StripeProvider>
  )
}
