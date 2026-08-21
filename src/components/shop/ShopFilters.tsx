'use client'

import { useState } from 'react'
import type { Category } from '@/lib/types'
import { FilterSidebar } from './FilterSidebar'

interface ShopFiltersProps {
  categories: Category[]
}

export function ShopFilters({ categories }: ShopFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile filter toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="flex items-center gap-2 text-[11px] font-sans uppercase tracking-[0.15em] text-navy/60 hover:text-navy transition-colors min-h-[44px] lg:hidden"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="20" y2="12" /><line x1="12" y1="18" x2="20" y2="18" />
        </svg>
        Filters
      </button>

      {/* Desktop sidebar */}
      <FilterSidebar categories={categories} open={false} onClose={() => {}} />

      {/* Mobile drawer */}
      <FilterSidebar categories={categories} open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
