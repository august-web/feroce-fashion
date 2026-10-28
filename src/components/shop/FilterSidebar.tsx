'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { Category } from '@/lib/types'

interface FilterSidebarProps {
  categories: Category[]
  open: boolean
  onClose: () => void
  isMobileDrawer?: boolean
}

export function FilterContent({
  categories,
  onAfterChange,
}: {
  categories: Category[]
  onAfterChange?: () => void
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const selectedCats = searchParams.get('category')?.split(',').filter(Boolean) || []
  const priceMin = searchParams.get('price_min') || ''
  const priceMax = searchParams.get('price_max') || ''

  function updateQuery(newCats: string[], min?: string, max?: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (newCats.length > 0) {
      params.set('category', newCats.join(','))
    } else {
      params.delete('category')
    }

    if (min !== undefined) {
      if (min) params.set('price_min', min)
      else params.delete('price_min')
    }

    if (max !== undefined) {
      if (max) params.set('price_max', max)
      else params.delete('price_max')
    }

    params.delete('page')
    router.push('/shop?' + params.toString(), { scroll: false })
    if (onAfterChange) onAfterChange()
  }

  function toggleCategory(slug: string) {
    const next = selectedCats.includes(slug)
      ? selectedCats.filter((s) => s !== slug)
      : [...selectedCats, slug]
    updateQuery(next, priceMin, priceMax)
  }

  function clearAll() {
    const params = new URLSearchParams()
    const sort = searchParams.get('sort')
    if (sort) params.set('sort', sort)
    router.push('/shop?' + params.toString(), { scroll: false })
    if (onAfterChange) onAfterChange()
  }

  const hasActiveFilters = selectedCats.length > 0 || !!priceMin || !!priceMax

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-line/60">
        <h3 className="text-[11px] font-sans uppercase tracking-[0.18em] text-navy font-semibold">
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="text-[10px] uppercase tracking-luxury text-gold hover:text-navy transition-colors font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Categories (Instant reactive check) */}
      <div>
        <p className="text-[10px] font-sans uppercase tracking-[0.15em] text-navy/50 mb-3 font-semibold">
          Category
        </p>
        <div className="space-y-1">
          {categories.map((cat) => {
            const isChecked = selectedCats.includes(cat.slug)
            return (
              <label
                key={cat.id}
                className="flex items-center justify-between py-2 px-1 cursor-pointer group hover:bg-cream/50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleCategory(cat.slug)}
                    className="h-4 w-4 accent-navy rounded-none border-line cursor-pointer"
                  />
                  <span className={`text-xs transition-colors ${isChecked ? 'font-medium text-navy' : 'text-navy/70 group-hover:text-navy'}`}>
                    {cat.name}
                  </span>
                </div>
                {isChecked && <span className="text-gold text-xs">●</span>}
              </label>
            )
          })}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <p className="text-[10px] font-sans uppercase tracking-[0.15em] text-navy/50 mb-3 font-semibold">
          Price Range
        </p>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <input
              type="number"
              placeholder="Min $"
              defaultValue={priceMin}
              onBlur={(e) => updateQuery(selectedCats, e.target.value, priceMax)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  updateQuery(selectedCats, (e.target as HTMLInputElement).value, priceMax)
                }
              }}
              min="0"
              className="w-full border border-line bg-white px-3 py-2 text-xs font-sans text-navy placeholder:text-navy/30 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 min-h-[42px]"
            />
          </div>
          <span className="text-navy/30 text-xs">—</span>
          <div className="flex-1">
            <input
              type="number"
              placeholder="Max $"
              defaultValue={priceMax}
              onBlur={(e) => updateQuery(selectedCats, priceMin, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  updateQuery(selectedCats, priceMin, (e.target as HTMLInputElement).value)
                }
              }}
              min="0"
              className="w-full border border-line bg-white px-3 py-2 text-xs font-sans text-navy placeholder:text-navy/30 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 min-h-[42px]"
            />
          </div>
        </div>
        <p className="text-[9px] text-navy/40 mt-1.5">Press Enter or click away to update</p>
      </div>
    </div>
  )
}

export function FilterSidebar({
  categories,
  open,
  onClose,
  isMobileDrawer = false,
}: FilterSidebarProps) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) {
      document.addEventListener('keydown', handleKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  // Desktop sidebar rendering: only renders when not in mobile drawer mode
  if (!isMobileDrawer) {
    return (
      <div className="w-56 flex-shrink-0 bg-white p-5 border border-line shadow-sm">
        <FilterContent categories={categories} />
      </div>
    )
  }

  // Mobile/tablet drawer rendering
  return (
    <>
      <div
        className={`fixed inset-0 z-[70] bg-navy/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 left-0 z-[80] h-full w-80 max-w-[85vw] bg-white shadow-2xl transition-transform duration-300 ease-out lg:hidden flex flex-col ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h3 className="text-[11px] font-sans uppercase tracking-[0.18em] text-navy font-semibold">
            Filters
          </h3>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center text-navy/50 hover:text-navy transition-colors rounded-full hover:bg-cream"
          >
            ✕
          </button>
        </div>
        <div className="px-5 py-6 overflow-y-auto flex-1">
          <FilterContent categories={categories} onAfterChange={onClose} />
        </div>
      </div>
    </>
  )
}
