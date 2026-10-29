'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatPrice } from '@/lib/types'
import { useCartStore } from '@/store/cart'
import { ArrowRight, ShieldCheck, Check, Sparkles, Lock } from 'lucide-react'

import type { CartItem } from '@/lib/types'

export function OrderSummary({ items: propItems }: { items?: CartItem[] } = {}) {
  const { items: storeItems, subtotal } = useCartStore()
  const items = propItems || storeItems
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [checkingOut, setCheckingOut] = useState(false)

  // All amounts in DOLLARS. Free shipping over $200, standard shipping $15.
  const subtotalDollars = propItems
    ? propItems.reduce((acc, i) => acc + i.price * i.quantity, 0)
    : subtotal()
  const shippingDollars = subtotalDollars >= 200 ? 0 : 15
  const taxDollars = Math.round(subtotalDollars * 0.0825 * 100) / 100
  const totalDollars = subtotalDollars + shippingDollars + taxDollars

  const handleApplyPromo = () => {
    if (promoCode.trim()) {
      setPromoApplied(true)
    }
  }

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
        window.open(data.url, '_self')
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
    <div className="rounded-[32px] sm:rounded-[40px] bg-[#F6F6F8] border border-gray-200/80 p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.03)] space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 bg-white border border-gray-200/80 text-[10px] font-semibold tracking-wider uppercase text-navy/70 mb-2 shadow-2xs">
          <Sparkles size={11} className="text-gold" />
          Dallas Atelier
        </div>
        <h2 className="font-sans font-bold text-xl sm:text-2xl text-navy tracking-tight">
          Order Summary
        </h2>
      </div>

      {/* Breakdown */}
      <div className="space-y-3.5 text-sm font-sans">
        <div className="flex justify-between items-center text-navy/70">
          <span>Subtotal ({items.length} {items.length === 1 ? 'piece' : 'pieces'})</span>
          <span className="font-bold text-navy">{formatPrice(subtotalDollars)}</span>
        </div>

        <div className="flex justify-between items-center text-navy/70">
          <span>Shipping</span>
          <span className="font-bold">
            {shippingDollars === 0 ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <Check size={13} strokeWidth={2.5} />
                Complimentary
              </span>
            ) : (
              formatPrice(shippingDollars)
            )}
          </span>
        </div>

        <div className="flex justify-between items-center text-navy/70">
          <span>Estimated Sales Tax (TX 8.25%)</span>
          <span className="font-bold text-navy">{formatPrice(taxDollars)}</span>
        </div>

        <div className="pt-2 border-t border-gray-200/80">
          <div className="flex justify-between items-baseline">
            <span className="font-sans font-bold text-base text-navy">Estimated Total</span>
            <span className="font-sans font-bold text-2xl text-navy tracking-tight">
              {formatPrice(totalDollars)}
            </span>
          </div>
        </div>
      </div>

      {/* Promo Code Input */}
      <div>
        <div className="relative flex items-center">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Enter promo or gift code"
            className="w-full rounded-full bg-white border border-gray-200/90 pl-5 pr-24 py-3.5 text-xs font-sans text-navy placeholder:text-navy/35 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy shadow-xs transition-all duration-200 min-h-[46px]"
          />
          <button
            type="button"
            onClick={handleApplyPromo}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#4A4D52] hover:bg-navy text-white rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-xs"
          >
            Apply
          </button>
        </div>
        {promoApplied && (
          <p className="mt-2 text-[11px] text-emerald-700 font-medium font-sans flex items-center gap-1 pl-2">
            <Check size={12} strokeWidth={2.5} />
            Promo applied successfully
          </p>
        )}
      </div>

      {/* Checkout Primary Capsule CTA */}
      <div>
        <button
          onClick={handleCheckout}
          disabled={!items.length || checkingOut}
          className="w-full bg-[#4A4D52] hover:bg-navy text-white rounded-full py-4 text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.08)] flex items-center justify-center gap-2 min-h-[50px] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {checkingOut ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Starting Secure Checkout…
            </span>
          ) : (
            <>
              <Lock size={13} />
              <span>Proceed to Checkout</span>
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </div>

      {/* Guest Checkout Notice */}
      <p className="text-center text-[11px] text-navy/55 font-sans leading-relaxed">
        Guest checkout available.{' '}
        <Link href="/register" className="font-semibold text-navy hover:underline underline-offset-2">
          Create an account
        </Link>{' '}
        or{' '}
        <Link href="/login" className="font-semibold text-navy hover:underline underline-offset-2">
          sign in
        </Link>{' '}
        for order tracking.
      </p>

      {/* Trust & Guarantee */}
      <div className="pt-4 border-t border-gray-200/80 space-y-2.5">
        <div className="flex items-center gap-2 text-navy/60 text-[11px] font-sans">
          <ShieldCheck size={14} className="text-gold shrink-0" />
          <span>256-Bit Encrypted Atelier Checkout</span>
        </div>
        <div className="flex items-center gap-2 text-navy/60 text-[11px] font-sans">
          <Sparkles size={14} className="text-gold shrink-0" />
          <span>Complimentary Dallas Dust Bag & Box Included</span>
        </div>
      </div>
    </div>
  )
}
