'use client'

import { Sparkles, SlidersHorizontal } from 'lucide-react'

interface ShopHeaderProps {
  title: string
  intro?: string
  count: number
  badge?: string
}

export function ShopHeader({ title, intro, count, badge }: ShopHeaderProps) {
  return (
    <div className="pb-8 sm:pb-12 mb-8 sm:mb-10 border-b border-gray-100">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="max-w-3xl">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F6F6F8] border border-gray-200/60 text-[11px] font-semibold tracking-wider uppercase text-navy/70 mb-4 sm:mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
            {badge || 'Curated Atelier Archive · Dallas, TX'}
          </div>

          {/* Large display heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-sans font-bold text-navy tracking-[-0.035em] leading-[1.05]">
            {title}
          </h1>

          {intro && (
            <p className="mt-4 text-sm sm:text-base text-navy/60 max-w-2xl leading-relaxed font-normal">
              {intro}
            </p>
          )}
        </div>

        {/* Right side stats pill & meta */}
        <div className="flex items-center lg:flex-col lg:items-end justify-between gap-3 pt-2 lg:pt-0">
          <div className="backdrop-blur-md bg-[#F6F6F8] border border-gray-200/80 rounded-full px-5 py-2.5 shadow-sm inline-flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-xs font-bold text-navy tracking-tight">
              {count} {count === 1 ? 'Masterpiece' : 'Masterpieces'}
            </span>
          </div>
          <p className="text-[11px] text-navy/40 uppercase tracking-widest hidden lg:block">
            Handcrafted Luxury Forms
          </p>
        </div>
      </div>
    </div>
  )
}
