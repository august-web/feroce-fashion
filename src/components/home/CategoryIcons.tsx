'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import type { Category } from '@/lib/types'
import { ScrollReveal } from '@/components/ScrollReveal'

/** Handbag silhouette line icons — one per bag style */
const CATEGORY_SVGS: Record<string, ReactNode> = {
  tote: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-12 h-12">
      {/* Tote bag — wide open top, two handles */}
      <path d="M14 22h36l-3 32H17L14 22z" />
      <path d="M22 22V14c0-4 4-8 10-8s10 4 10 8v8" />
      <line x1="26" y1="34" x2="38" y2="34" strokeWidth="0.8" />
    </svg>
  ),
  crossbody: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-12 h-12">
      {/* Crossbody — compact bag with long diagonal strap */}
      <rect x="20" y="28" width="24" height="20" rx="3" />
      <path d="M24 28c0-6 3.5-10 8-10s8 4 8 10" />
      <line x1="32" y1="18" x2="18" y2="6" strokeWidth="1" />
      <circle cx="32" cy="38" r="2" fill="currentColor" />
    </svg>
  ),
  quilted: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-12 h-12">
      {/* Quilted mini — diamond pattern on bag body */}
      <path d="M18 26h28v18a4 4 0 01-4 4H22a4 4 0 01-4-4V26z" />
      <path d="M24 26V18a8 8 0 0116 0v8" />
      {/* Diamond quilting lines */}
      <path d="M22 30l5 6-5 6" strokeWidth="0.7" />
      <path d="M32 30l5 6-5 6" strokeWidth="0.7" />
      <path d="M42 30l-5 6 5 6" strokeWidth="0.7" />
      <circle cx="32" cy="38" r="1.5" fill="currentColor" />
    </svg>
  ),
  structured: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-12 h-12">
      {/* Structured satchel — rigid shape, top handle, flap */}
      <rect x="16" y="26" width="32" height="24" rx="2" />
      <path d="M24 26V18c0-2 2-4 4-4h8c2 0 4 2 4 4v8" />
      <path d="M16 34h32" strokeWidth="0.8" />
      <rect x="28" y="31" width="8" height="6" rx="1" strokeWidth="0.8" />
    </svg>
  ),
}

/** Product photography for each category — shown inside the circle */
const CATEGORY_IMAGES: Record<string, string> = {
  tote: '/images/products/denim-satchel/product-1.jpg',
  crossbody: '/images/products/quilted-blue/product-1.jpg',
  quilted: '/images/products/quilted-cream/product-1.jpg',
  structured: '/images/products/navy-structured/product-1.jpg',
}

interface CategoryIconsProps {
  categories: Category[]
  productCounts: Record<string, number>
}

export function CategoryIcons({ categories, productCounts }: CategoryIconsProps) {
  return (
    <section className="bg-cream py-14 sm:py-20 md:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <ScrollReveal>
          <p className="label mb-4 text-center">Shop by Category</p>
          <h2 className="font-serif text-2xl font-semibold text-center text-navy mb-14 md:text-3xl">
            Find Your Silhouette
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4 md:gap-8">
          {categories.map((cat, i) => {
            const count = productCounts[cat.slug] || 0
            const img = CATEGORY_IMAGES[cat.slug]
            return (
              <ScrollReveal key={cat.id} delay={i * 100}>
                <Link
                  href={`/shop/${cat.slug}`}
                  className="group flex flex-col items-center gap-5"
                >
                  {/* Circle with product photography inside */}
                  <div className="relative flex h-24 w-24 sm:h-32 sm:w-32 items-center justify-center rounded-full border border-line bg-white overflow-hidden transition-all duration-500 group-hover:border-gold group-hover:shadow-[0_8px_30px_rgba(212,175,55,0.15)] group-hover:scale-105 md:h-36 md:w-36">
                    {img ? (
                      <img
                        src={img}
                        alt={`${cat.name} bags`}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-navy/30">
                        {CATEGORY_SVGS[cat.slug] || <span className="text-3xl">✦</span>}
                      </span>
                    )}
                    {/* Hover ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-transparent transition-all duration-500 group-hover:border-gold/30 group-hover:scale-110" />
                  </div>
                  <div className="text-center">
                    <p className="font-serif text-sm font-medium text-navy transition-colors group-hover:text-gold">
                      {cat.name}
                    </p>
                    {/* Only show item count if 5+ products */}
                    {count >= 5 && (
                      <p className="mt-1 text-[10px] uppercase tracking-luxury text-navy/40">
                        {count} items
                      </p>
                    )}
                  </div>
                </Link>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
