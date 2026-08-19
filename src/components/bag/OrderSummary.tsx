'use client'

import Link from 'next/link'
import { useState } from 'react'
import { formatPrice } from '@/lib/types'
import { useCartStore } from '@/store/cart'

export function OrderSummary() {
  const { items, subtotal } = useCartStore()
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)

  const subtotalCents = subtotal()
  const shippingCents = subtotalCents >= 20000 ? 0 : 1500 // Free over $200, else $15
  const taxCents = Math.round(subtotalCents * 0.0825) // 8.25% estimated tax
  const totalCents = subtotalCents + shippingCents + taxCents

  const handleApplyPromo = () => {
    // Placeholder — in production, validate against server
    if (promoCode.trim()) {
      setPromoApplied(true)
    }
  }

  return (
    <div className="bg-cream border border-line p-6 sm:p-7">
      <h2 className="label mb-6">Order Summary</h2>

      <div className="space-y-3.5 text-sm">
        {/* Subtotal */}
        <div className="flex justify-between">
          <span className="text-navy/60">Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
          <span className="font-medium text-navy">{formatPrice(subtotalCents)}</span>
        </div>

        {/* Shipping */}
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

        {/* Estimated tax */}
        <div className="flex justify-between">
          <span className="text-navy/60">Estimated Tax</span>
          <span className="font-medium text-navy">{formatPrice(taxCents)}</span>
        </div>

        {/* Divider */}
        <div className="h-px bg-line" />

        {/* Total */}
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
            className="flex-1 border border-line bg-white px-4 py-3 text-xs font-sans text-navy placeholder:text-navy/40 focus:outline-none focus:border-navy/30 min-h-[44px]"
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

      {/* Checkout CTA */}
      <Link
        href="/checkout"
        className="mt-6 block w-full btn-primary py-4 text-center min-h-[48px] group relative overflow-hidden text-center"
      >
        <span className="relative z-10">Proceed to Checkout</span>
        <div className="absolute inset-0 bg-gold/20 translate-y-full transition-transform duration-300 group-hover:translate-y-0" />
      </Link>

      {/* Trust signals */}
      <div className="mt-5 space-y-2">
        <div className="flex items-center gap-2.5">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-gold flex-shrink-0">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-[10px] text-navy/50">Free returns within 30 days</span>
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
