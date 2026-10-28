'use client'

import Link from 'next/link'
import { Sparkles, ArrowUpRight } from 'lucide-react'

export function MemberBanner() {
  return (
    <section className="bg-white py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="relative rounded-[32px] sm:rounded-[44px] overflow-hidden bg-navy text-white py-16 sm:py-24 px-6 sm:px-12 text-center shadow-xl">
          {/* Subtle Atelier Photography Backdrop */}
          <div className="absolute inset-0 pointer-events-none">
            <img
              src="/images/products/Denim De Ville Collection/Cream & Gold/Preview 3.jpg"
              alt="Féroce Inner Circle"
              className="h-full w-full object-cover object-center filter brightness-[0.28]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/85 to-navy/70" />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 border border-white/20 rounded-full text-[10px] font-sans font-semibold uppercase tracking-wider text-gold">
              <Sparkles size={13} />
              <span>Private Client Allocations</span>
            </div>

            <h2 className="font-sans text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.1]">
              Become Part of the Féroce Circle.
            </h2>

            <p className="font-sans text-xs sm:text-sm text-white/75 leading-relaxed max-w-lg mx-auto font-normal">
              Receive priority allocations on upcoming artisan handbag drops, private invitations to Dallas studio releases, and bespoke styling concierges.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gold hover:bg-white text-navy font-sans font-semibold text-xs uppercase px-8 py-4 rounded-full tracking-wider transition-all duration-300 shadow-md"
              >
                <span>Join The Circle</span>
                <ArrowUpRight size={16} />
              </Link>
              <Link
                href="/about"
                className="w-full sm:w-auto inline-flex items-center justify-center text-xs font-sans font-semibold text-white/80 hover:text-white py-3.5 px-6 rounded-full border border-white/25 hover:bg-white/10 transition-colors"
              >
                The Atelier Story →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
