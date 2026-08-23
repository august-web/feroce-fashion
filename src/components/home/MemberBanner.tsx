'use client'

import Link from 'next/link'
import { ScrollReveal } from '@/components/ScrollReveal'

export function MemberBanner() {
  return (
    <section className="relative overflow-hidden py-11 sm:py-16 md:py-18">
      {/* Background photo with dark overlay */}
      <div className="absolute inset-0">
        <img
          src="/images/products/Denim De Ville Collection/Cream & Gold/Preview 3.jpg"
          alt=""
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-navy/80" />
      </div>

      {/* Subtle gold dot texture */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: 'radial-gradient(circle, #D4AF37 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }} />

      {/* Gold accent lines */}
      <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-transparent via-gold/20 to-transparent" />
      <div className="absolute top-0 right-0 h-full w-px bg-gradient-to-b from-transparent via-gold/20 to-transparent" />

      <div className="relative z-10 mx-auto max-w-3xl px-5 sm:px-6 text-center">
        <ScrollReveal>
          <p className="mb-4 text-[10px] uppercase font-sans tracking-[0.3em] text-gold">
            Join the Inner Circle
          </p>
          <h2 className="font-serif text-xl sm:text-2xl font-semibold text-white md:text-4xl">
            Become Part of the{' '}
            <span className="italic">Féroce</span>{' '}
            Circle
          </h2>
          <p className="mt-5 max-w-lg mx-auto text-sm leading-relaxed text-[#c9c9c9]">
            Early access to new collections, exclusive offers, and insider content.
            The attitude is Féroce — now make it yours.
          </p>
          <Link
            href="/register"
            className="mt-8 sm:mt-9 inline-flex items-center gap-2 bg-white text-navy uppercase font-sans font-medium text-[11px] px-8 sm:px-10 py-3.5 sm:py-4 min-h-[48px] rounded-lg transition-all duration-150 hover:bg-gold hover:text-navy hover:scale-[1.03] hover:shadow-[0_4px_20px_rgba(212,175,55,0.3)] active:scale-[0.98]"
            style={{ letterSpacing: '0.2em' }}
          >
            Become a Member
            <svg className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  )
}
