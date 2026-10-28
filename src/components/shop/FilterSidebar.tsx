'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { X, Check } from 'lucide-react'
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
      <div className="flex items-center justify-between pb-3 border-b border-gray-200/80">
        <h3 className="text-xs font-bold text-navy uppercase tracking-wider">
          Filter Archive
        </h3>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="text-[11px] font-semibold text-gold hover:text-navy uppercase tracking-wider transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Categories */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-navy/50 mb-3">
          Collections
        </p>
        <div className="space-y-1.5">
          {categories.map((cat) => {
            const isChecked = selectedCats.includes(cat.slug)
            return (
              <label
                key={cat.id}
                onClick={() => toggleCategory(cat.slug)}
                className={`flex items-center justify-between py-2 px-3 rounded-full cursor-pointer transition-all duration-200 select-none ${
                  isChecked
                    ? 'bg-navy text-white shadow-sm'
                    : 'hover:bg-white text-navy/70 hover:text-navy'
                }`}
              >
                <span className="text-xs font-semibold">
                  {cat.name}
                </span>
                {isChecked ? (
                  <Check className="w-3.5 h-3.5 text-gold" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                )}
              </label>
            )
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="pt-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-navy/50 mb-3">
          Price Range (USD)
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
              className="w-full rounded-full border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-navy placeholder:text-navy/30 focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/5"
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
              className="w-full rounded-full border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-navy placeholder:text-navy/30 focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/5"
            />
          </div>
        </div>
        <p className="text-[10px] text-navy/40 mt-2 px-1">Press Enter or click away to apply</p>
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

  // Desktop sidebar rendering: modern rounded card container
  if (!isMobileDrawer) {
    return (
      <div className="w-64 flex-shrink-0 bg-[#F6F6F8] rounded-[28px] p-6 border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
        <FilterContent categories={categories} />
      </div>
    )
  }

  // Mobile/tablet drawer rendering
  return (
    <>
      <div
        className={`fixed inset-0 z-[70] bg-navy/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 left-0 z-[80] h-full w-80 max-w-[85vw] bg-white rounded-r-[32px] shadow-2xl transition-transform duration-300 ease-out lg:hidden flex flex-col ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <h3 className="text-xs font-bold text-navy uppercase tracking-wider">
            Filter Archive
          </h3>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center text-navy/50 hover:text-navy transition-colors rounded-full hover:bg-gray-100"
            aria-label="Close filters"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-6 py-6 overflow-y-auto flex-1">
          <FilterContent categories={categories} onAfterChange={onClose} />
        </div>
      </div>
    </>
  )
}
