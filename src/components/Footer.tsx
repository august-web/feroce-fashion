import Link from 'next/link'
import { NewsletterForm } from './NewsletterForm'

const FOOTER_LINKS = {
  Collections: [
    { label: 'Denim De Ville', href: '/shop/womens' },
    { label: 'The Naji Fur Edit', href: '/shop/womens' },
    { label: 'Luxury Fanny Packs', href: '/shop/mens' },
    { label: 'Signature Satchels', href: '/shop/mens' },
    { label: 'View All Handbags', href: '/shop' },
  ],
  ClientConcierge: [
    { label: 'Order Status & Pre-Orders', href: '/account' },
    { label: 'Shipping & Production Timeline', href: '/shipping' },
    { label: 'Care & Maintenance Guide', href: '/faq' },
    { label: 'Contact Client Concierge', href: '/contact' },
  ],
  TheHouse: [
    { label: 'About Féroce', href: '/about' },
    { label: 'The Dallas Atelier', href: '/about' },
    { label: 'Sustainability & Materials', href: '/about' },
    { label: 'Private Membership', href: '/register' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Accessibility Statement', href: '/accessibility' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-20 md:px-8">
        {/* Newsletter Section */}
        <div className="mb-14 sm:mb-16 text-center max-w-xl mx-auto">
          <p className="text-[10px] uppercase font-sans tracking-[0.3em] text-gold font-semibold mb-2">
            The Féroce Dispatch
          </p>
          <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-navy mb-3">
            Stay in the Inner Circle
          </h3>
          <p className="mb-6 text-xs text-navy/60 leading-relaxed font-light">
            Receive exclusive drop alerts, private Dallas atelier pre-orders, and invitation-only releases.
          </p>
          <NewsletterForm />
        </div>

        {/* Link Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 pb-12 border-b border-line">
          <div>
            <h4 className="mb-4 text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-navy">
              Collections
            </h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.Collections.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-xs text-navy/60 hover:text-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-navy">
              Client Concierge
            </h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.ClientConcierge.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-xs text-navy/60 hover:text-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-navy">
              The House
            </h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.TheHouse.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-xs text-navy/60 hover:text-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-navy">
              Legal
            </h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.Legal.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-xs text-navy/60 hover:text-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/images/feroce-emblem.png" alt="FÉROCE" className="w-7 h-7 object-contain" />
            <span className="font-sans text-base font-bold tracking-[0.14em] text-navy">FÉROCE</span>
            <span className="text-[10px] text-navy/45 uppercase tracking-[0.2em] font-semibold">Fashion</span>
          </div>

          <div className="text-[11px] text-navy/50 text-center order-last md:order-none">
            © {new Date().getFullYear()} FÉROCE Fashion LLC. All rights reserved. Handcrafted luxury.
          </div>

          {/* Payment Marks Row */}
          <div className="flex items-center gap-2 flex-wrap justify-center text-[10px] text-navy/60">
            <span className="px-2 py-1 bg-cream border border-line font-mono font-semibold">VISA</span>
            <span className="px-2 py-1 bg-cream border border-line font-mono font-semibold">MC</span>
            <span className="px-2 py-1 bg-cream border border-line font-mono font-semibold">AMEX</span>
            <span className="px-2 py-1 bg-cream border border-line font-sans font-semibold">APPLE PAY</span>
            <span className="px-2 py-1 bg-cream border border-line font-sans font-semibold">KLARNA</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
