'use client'

import Link from 'next/link'

export function AnnouncementBar() {
  return (
    <div className="bg-navy text-white border-b border-navy/40 relative z-50 overflow-hidden py-2 px-3 sm:px-4 w-full">
      <div className="mx-auto max-w-7xl flex items-center justify-center sm:justify-between w-full overflow-hidden">
        <div className="hidden md:flex items-center gap-2 text-white/60 shrink-0 text-[10px] uppercase font-sans tracking-[0.2em]">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          <span>FÉROCE Fashion · Dallas</span>
        </div>

        <div className="text-center truncate max-w-full px-2">
          <p className="truncate text-[9px] sm:text-[10px] uppercase font-sans tracking-[0.14em] sm:tracking-[0.2em] font-medium">
            <span className="text-gold font-bold">LIMITED PRE-ORDER BATCH OPEN</span>
            <span className="hidden sm:inline text-white/40 mx-2">•</span>
            <span className="hidden sm:inline text-white/90">Free US Express Shipping over $200</span>
            <Link
              href="/shop"
              className="hidden lg:inline underline underline-offset-2 decoration-gold text-gold hover:text-white transition-colors ml-2"
            >
              Shop The Drop →
            </Link>
          </p>
        </div>

        <div className="hidden md:flex items-center gap-3 text-white/60 shrink-0 text-[10px] uppercase font-sans tracking-[0.2em]">
          <span>Pay in 4 with Klarna</span>
        </div>
      </div>
    </div>
  )
}
