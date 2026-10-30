import { Suspense } from 'react'
import { CheckoutClient } from './CheckoutClient'
import CheckoutLoading from './loading'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Atelier Checkout & Pre-Order Allocation | FÉROCE',
  description: 'Complete your luxury handbag order or secure your Dallas atelier made-to-order pre-order allocation.',
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutLoading />}>
      <CheckoutClient />
    </Suspense>
  )
}
