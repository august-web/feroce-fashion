'use client'

import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/types'

type PaymentProvider = 'stripe' | 'paypal'
type StripeMethod = 'card' | 'cashapp' | 'bank_transfer'

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

export function PaymentSection({ total, email, shippingAddress, shippingMethod, onSuccess }: PaymentSectionProps) {
  const [provider, setProvider] = useState<PaymentProvider>('stripe')
  const [stripeMethod, setStripeMethod] = useState<StripeMethod>('card')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { items, clearCart } = useCartStore()

  const handleStripeCheckout = async () => {
    setProcessing(true)
    setError(null)
    try {
      const res = await fetch('/api/checkout/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, name: i.name, price: i.price, quantity: i.quantity, image: i.image, color: i.color })),
          email,
          shippingAddress,
          shippingMethod,
          paymentMethod: stripeMethod,
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else if (data.error) {
        setError(data.error)
        setProcessing(false)
      }
    } catch {
      setError('Something went wrong. Please try again.')
      setProcessing(false)
    }
  }

  const handlePayPalCheckout = async () => {
    setProcessing(true)
    setError(null)
    try {
      const res = await fetch('/api/checkout/paypal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, name: i.name, price: i.price, quantity: i.quantity, image: i.image, color: i.color })),
          email,
          shippingAddress,
          shippingMethod,
        }),
      })
      const data = await res.json()
      if (data.approvalUrl) {
        window.location.href = data.approvalUrl
      } else if (data.error) {
        setError(data.error)
        setProcessing(false)
      }
    } catch {
      setError('Something went wrong. Please try again.')
      setProcessing(false)
    }
  }

  const inputClass = "w-full border border-line bg-white px-4 py-3 text-[16px] font-sans text-navy placeholder:text-navy/40 focus:outline-none focus:border-navy/30 min-h-[44px]"
  const labelClass = "block text-[11px] font-sans uppercase tracking-luxury text-navy/60 mb-1.5"

  return (
    <div className="space-y-4">
      {/* Payment method selection */}
      <div className="space-y-2.5">
        {/* Stripe: Card / Apple Pay / Google Pay */}
        <label
          className={`flex items-center gap-3 p-4 border cursor-pointer transition-all min-h-[52px] ${
            provider === 'stripe' ? 'border-navy' : 'border-line hover:border-navy/30'
          }`}
        >
          <input
            type="radio"
            name="provider"
            checked={provider === 'stripe'}
            onChange={() => setProvider('stripe')}
            className="h-4 w-4 accent-navy"
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-navy">Card / Apple Pay / Google Pay</p>
            <p className="text-[10px] text-navy/40 mt-0.5">Powered by Stripe</p>
          </div>
          {/* Card icons */}
          <div className="flex gap-1.5">
            <span className="text-[9px] font-bold text-navy/60 border border-line px-1.5 py-0.5">VISA</span>
            <span className="text-[9px] font-bold text-navy/60 border border-line px-1.5 py-0.5">MC</span>
            <span className="text-[9px] font-bold text-navy/60 border border-line px-1.5 py-0.5">AMEX</span>
          </div>
        </label>

        {/* Stripe: Cash App Pay */}
        <label
          className={`flex items-center gap-3 p-4 border cursor-pointer transition-all min-h-[52px] ${
            provider === 'stripe' && stripeMethod === 'cashapp' ? 'border-navy' : 'border-line hover:border-navy/30'
          }`}
        >
          <input
            type="radio"
            name="provider"
            checked={provider === 'stripe' && stripeMethod === 'cashapp'}
            onChange={() => { setProvider('stripe'); setStripeMethod('cashapp') }}
            className="h-4 w-4 accent-navy"
          />
          <div>
            <p className="text-sm font-medium text-navy">Cash App Pay</p>
            <p className="text-[10px] text-navy/40 mt-0.5">Pay with Cash App</p>
          </div>
        </label>

        {/* Stripe: Bank Transfer */}
        <label
          className={`flex items-center gap-3 p-4 border cursor-pointer transition-all min-h-[52px] ${
            provider === 'stripe' && stripeMethod === 'bank_transfer' ? 'border-navy' : 'border-line hover:border-navy/30'
          }`}
        >
          <input
            type="radio"
            name="provider"
            checked={provider === 'stripe' && stripeMethod === 'bank_transfer'}
            onChange={() => { setProvider('stripe'); setStripeMethod('bank_transfer') }}
            className="h-4 w-4 accent-navy"
          />
          <div>
            <p className="text-sm font-medium text-navy">Bank Transfer (ACH)</p>
            <p className="text-[10px] text-navy/40 mt-0.5">Direct bank payment</p>
          </div>
        </label>

        {/* PayPal */}
        <label
          className={`flex items-center gap-3 p-4 border cursor-pointer transition-all min-h-[52px] ${
            provider === 'paypal' ? 'border-navy' : 'border-line hover:border-navy/30'
          }`}
        >
          <input
            type="radio"
            name="provider"
            checked={provider === 'paypal'}
            onChange={() => setProvider('paypal')}
            className="h-4 w-4 accent-navy"
          />
          <div>
            <p className="text-sm font-medium text-navy">PayPal</p>
            <p className="text-[10px] text-navy/40 mt-0.5">Pay with your PayPal account</p>
          </div>
          <span className="ml-auto font-bold text-sm text-[#003087]">PayPal</span>
        </label>
      </div>

      {/* Stripe card details (simplified — in production, use Stripe Payment Element) */}
      {provider === 'stripe' && stripeMethod === 'card' && (
        <div className="space-y-4 pt-2">
          <div>
            <label className={labelClass}>Card Number</label>
            <input type="text" placeholder="1234 5678 9012 3456" className={inputClass} maxLength={19} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Expiry</label>
              <input type="text" placeholder="MM / YY" className={inputClass} maxLength={7} />
            </div>
            <div>
              <label className={labelClass}>CVC</label>
              <input type="text" placeholder="123" className={inputClass} maxLength={4} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Name on Card</label>
            <input type="text" placeholder="Full name" className={inputClass} />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-3 text-xs text-red-700">
          {error}
        </div>
      )}

      {/* Submit button */}
      <button
        onClick={provider === 'paypal' ? handlePayPalCheckout : handleStripeCheckout}
        disabled={processing}
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
    </div>
  )
}
