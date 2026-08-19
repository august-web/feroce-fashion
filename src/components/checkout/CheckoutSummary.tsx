'use client'

import { formatPrice } from '@/lib/types'
import { useCartStore } from '@/store/cart'

export function CheckoutSummary() {
  const { items, subtotal } = useCartStore()

  const subtotalCents = subtotal()
  const shippingCents = subtotalCents >= 20000 ? 0 : 1500 // Free over $200
  const taxCents = Math.round(subtotalCents * 0.0825) // 8.25% estimated tax
  const totalCents = subtotalCents + shippingCents + taxCents

  return (
    <div className="bg-cream border border-line p-6 sm:p-7">
      <h2 className="label mb-6">Order Summary</h2>

      {/* Item list */}
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={`${item.productId}-${item.color}`} className="flex gap-3">
            {/* Thumbnail */}
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden border border-line bg-white">
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover"
              />
              <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center bg-navy text-[8px] font-bold text-white">
                {item.quantity}
              </span>
            </div>
            {/* Details */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-navy truncate">{item.name}</p>
              <p className="text-[10px] text-navy/50 mt-0.5">{item.color}</p>
            </div>
            {/* Price */}
            <p className="text-xs font-medium text-navy whitespace-nowrap">
              {formatPrice(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      <div className="h-px bg-line" />

      {/* Pricing breakdown */}
      <div className="space-y-3 text-sm mt-4">
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

      {/* Trust signals */}
      <div className="mt-6 space-y-2.5">
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
