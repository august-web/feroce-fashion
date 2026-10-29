'use client'

import Link from 'next/link'
import { Sparkles, ArrowUpRight } from 'lucide-react'

export function AnnouncementBar() {
  return (
    <div className="bg-[#0A1128] text-white border-b border-white/10 relative z-50 overflow-hidden py-2 sm:py-2.5 px-3 sm:px-6 w-full font-sans">
      <div className="mx-auto max-w-7xl flex items-center justify-between gap-4">
        {/* ── Left: Location & Studio Pill ── */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-white/10 backdrop-blur-md border border-white/15 text-[10px] font-semibold tracking-wider uppercase text-white/80 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            <span>FÉROCE Fashion · Dallas, TX</span>
          </div>
        </div>

        {/* ── Center: Announcement Capsule ── */}
        <div className="flex-1 flex items-center justify-center min-w-0">
          <div className="inline-flex items-center gap-2 sm:gap-2.5 rounded-full px-3.5 sm:px-4 py-1 sm:py-1.5 bg-white/10 backdrop-blur-md border border-white/15 text-[10px] tracking-wider uppercase max-w-full shadow-2xs">
            <span className="text-[8px] sm:text-[9px] font-bold px-2 py-0.5 bg-gold text-navy rounded-full shadow-2xs shrink-0 tracking-widest">
              PRE-ORDER OPEN
            </span>
            <span className="text-white/90 truncate font-medium text-[9px] sm:text-[10px] tracking-wider">
              Complimentary US Express Shipping over $200
            </span>
            <Link
              href="/shop"
              className="inline-flex items-center gap-0.5 text-gold hover:text-white font-bold transition-colors pl-1 shrink-0 text-[9px] sm:text-[10px] group"
            >
              <span className="underline decoration-gold/60 underline-offset-2 group-hover:decoration-white">
                Shop Drop
              </span>
              <ArrowUpRight size={11} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* ── Right: Klarna & Concierge Pill ── */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-white/10 backdrop-blur-md border border-white/15 text-[10px] font-semibold tracking-wider uppercase text-white/80 shadow-2xs">
            <Sparkles size={10} className="text-gold" />
            <span>Pay in 4 with Klarna</span>
          </div>
        </div>
      </div>
    </div>
  )
}
