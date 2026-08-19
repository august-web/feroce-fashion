import { Suspense } from 'react'
import type { Metadata } from 'next'
import { fetchCategories, fetchProducts, sortProducts, type SortOption } from '@/lib/shop-data'
import { ShopHeader } from '@/components/shop/ShopHeader'
import { FilterPills } from '@/components/shop/FilterPills'
import { SortSelect } from '@/components/shop/SortSelect'
import { EmptyState } from '@/components/shop/EmptyState'
import { ProductCard } from '@/components/home/ProductCard'
import { ScrollReveal } from '@/components/ScrollReveal'

export const metadata: Metadata = {
  title: 'Shop All — FÉROCE',
  description: 'Browse the full Féroce collection. Handcrafted luxury bags and accessories.',
}

interface ShopPageProps {
  searchParams: Promise<{ sort?: string }>
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams
  const sort = (params.sort as SortOption) || 'newest'

  const [categories, allProducts] = await Promise.all([
    fetchCategories(),
    fetchProducts(),
  ])

  const products = sortProducts(allProducts, sort)

  return (
    <section className="bg-cream min-h-[60svh]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-10 sm:py-14 md:py-20">
        {/* Header */}
        <ShopHeader
          title="Shop All"
          count={products.length}
        />

        {/* Filters + Sort bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <Suspense fallback={null}>
            <FilterPills categories={categories} activeSlug={null} />
          </Suspense>

          <Suspense fallback={null}>
            <SortSelect currentSort={sort} />
          </Suspense>
        </div>

        {/* Product grid or empty state */}
        {products.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 sm:gap-y-10 md:gap-x-6 md:gap-y-14 md:grid-cols-4">
            {products.map((product, i) => (
              <ScrollReveal key={product.id} delay={Math.min(i * 60, 300)}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
