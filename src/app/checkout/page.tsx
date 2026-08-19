import { Suspense } from 'react'
import type { Metadata } from 'next'
import { CheckoutForm } from '@/components/checkout/CheckoutForm'
import { CheckoutSummary } from '@/components/checkout/CheckoutSummary'

export const metadata: Metadata = {
  title: 'Checkout — FÉROCE',
  description: 'Complete your Féroce order.',
}

export default function CheckoutPage() {
  return (
    <section className="bg-cream min-h-[60svh]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-navy md:text-5xl">
            Checkout
          </h1>
          <div className="mt-4 h-px w-16 bg-gold/40" />
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-12">
          {/* Left — Checkout form */}
          <div className="lg:col-span-3">
            <Suspense fallback={<div className="space-y-6">{[1,2,3,4].map(i => <div key={i} className="h-32 bg-white border border-line animate-pulse" />)}</div>}>
              <CheckoutForm />
            </Suspense>
          </div>

          {/* Right — Order summary */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-20">
              <CheckoutSummary />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
