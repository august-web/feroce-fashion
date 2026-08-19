import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Order Confirmed — FÉROCE',
  description: 'Your Féroce order has been placed successfully.',
}

export default function SuccessLayout({ children }: { children: React.ReactNode }) {
  return children
}
