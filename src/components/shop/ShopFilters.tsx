'use client'

import { useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
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
        className="flex items-center gap-2 rounded-full px-5 py-2.5 sm:py-3 text-xs font-semibold text-navy bg-white border border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-sm lg:hidden"
      >
        <SlidersHorizontal className="w-3.5 h-3.5 text-gold" />
        <span>Filter Archive</span>
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
    <aside className="hidden lg:block w-64 flex-shrink-0">
      <FilterSidebar
        categories={categories}
        open={false}
        onClose={() => {}}
        isMobileDrawer={false}
      />
    </aside>
  )
}
