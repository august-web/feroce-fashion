'use client'

import { useState } from 'react'
import type { Category } from '@/lib/types'
import { FilterSidebar } from './FilterSidebar'

interface ShopFiltersProps {
  categories: Category[]
}

/**
 * Mobile-only filter entry point: toggle button + slide-in drawer.
 */
export function ShopFilters({ categories }: ShopFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="flex items-center gap-2 text-[11px] font-sans uppercase tracking-[0.15em] text-navy/70 hover:text-navy transition-colors min-h-[44px] px-3 py-2 border border-line bg-white shadow-sm lg:hidden"
      >
        <svg className="w-4 h-4 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="20" y2="12" /><line x1="12" y1="18" x2="20" y2="18" />
        </svg>
        <span>Filters</span>
      </button>

      <FilterSidebar
        categories={categories}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        isMobileDrawer={true}
      />
    </>
  )
}

/** Desktop-only filter sidebar (rendered only on lg+ viewports). */
export function DesktopFilterSidebar({ categories }: { categories: Category[] }) {
  return (
    <aside className="hidden lg:block w-56 flex-shrink-0">
      <FilterSidebar
        categories={categories}
        open={false}
        onClose={() => {}}
        isMobileDrawer={false}
      />
    </aside>
  )
}
