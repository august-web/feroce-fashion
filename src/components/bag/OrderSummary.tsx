'use client'

import { useState } from 'react'
import { formatPrice } from '@/lib/types'
import { useCartStore } from '@/store/cart'

export function OrderSummary() {
  const { items, subtotal } = useCartStore()
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)

  const subtotalCents = subtotal()
  const shippingCents = subtotalCents >= 20000 ? 0 : 1500
  const taxCents = Math.round(subtotalCents * 0.0825)
  const totalCents = subtotalCents + shippingCents + taxCents

  const handleApplyPromo = () => {
    if (promoCode.trim()) {
      setPromoApplied(true)
    }
  }

  const [checkingOut, setCheckingOut] = useState(false)

  const handleCheckout = async () => {
    if (!items.length || checkingOut) return
    setCheckingOut(true)

    try {
      const res = await fetch('/api/checkout/stripe/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            slug: item.slug,
            price: item.price,
            image: item.image,
            color: item.color,
            quantity: item.quantity,
          })),
        }),
      })

      const data = await res.json()

      if (data.url) {
        window.open(data.url, "_self")
      } else {
        alert(data.error || 'Failed to start checkout. Please try again.')
      }
    } catch {
      alert('Network error. Please try again.')
    } finally {
      setCheckingOut(false)
    }
  }

  return (
    <div className="bg-cream border border-line p-6 sm:p-7">
      <h2 className="label mb-6">Order Summary</h2>

      <div className="space-y-3.5 text-sm">
        <div className="flex justify-between">
          <span className="text-navy/60">Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
          <span className="font-medium text-navy">{formatPrice(subtotalCents)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-navy/60">Shipping</span>
          <span className="font-medium text-navy">
            {shippingCents === 0 ? (
              <span className="text-gold">Free</span>
            ) : (
              formatPrice(shippingCents)
            )}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-navy/60">Estimated Tax</span>
          <span className="font-medium text-navy">{formatPrice(taxCents)}</span>
        </div>
        <div className="h-px bg-line" />
        <div className="flex justify-between">
          <span className="font-serif text-base font-semibold text-navy">Total</span>
          <span className="font-serif text-base font-semibold text-navy">{formatPrice(totalCents)}</span>
        </div>
      </div>

      {/* Promo code */}
      <div className="mt-6">
        <div className="flex gap-0">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Promo code"
            className="flex-1 border border-line bg-white px-4 py-3 text-[16px] font-sans text-navy placeholder:text-navy/40 focus:outline-none focus:border-navy/30 min-h-[48px]"
          />
          <button
            onClick={handleApplyPromo}
            className="px-5 py-3 text-[10px] font-sans uppercase tracking-luxury text-navy border border-l-0 border-line hover:bg-navy hover:text-white transition-colors min-h-[44px]"
            style={{ letterSpacing: '0.2em' }}
          >
            Apply
          </button>
        </div>
        {promoApplied && (
          <p className="mt-2 text-[10px] text-gold font-sans uppercase tracking-luxury">
            ✓ Promo code applied
          </p>
        )}
      </div>

      {/* Checkout CTA — redirects to Stripe Payment Link */}
      <button
        onClick={handleCheckout}
        disabled={!items.length || checkingOut}
        className="mt-6 block w-full btn-primary py-4 text-center min-h-[48px] group relative overflow-hidden text-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="relative z-10">{checkingOut ? 'STARTING CHECKOUT...' : 'PROCEED TO CHECKOUT'}</span>
        <div className="absolute inset-0 bg-gold/20 translate-y-full transition-transform duration-300 group-hover:translate-y-0" />
      </button>

      {/* Trust signals */}
      <div className="mt-5 space-y-2">
        <div className="flex items-center gap-2.5">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-gold flex-shrink-0">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-[10px] text-navy/50">All sales are final — no refunds, returns, or exchanges</span>
        </div>
        <div className="flex items-center gap-2.5">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-gold flex-shrink-0">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-[10px] text-navy/50">Secure checkout, encrypted end to end</span>
        </div>
      </div>
    </div>
  )
}
