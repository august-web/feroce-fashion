'use client'

import Link from 'next/link'
import type { Product } from '@/lib/types'
import { ProductCard } from './ProductCard'
import { ScrollReveal } from '@/components/ScrollReveal'

interface EditSectionProps {
  products: Product[]
}

export function EditSection({ products }: EditSectionProps) {
  return (
    <section className="bg-white py-14 sm:py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Section header */}
        <ScrollReveal>
          <div className="mb-10 sm:mb-14 text-center">
            <p className="label mb-3">Curated for You</p>
            <h2 className="font-serif text-2xl font-semibold text-navy md:text-3xl">
              The Féroce Edit
            </h2>
            <div className="mx-auto mt-4 h-px w-16 bg-gold/40" />
          </div>
        </ScrollReveal>

        {/* Product grid */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 sm:gap-y-12 md:grid-cols-4 md:gap-x-6">
          {products.map((product, i) => (
            <ScrollReveal key={product.id} delay={i * 100}>
              <ProductCard product={product} />
            </ScrollReveal>
          ))}
        </div>

        {/* View all */}
        <ScrollReveal>
          <div className="mt-14 text-center">
            <Link href="/shop" className="btn-primary inline-block min-h-[48px]">
              View All Products
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
