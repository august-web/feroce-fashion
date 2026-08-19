'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useCartStore } from '@/store/cart'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order')
  const { clearCart } = useCartStore()
  const [cleared, setCleared] = useState(false)

  useEffect(() => {
    if (!cleared) {
      clearCart()
      setCleared(true)
    }
  }, [cleared, clearCart])

  return (
    <section className="bg-cream min-h-[70svh] flex items-center">
      <div className="mx-auto max-w-lg px-4 py-16 sm:py-24 text-center">
        {/* Success icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center bg-gold/20">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-8 w-8 text-gold">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-navy mb-4">
          Thank You
        </h1>

        <p className="text-sm text-navy/60 mb-2">
          Your order has been placed successfully.
        </p>

        {orderId && (
          <p className="text-xs text-navy/40 mb-1">
            Order #{orderId}
          </p>
        )}

        <p className="text-xs text-navy/40 mb-8">
          A receipt was emailed to you.
        </p>

        {/* Divider */}
        <div className="h-px w-16 bg-gold/40 mx-auto mb-8" />

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href="/shop"
            className="block w-full btn-primary py-4 text-center min-h-[48px]"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="block w-full text-center text-[11px] font-sans uppercase tracking-luxury text-navy/50 hover:text-navy transition-colors py-4 min-h-[48px]"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <section className="bg-cream min-h-[70svh] flex items-center">
          <div className="mx-auto max-w-lg px-4 py-16 sm:py-24 text-center">
            <div className="h-16 w-16 bg-line/40 animate-pulse mx-auto mb-6" />
            <div className="h-8 w-48 bg-line animate-pulse mx-auto mb-4" />
            <div className="h-4 w-64 bg-line/60 animate-pulse mx-auto" />
          </div>
        </section>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}
