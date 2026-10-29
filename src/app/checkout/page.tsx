import { Suspense } from 'react'
import { CheckoutClient } from './CheckoutClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Atelier Checkout & Pre-Order Allocation | FÉROCE',
  description: 'Complete your luxury handbag order or secure your Dallas atelier made-to-order pre-order allocation.',
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <section className="bg-white min-h-[80vh] flex items-center justify-center">
          <div className="mx-auto max-w-lg px-4 py-16 text-center">
            <div className="h-14 w-14 bg-gray-100 rounded-full animate-pulse mx-auto mb-6" />
            <div className="h-8 w-48 bg-gray-100 rounded-full animate-pulse mx-auto mb-4" />
            <div className="h-4 w-64 bg-gray-100 rounded-full animate-pulse mx-auto" />
          </div>
        </section>
      }
    >
      <CheckoutClient />
    </Suspense>
  )
}
