import { Suspense } from 'react'
import type { Metadata } from 'next'
import { fetchCategories, fetchProducts, sortProducts, type SortOption } from '@/lib/shop-data'
import { ShopHeader } from '@/components/shop/ShopHeader'
import { ShopFilters } from '@/components/shop/ShopFilters'
import { SortSelect } from '@/components/shop/SortSelect'
import { EmptyState } from '@/components/shop/EmptyState'
import { ProductCard } from '@/components/home/ProductCard'
import { ScrollReveal } from '@/components/ScrollReveal'
import { CollectionPageJsonLd } from '@/components/seo/JsonLd'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Shop All — FÉROCE',
  description: 'Browse the full Féroce collection. Handcrafted luxury bags and accessories.',
}

interface ShopPageProps {
  searchParams: Promise<{ sort?: string; category?: string; price_min?: string; price_max?: string }>
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams
  const sort = (params.sort as SortOption) || 'newest'
  const categories = params.category?.split(',').filter(Boolean) || []
  // Prices are stored in dollars — filter values map 1:1
  const priceMin = params.price_min ? parseInt(params.price_min) : undefined
  const priceMax = params.price_max ? parseInt(params.price_max) : undefined

  const [allCategories, allProducts] = await Promise.all([
    fetchCategories(),
    fetchProducts(),
  ])

  // Apply filters
  let filtered = allProducts
  if (categories.length > 0) {
    filtered = filtered.filter((p) => categories.includes(allCategories.find((c) => c.id === p.category_id)?.slug || ''))
  }
  if (priceMin !== undefined) {
    filtered = filtered.filter((p) => p.price >= priceMin)
  }
  if (priceMax !== undefined) {
    filtered = filtered.filter((p) => p.price <= priceMax)
  }

  const products = sortProducts(filtered, sort)

  return (
    <>
    <CollectionPageJsonLd
      name="Shop All — FÉROCE Luxury Handbags"
      description="Browse the full FÉROCE collection of luxury handbags for women and men."
      url="https://www.ferocefashionff.com/shop"
      numberOfItems={products.length}
    />
    <section className="bg-cream min-h-[60svh]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-10 sm:py-14 md:py-20">
        <ShopHeader title="Shop All" count={products.length} />

        {/* Mobile filter toggle + sort */}
        <div className="flex items-center justify-between gap-4 mb-6 lg:mb-8">
          <Suspense fallback={null}>
            <ShopFilters categories={allCategories} />
          </Suspense>
          <div className="flex-1 flex justify-end">
            <Suspense fallback={null}>
              <SortSelect currentSort={sort} />
            </Suspense>
          </div>
        </div>

        {/* Sidebar + Grid */}
        <div className="flex gap-8">
          <Suspense fallback={null}>
            <ShopFilters categories={allCategories} />
          </Suspense>

          <div className="flex-1 min-w-0">
            {products.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 sm:gap-y-10 lg:gap-x-6 lg:gap-y-14 lg:grid-cols-3">
                {products.map((product, i) => (
                  <ScrollReveal key={product.id} delay={Math.min(i * 60, 300)}>
                    <ProductCard product={product} />
                  </ScrollReveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
    </>
  )
}
