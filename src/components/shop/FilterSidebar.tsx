'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { Category } from '@/lib/types'

interface FilterSidebarProps {
  categories: Category[]
  open: boolean
  onClose: () => void
  minPrice?: number
  maxPrice?: number
}

export function FilterSidebar({ categories, open, onClose, minPrice = 0, maxPrice = 1000 }: FilterSidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedCats, setSelectedCats] = useState<string[]>(
    searchParams.get('category')?.split(',').filter(Boolean) || []
  )
  const [priceMin, setPriceMin] = useState(searchParams.get('price_min') || '')
  const [priceMax, setPriceMax] = useState(searchParams.get('price_max') || '')

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

  function applyFilters() {
    const params = new URLSearchParams(searchParams.toString())
    if (selectedCats.length > 0) {
      params.set('category', selectedCats.join(','))
    } else {
      params.delete('category')
    }
    if (priceMin) params.set('price_min', priceMin)
    else params.delete('price_min')
    if (priceMax) params.set('price_max', priceMax)
    else params.delete('price_max')
    params.delete('page')
    router.push('/shop?' + params.toString())
    onClose()
  }

  function clearAll() {
    setSelectedCats([])
    setPriceMin('')
    setPriceMax('')
    const params = new URLSearchParams()
    const sort = searchParams.get('sort')
    if (sort) params.set('sort', sort)
    router.push('/shop?' + params.toString())
    onClose()
  }

  function toggleCategory(slug: string) {
    setSelectedCats((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    )
  }

  const hasActiveFilters = selectedCats.length > 0 || priceMin || priceMax

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-sans uppercase tracking-[0.15em] text-navy font-semibold">Filters</h3>
        {hasActiveFilters && (
          <button onClick={clearAll} className="text-[10px] uppercase tracking-luxury text-navy/40 hover:text-navy transition-colors">
            Clear all
          </button>
        )}
      </div>

      {/* Categories */}
      <div>
        <p className="text-[10px] font-sans uppercase tracking-[0.1em] text-navy/50 mb-3">Category</p>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer min-h-[36px]">
              <input
                type="checkbox"
                checked={selectedCats.includes(cat.slug)}
                onChange={() => toggleCategory(cat.slug)}
                className="h-4 w-4 accent-navy border-line"
              />
              <span className="text-xs text-navy/70">{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <p className="text-[10px] font-sans uppercase tracking-[0.1em] text-navy/50 mb-3">Price Range</p>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <input
              type="number"
              placeholder="Min"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              min="0"
              className="w-full border border-line bg-white px-3 py-2 text-[16px] text-navy placeholder:text-navy/30 focus:outline-none focus:border-navy/30 min-h-[48px]"
            />
          </div>
          <span className="text-navy/30 text-xs">—</span>
          <div className="flex-1">
            <input
              type="number"
              placeholder="Max"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              min="0"
              className="w-full border border-line bg-white px-3 py-2 text-[16px] text-navy placeholder:text-navy/30 focus:outline-none focus:border-navy/30 min-h-[48px]"
            />
          </div>
        </div>
      </div>

      {/* Apply */}
      <button
        onClick={applyFilters}
        className="w-full btn-primary py-3 text-[11px] min-h-[48px]"
      >
        APPLY FILTERS
      </button>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar — always visible on lg+ */}
      <div className="hidden lg:block w-56 flex-shrink-0">
        {content}
      </div>

      {/* Mobile/tablet drawer */}
      <div
        className={`fixed inset-0 z-[70] bg-navy/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 left-0 z-[80] h-full w-80 max-w-[85vw] bg-white shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h3 className="text-[11px] font-sans uppercase tracking-[0.15em] text-navy font-semibold">Filters</h3>
          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center text-navy/50 hover:text-navy transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-5 py-6 overflow-y-auto h-[calc(100%-60px)]">
          {content}
        </div>
      </div>
    </>
  )
}
