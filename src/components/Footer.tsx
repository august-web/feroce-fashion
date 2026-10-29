import Link from 'next/link'
import { NewsletterForm } from './NewsletterForm'
import { Sparkles, ShieldCheck, Truck, Clock, Lock, ArrowUpRight } from 'lucide-react'

const VALUE_PILLARS = [
  {
    icon: Sparkles,
    title: 'Dallas Handcrafted',
    description: 'Bespoke silhouettes designed in Texas',
  },
  {
    icon: Truck,
    title: 'Express Delivery',
    description: 'Complimentary US shipping over $200',
  },
  {
    icon: ShieldCheck,
    title: 'Guaranteed Authentic',
    description: 'Serialized certificate with every bag',
  },
  {
    icon: Clock,
    title: 'Pay with Klarna',
    description: 'Split in 4 interest-free installments',
  },
]

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
    { label: 'About Féroce Fashion', href: '/about' },
    { label: 'Dallas Design Studio', href: '/about' },
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
    <footer className="border-t border-[#EAE6DF] bg-[#FAF9F6] relative z-20 font-sans text-navy">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20">
        
        {/* ── Section 1: The Féroce Dispatch (Newsletter Hero Card) ── */}
        <div className="rounded-[30px] sm:rounded-[36px] bg-gradient-to-b from-[#0A1128] via-[#0D1738] to-[#0A1128] text-white p-6 sm:p-10 md:p-12 border border-white/10 shadow-lg relative overflow-hidden mb-12 sm:mb-14 text-center">
          {/* Subtle gold radial aura */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 sm:w-96 h-80 bg-gold/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-xl mx-auto">
            {/* Eyebrow Capsule */}
            <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 bg-white/10 backdrop-blur-md border border-white/15 text-[10px] font-semibold tracking-widest uppercase text-gold shadow-2xs mb-3.5">
              <Sparkles size={11} className="text-gold" />
              <span>The FÉROCE Dispatch</span>
            </div>

            {/* Headline */}
            <h3 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-tight mb-2.5">
              Stay in the Inner Circle
            </h3>

            {/* Description */}
            <p className="text-xs sm:text-sm text-white/75 max-w-md mx-auto leading-relaxed mb-6 font-light">
              Receive exclusive drop alerts, private Dallas studio pre-orders, and invitation-only releases.
            </p>

            {/* Form */}
            <NewsletterForm />

            {/* Micro Reassurance */}
            <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-white/50 tracking-wider uppercase font-medium">
              <Lock size={10} className="text-gold/80" />
              <span>Strict privacy · Never shared · Dallas Concierge</span>
            </div>
          </div>
        </div>

        {/* ── Section 2: Four Luxury Value Pillars ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 mb-12 sm:mb-16">
          {VALUE_PILLARS.map((pillar) => {
            const Icon = pillar.icon
            return (
              <div
                key={pillar.title}
                className="rounded-2xl bg-white border border-[#EAE6DF] p-4 flex items-center gap-3.5 shadow-2xs hover:border-gold/40 hover:shadow-xs transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-full bg-[#FAF9F6] border border-[#EAE6DF] group-hover:border-gold/40 text-gold flex items-center justify-center shrink-0 transition-colors shadow-2xs">
                  <Icon size={16} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-navy tracking-tight truncate">
                    {pillar.title}
                  </h4>
                  <p className="text-[11px] text-navy/55 leading-tight mt-0.5 truncate">
                    {pillar.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Section 3: Navigation Columns ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 pb-12 border-b border-[#EAE6DF]">
          {/* Collections */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              <h4 className="text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-navy">
                Collections
              </h4>
            </div>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.Collections.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs text-navy/65 hover:text-gold hover:translate-x-1 inline-block transition-all duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Client Concierge */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              <h4 className="text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-navy">
                Client Concierge
              </h4>
            </div>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.ClientConcierge.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs text-navy/65 hover:text-gold hover:translate-x-1 inline-block transition-all duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* The House */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              <h4 className="text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-navy">
                The House
              </h4>
            </div>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.TheHouse.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs text-navy/65 hover:text-gold hover:translate-x-1 inline-block transition-all duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              <h4 className="text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-navy">
                Legal
              </h4>
            </div>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.Legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs text-navy/65 hover:text-gold hover:translate-x-1 inline-block transition-all duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Section 4: Bottom Bar (Brand, Social, Payment, Copyright) ── */}
        <div className="pt-8 sm:pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand Lockup */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white border border-[#EAE6DF] shadow-2xs flex items-center justify-center p-1">
              <img src="/images/feroce-emblem.png" alt="FÉROCE" className="w-full h-full object-contain" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-sans text-base font-bold tracking-[0.14em] text-navy">FÉROCE</span>
              <span className="rounded-full px-2 py-0.5 bg-navy/5 text-[9px] font-bold text-navy/60 tracking-widest uppercase">
                Fashion
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[9px] text-navy/40 font-medium tracking-wider uppercase ml-1">
                · Dallas, TX
              </span>
            </div>
          </div>

          {/* Social Channels */}
          <div className="flex items-center gap-2">
            <a
              href="https://www.instagram.com/ferocefashion_ff"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 rounded-full bg-white border border-[#EAE6DF] text-navy/70 hover:text-gold hover:border-gold/40 flex items-center justify-center transition-all shadow-2xs group"
            >
              <svg className="w-4 h-4 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a
              href="https://www.tiktok.com/@ferocefashion_ff"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="w-9 h-9 rounded-full bg-white border border-[#EAE6DF] text-navy/70 hover:text-gold hover:border-gold/40 flex items-center justify-center transition-all shadow-2xs group"
            >
              <svg className="w-4 h-4 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48V13.2a8.19 8.19 0 005.58 2.17V12a4.85 4.85 0 01-5.58-2.71V6.69h5.58z" />
              </svg>
            </a>
          </div>

          {/* Payment Badges (Frosted Luxury Pills) */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center text-[10px]">
            <span className="rounded-full bg-white border border-[#EAE6DF] px-2.5 py-0.5 text-navy/70 font-semibold tracking-wider shadow-2xs">
              VISA
            </span>
            <span className="rounded-full bg-white border border-[#EAE6DF] px-2.5 py-0.5 text-navy/70 font-semibold tracking-wider shadow-2xs">
              Mastercard
            </span>
            <span className="rounded-full bg-white border border-[#EAE6DF] px-2.5 py-0.5 text-navy/70 font-semibold tracking-wider shadow-2xs">
              AMEX
            </span>
            <span className="rounded-full bg-white border border-[#EAE6DF] px-2.5 py-0.5 text-navy/70 font-semibold tracking-wider shadow-2xs">
              Apple Pay
            </span>
            <span className="rounded-full bg-white border border-[#EAE6DF] px-2.5 py-0.5 text-navy/70 font-semibold tracking-wider shadow-2xs">
              Klarna
            </span>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center text-[11px] text-navy/50 font-sans tracking-wide">
          © {new Date().getFullYear()} FÉROCE Fashion LLC. All rights reserved. Handcrafted luxury designed in Dallas, Texas.
        </div>
      </div>
    </footer>
  )
}
