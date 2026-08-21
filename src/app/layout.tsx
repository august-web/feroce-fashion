import type { Metadata } from 'next'
import './globals.css'
import { StoreShell } from '@/components/StoreShell'
import { ToastContainer } from '@/components/Toast'
import { GoogleAnalytics } from '@/components/seo/Analytics'
import { OrganizationJsonLd, WebsiteJsonLd } from '@/components/seo/JsonLd'

const SITE_URL = 'https://ferocefashionff.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'FÉROCE — Luxury Handbags & Accessories | Designed in Dallas',
    template: '%s | FÉROCE',
  },
  description:
    'Fierce elegance, structured utility. FÉROCE crafts luxury handbags for women and men. Shop the Naji Collection and Denim De Ville Collection. Designed in Dallas.',
  keywords: [
    'luxury handbags',
    'designer bags',
    'FEROCE',
    'Dallas fashion',
    'women handbags',
    'men handbags',
    'fur handbag',
    'denim handbag',
    'Naji collection',
    'Denim De Ville',
    'structured handbag',
    'luxury accessories',
  ],
  authors: [{ name: 'FÉROCE Fashion' }],
  creator: 'FÉROCE Fashion',
  publisher: 'FÉROCE Fashion',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'FÉROCE',
    title: 'FÉROCE — Luxury Handbags & Accessories',
    description:
      'Fierce elegance, structured utility. Luxury handbags for women and men. Designed in Dallas.',
    images: [
      {
        url: '/images/hero-home.jpg',
        width: 1200,
        height: 630,
        alt: 'FÉROCE luxury handbag collection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FÉROCE — Luxury Handbags & Accessories',
    description:
      'Fierce elegance, structured utility. Luxury handbags for women and men. Designed in Dallas.',
    images: ['/images/hero-home.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <OrganizationJsonLd
          name="FÉROCE"
          url={SITE_URL}
          logo={`${SITE_URL}/favicon.ico`}
          description="Fierce elegance, structured utility. Luxury handbags designed in Dallas."
          sameAs={[
            'https://www.instagram.com/ferocefashion_ff',
            'https://www.tiktok.com/@ferocefashion_ff',
          ]}
        />
        <WebsiteJsonLd
          name="FÉROCE"
          url={SITE_URL}
          description="Fierce elegance, structured utility. Luxury handbags designed in Dallas."
        />
      </head>
      <body className="min-h-screen bg-cream font-sans text-navy antialiased">
        <GoogleAnalytics />
        <StoreShell>{children}</StoreShell>
        <ToastContainer />
      </body>
    </html>
  )
}
