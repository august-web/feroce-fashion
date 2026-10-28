'use client'

import Link from 'next/link'
import type { Category } from '@/lib/types'

interface FilterPillsProps {
  categories: Category[]
  activeSlug: string | null
}

export function FilterPills({ categories, activeSlug }: FilterPillsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
      {/* All pill */}
      <Link
        href="/shop"
        className={`flex-shrink-0 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
          !activeSlug
            ? 'bg-[#4A4D52] hover:bg-navy text-white shadow-sm'
            : 'bg-[#F6F6F8] hover:bg-gray-200/80 text-navy/70 border border-gray-200/60'
        }`}
      >
        All Pieces
      </Link>

      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/shop/${cat.slug}`}
          className={`flex-shrink-0 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
            activeSlug === cat.slug
              ? 'bg-[#4A4D52] hover:bg-navy text-white shadow-sm'
              : 'bg-[#F6F6F8] hover:bg-gray-200/80 text-navy/70 border border-gray-200/60'
          }`}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  )
}
