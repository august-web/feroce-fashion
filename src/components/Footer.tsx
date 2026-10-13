import Link from 'next/link'
import { NewsletterForm } from './NewsletterForm'

const FOOTER_LINKS = {
  Shop: [
    { label: "Women's", href: '/shop/womens' },
    { label: "Men's", href: '/shop/mens' },
    { label: 'Denim De Ville', href: '/product/denim-de-ville-blue-gold' },
    { label: 'Naji', href: '/product/naji-gold-fur-xl' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
  ],
  Support: [
    { label: 'Shipping & Returns', href: '/shipping' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms & Conditions', href: '/terms' },
    { label: 'Accessibility', href: '/accessibility' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-14 md:px-8">
        {/* ── Newsletter ── */}
        <div className="mb-8 sm:mb-10 text-center">
          <p className="label mb-3">Stay in the Loop</p>
          <p className="mb-4 text-xs text-navy/60 px-4">
            Get new arrivals, restocks, and Féroce stories delivered to your inbox.
          </p>
          <NewsletterForm />
        </div>

        {/* ── Link columns — 2-col mobile, 4-col desktop ── */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4
                className="mb-4 text-[11px] font-sans font-semibold uppercase text-navy"
                style={{ letterSpacing: '0.15em' }}
              >
                {title}
              </h4>
              <ul className="space-y-0.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="flex items-center text-xs text-[#6b6b6b] hover:text-gold transition-colors min-h-[36px]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Divider ── */}
        <div className="mt-8 sm:mt-10 h-px bg-[#c8c5be]" />

        {/* ── Bottom bar ── */}
        <div className="mt-5 sm:mt-6 flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* Left — Logo + social icons */}
          <div className="flex items-center gap-5">
            <span className="font-serif text-sm font-semibold text-navy tracking-tight">FÉROCE</span>
            <div className="flex items-center gap-3">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/ferocefashion_ff?igsi=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-[#6b6b6b] hover:text-gold transition-colors"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@ferocefashion_ff"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="text-[#6b6b6b] hover:text-gold transition-colors"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48V13.2a8.19 8.19 0 005.58 2.17V12a4.85 4.85 0 01-5.58-2.71V6.69h5.58z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Center — Copyright */}
          <span className="text-[10px] text-[#6b6b6b] text-center order-last md:order-none">
            © 2026 Féroce Fashion. All rights reserved. Designed in Dallas.
          </span>

          {/* Right — Payment marks */}
          <div className="flex items-center gap-2" aria-label="Visa, Mastercard, American Express accepted">
            <div className="flex h-6 items-center rounded border border-[#d1cec7] bg-white px-1.5">
              <svg viewBox="0 0 36 12" className="h-3 w-9" role="img" aria-label="Visa">
                <text x="18" y="9.5" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontSize="10" fontWeight="bold" fontStyle="italic" fill="#1a1f71" letterSpacing="0.5">VISA</text>
              </svg>
            </div>
            <div className="flex h-6 items-center rounded border border-[#d1cec7] bg-white px-1.5">
              <svg viewBox="0 0 26 16" className="h-4 w-6.5" role="img" aria-label="Mastercard">
                <circle cx="9" cy="8" r="6" fill="#eb001b" />
                <circle cx="17" cy="8" r="6" fill="#f79e1b" fillOpacity="0.9" />
              </svg>
            </div>
            <div className="flex h-6 items-center rounded border border-[#d1cec7] bg-white px-1.5">
              <svg viewBox="0 0 30 16" className="h-4 w-7.5" role="img" aria-label="American Express">
                <rect width="30" height="16" rx="2" fill="#2e77bc" />
                <text x="15" y="11" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontSize="6.5" fontWeight="bold" fill="#ffffff" letterSpacing="0.4">AMEX</text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
