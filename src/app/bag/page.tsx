import { Suspense } from 'react'
import type { Metadata } from 'next'
import BagClient from './BagClient'
import BagLoading from './loading'

export const metadata: Metadata = {
  title: 'Your Curated Bag — FÉROCE',
  description: 'Review your handcrafted FÉROCE luxury handbag selection and bespoke allocations.',
}

export default function BagPage() {
  return (
    <Suspense fallback={<BagLoading />}>
      <BagClient />
    </Suspense>
  )
}
