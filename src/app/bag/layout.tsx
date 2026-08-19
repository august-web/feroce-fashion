import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Your Bag — FÉROCE',
  description: 'Review your Féroce handbag selection. Free shipping on orders over $200.',
}

export default function BagLayout({ children }: { children: React.ReactNode }) {
  return children
}
