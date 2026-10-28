'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Product } from '@/lib/types'
import { ProductCard } from './ProductCard'
import { ArrowUpRight } from 'lucide-react'

interface EditSectionProps {
  products: Product[]
}

const CATEGORIES = [
  { label: 'All Pieces', key: 'all' },
  { label: "Women's Collection", key: 'womens' },
  { label: "Men's Edit", key: 'mens' },
]

export function EditSection({ products }: EditSectionProps) {
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredProducts = products.filter((p) => {
    if (activeCategory === 'all') return true
    if (activeCategory === 'womens') {
      return (
        p.collection?.toLowerCase().includes('naji') ||
        p.collection?.toLowerCase().includes('denim') ||
        p.name.toLowerCase().includes('naji') ||
        p.name.toLowerCase().includes('denim')
      )
    }
    if (activeCategory === 'mens') {
      return (
        p.collection?.toLowerCase().includes('fanny') ||
        p.collection?.toLowerCase().includes('satchel') ||
        p.name.toLowerCase().includes('fanny') ||
        p.name.toLowerCase().includes('satchel')
      )
    }
    return true
  })

  return (
    <section className="bg-white py-16 sm:py-24 border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-6">
          <div>
            <span className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-gold block mb-2">
              Signature Releases
            </span>
            <h2 className="font-sans text-3xl sm:text-5xl font-bold tracking-tight text-navy leading-[1.1]">
              The Féroce Edit
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={`px-5 py-2.5 rounded-full text-xs font-sans font-semibold transition-all duration-300 ${
                  activeCategory === cat.key
                    ? 'bg-navy text-white shadow-xs'
                    : 'bg-[#F2F2F4] text-navy/70 hover:bg-gray-200 hover:text-navy'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Shelf Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Bottom Capsule Button */}
        <div className="mt-14 sm:mt-16 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-[#4A4D52] hover:bg-navy text-white px-8 py-4 rounded-full text-xs sm:text-sm font-sans font-semibold uppercase tracking-wider transition-all duration-300 shadow-sm"
          >
            <span>Explore Entire Catalog ({products.length} Pieces)</span>
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}
