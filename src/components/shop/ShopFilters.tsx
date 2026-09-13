'use client'

import { useState } from 'react'
import type { Category } from '@/lib/types'
import { FilterSidebar } from './FilterSidebar'

interface ShopFiltersProps {
  categories: Category[]
}

/**
 * Mobile-only filter entry point: toggle button + slide-in drawer.
 * The desktop sidebar lives in <DesktopFilterSidebar /> so each is
 * rendered exactly once (a previous double-render put a stray toggle
 * button beside the product grid on mobile).
 */
export function ShopFilters({ categories }: ShopFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="flex items-center gap-2 text-[11px] font-sans uppercase tracking-[0.15em] text-navy/60 hover:text-navy transition-colors min-h-[44px] lg:hidden"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="20" y2="12" /><line x1="12" y1="18" x2="20" y2="18" />
        </svg>
        Filters
      </button>

      <FilterSidebar categories={categories} open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}

/** Desktop-only filter sidebar (renders nothing below lg). */
export function DesktopFilterSidebar({ categories }: { categories: Category[] }) {
  return <FilterSidebar categories={categories} open={false} onClose={() => {}} />
}
