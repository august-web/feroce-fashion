'use client'

import Link from 'next/link'
import type { Category } from '@/lib/types'

interface FilterPillsProps {
  categories: Category[]
  activeSlug: string | null
}

export function FilterPills({ categories, activeSlug }: FilterPillsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 sm:pb-0">
      {/* All pill */}
      <Link
        href="/shop"
        className={`flex-shrink-0 px-4 py-2.5 text-[10px] sm:text-[11px] font-sans uppercase tracking-luxury border transition-all duration-300 min-h-[40px] flex items-center ${
          !activeSlug
            ? 'bg-navy text-white border-navy'
            : 'bg-white text-navy border-line hover:border-navy/30'
        }`}
      >
        All
      </Link>

      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/shop/${cat.slug}`}
          className={`flex-shrink-0 px-4 py-2.5 text-[10px] sm:text-[11px] font-sans uppercase tracking-luxury border transition-all duration-300 min-h-[40px] flex items-center ${
            activeSlug === cat.slug
              ? 'bg-navy text-white border-navy'
              : 'bg-white text-navy border-line hover:border-navy/30'
          }`}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  )
}
