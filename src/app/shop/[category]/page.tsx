import { Suspense } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { fetchCategories, fetchProducts, sortProducts, type SortOption } from '@/lib/shop-data'
import { ShopHeader } from '@/components/shop/ShopHeader'
import { FilterPills } from '@/components/shop/FilterPills'
import { SortSelect } from '@/components/shop/SortSelect'
import { EmptyState } from '@/components/shop/EmptyState'
import { ProductCard } from '@/components/home/ProductCard'
import { ScrollReveal } from '@/components/ScrollReveal'
import { CollectionPageJsonLd } from '@/components/seo/JsonLd'

export const dynamic = 'force-dynamic'


interface CategoryPageProps {
  params: Promise<{ category: string }>
  searchParams: Promise<{ sort?: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params
  const categories = await fetchCategories()
  const cat = categories.find((c) => c.slug === category)
  return {
    title: cat ? `${cat.name} — FÉROCE` : 'Shop — FÉROCE',
    description: `Browse the Féroce ${cat?.name ?? ''} collection.`,
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category } = await params
  const searchParamsResolved = await searchParams
  const sort = (searchParamsResolved.sort as SortOption) || 'newest'

  const [categories, products] = await Promise.all([
    fetchCategories(),
    fetchProducts(category),
  ])

  const activeCat = categories.find((c) => c.slug === category)
  if (!activeCat) notFound()

  const sorted = sortProducts(products, sort)

  return (
    <>
    <CollectionPageJsonLd
      name={`${activeCat.name} — FÉROCE Luxury Handbags`}
      description={`Browse our ${activeCat.name.toLowerCase()} collection of luxury handbags.`}
      url={`https://www.ferocefashionff.com/shop/${category}`}
      numberOfItems={sorted.length}
    />
    <section className="bg-cream min-h-[60svh]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-10 sm:py-14 md:py-20">
        {/* Header */}
        <ShopHeader
          title={activeCat.name}
          intro={`Discover our ${activeCat.name.toLowerCase()} collection — handpicked, handcrafted, made to be seen.`}
          count={sorted.length}
        />

        {/* Filters + Sort bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <Suspense fallback={null}>
            <FilterPills categories={categories} activeSlug={category} />
          </Suspense>

          <Suspense fallback={null}>
            <SortSelect currentSort={sort} />
          </Suspense>
        </div>

        {/* Product grid or empty state */}
        {sorted.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 sm:gap-y-10 md:gap-x-6 md:gap-y-14 md:grid-cols-4">
            {sorted.map((product, i) => (
              <ScrollReveal key={product.id} delay={Math.min(i * 60, 300)}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
    </>
  )
}
