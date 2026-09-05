import type { Metadata } from 'next'
import './globals.css'
import { StoreShell } from '@/components/StoreShell'
import { ToastContainer } from '@/components/Toast'
import { GoogleAnalytics } from '@/components/seo/Analytics'
import { OrganizationJsonLd, WebsiteJsonLd } from '@/components/seo/JsonLd'
import { SmoothScroll } from '@/components/SmoothScroll'
import { PageTransition } from '@/components/PageTransition'

const SITE_URL = 'https://www.ferocefashionff.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'FÉROCE Fashion — Luxury Handbags & Accessories | Designed in Dallas',
    template: '%s | FÉROCE Fashion',
  },
  description:
    'Fierce elegance, structured utility. FÉROCE Fashion crafts luxury handbags for women and men. Shop the Naji Collection and Denim De Ville Collection. Designed in Dallas.',
  keywords: [
    // Brand
    'FEROCE', 'FEROCE handbags', 'FEROCE fashion', 'FEROCE bags',
    // Core product terms
    'luxury handbags', 'designer handbags', 'premium handbags', 'high-end handbags', 'designer bags',
    // Women's
    'women handbags', 'womens handbags', 'women designer bags', 'ladies handbags', 'women luxury bags',
    // Men's
    'men handbags', 'mens handbags', 'men designer bags', 'men luxury bags', 'men accessories',
    // Styles
    'fur handbag', 'fur bag', 'quilted handbag', 'structured handbag', 'crossbody bag', 'tote bag', 'clutch bag', 'satchel bag', 'fanny pack',
    // Materials
    'fur bags', 'denim handbag', 'leather handbag', 'genuine leather bag',
    // Collections
    'Naji collection', 'Naji bag', 'Denim De Ville', 'Denim De Ville bag',
    // Occasions
    'party bag', 'evening bag', 'everyday handbag', 'travel bag',
    // Location / brand story
    'Dallas fashion', 'Dallas designer', 'Texas fashion',
    // Long-tail
    'best luxury handbags 2026', 'trendy handbags', 'affordable luxury bags', 'designer handbag sale', 'shop handbags online',
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
    siteName: 'FÉROCE Fashion',
    title: 'FÉROCE Fashion — Luxury Handbags & Accessories',
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
    title: 'FÉROCE Fashion — Luxury Handbags & Accessories',
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap" />
        <meta name="google-site-verification" content="IuQlTSkDs6ZsFTTV_x1PPq49ldNrHX9sQclLzptXYxE" />
        <OrganizationJsonLd
          name="FÉROCE Fashion"
          url={SITE_URL}
          logo={`${SITE_URL}/favicon.ico`}
          description="Fierce elegance, structured utility. Luxury handbags designed in Dallas."
          sameAs={[
            'https://www.instagram.com/ferocefashion_ff',
            'https://www.tiktok.com/@ferocefashion_ff',
          ]}
        />
        <WebsiteJsonLd
          name="FÉROCE Fashion"
          url={SITE_URL}
          description="Fierce elegance, structured utility. Luxury handbags designed in Dallas."
        />
      </head>
      <body className="min-h-screen bg-cream font-sans text-navy antialiased">
        <GoogleAnalytics />
        <SmoothScroll><StoreShell><PageTransition>{children}</PageTransition></StoreShell></SmoothScroll>
        <ToastContainer />
      </body>
    </html>
  )
}
