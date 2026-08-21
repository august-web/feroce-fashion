import type { Metadata } from 'next'
import './globals.css'
import { StoreShell } from '@/components/StoreShell'
import { ToastContainer } from '@/components/Toast'

export const metadata: Metadata = {
  title: 'FÉROCE — Luxury Handbags & Accessories',
  description: 'Fierce elegance, structured utility. Designed in Dallas.',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'FÉROCE — Luxury Handbags & Accessories',
    description: 'Fierce elegance, structured utility. Designed in Dallas.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-cream font-sans text-navy antialiased">
        <StoreShell>{children}</StoreShell>
        <ToastContainer />
      </body>
    </html>
  )
}
