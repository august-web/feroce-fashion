import { Suspense } from 'react'
import type { Metadata } from 'next'
import WishlistClient from './WishlistClient'
import WishlistLoading from './loading'

export const metadata: Metadata = {
  title: 'Saved Creations — FÉROCE',
  description: 'Your private curated archive of saved FÉROCE fashion masterpieces.',
}

export default function WishlistPage() {
  return (
    <Suspense fallback={<WishlistLoading />}>
      <WishlistClient />
    </Suspense>
  )
}
