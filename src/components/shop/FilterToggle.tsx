'use client'

import { useState } from 'react'
import { FilterSidebar } from './FilterSidebar'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function FilterToggleInner() {
  const [open, setOpen] = useState(false)
  const searchParams = useSearchParams()
  const hasFilters = !!(searchParams.get('category') || searchParams.get('price_min') || searchParams.get('price_max'))

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-[11px] font-sans uppercase tracking-[0.15em] text-navy/60 hover:text-navy transition-colors min-h-[44px] lg:hidden"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="20" y2="12" /><line x1="12" y1="18" x2="20" y2="18" />
          <circle cx="6" cy="6" r="2" fill="currentColor" /><circle cx="10" cy="12" r="2" fill="currentColor" /><circle cx="14" cy="18" r="2" fill="currentColor" />
        </svg>
        Filters
        {hasFilters && <span className="h-2 w-2 rounded-full bg-gold" />}
      </button>
      <Suspense fallback={null}>
        <FilterSidebar categories={[]} open={open} onClose={() => setOpen(false)} />
      </Suspense>
    </>
  )
}

export function FilterToggle() {
  return <FilterToggleInner />
}
