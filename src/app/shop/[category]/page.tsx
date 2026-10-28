import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import { fetchCategories, fetchProducts, sortProducts, type SortOption } from '@/lib/shop-data'
import { ShopHeader } from '@/components/shop/ShopHeader'
import { FilterPills } from '@/components/shop/FilterPills'
import { SortSelect } from '@/components/shop/SortSelect'
import { EmptyState } from '@/components/shop/EmptyState'
import { ProductCard } from '@/components/home/ProductCard'
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
  if (!cat) notFound()
  return {
    title: `${cat.name} — FÉROCE Fashion`,
    description: `Discover the handcrafted FÉROCE ${cat.name} luxury collection designed in Dallas, Texas.`,
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

      <div className="bg-white min-h-screen text-navy antialiased">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 py-8 sm:py-12">
          {/* 1. Category Header */}
          <ShopHeader
            title={activeCat.name}
            intro={`Discover our ${activeCat.name.toLowerCase()} collection — original silhouettes crafted from rich textures, rare furs, and custom Dallas hardware.`}
            count={sorted.length}
            badge={`Collection · ${activeCat.name}`}
          />

          {/* 2. Top Filter Bar & Quick Pills */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100">
            {/* Quick Category Pills */}
            <Suspense fallback={null}>
              <FilterPills categories={categories} activeSlug={category} />
            </Suspense>

            {/* Sort Select */}
            <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0">
              <Suspense fallback={null}>
                <SortSelect currentSort={sort} />
              </Suspense>
            </div>
          </div>

          {/* 3. Product Grid */}
          <div className="min-w-0">
            {sorted.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8 md:grid-cols-3 lg:grid-cols-4">
                {sorted.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>

          {/* 4. Atelier Pre-Order Banner */}
          <div className="mt-16 sm:mt-24 rounded-[32px] sm:rounded-[44px] bg-[#0A1128] text-white p-8 sm:p-14 lg:p-16 text-center relative overflow-hidden shadow-xl">
            {/* Subtle Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <img
                src="/images/feroce-emblem.png"
                alt=""
                className="w-96 h-96 object-contain"
                aria-hidden="true"
              />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-[11px] font-semibold tracking-wider uppercase text-gold">
                <Sparkles className="w-3.5 h-3.5" />
                Dallas Atelier Allocation
              </div>
              <h2 className="text-2xl sm:text-4xl font-sans font-bold tracking-tight">
                Looking for Bespoke or Sold-Out Silhouettes?
              </h2>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-normal">
                Join our private collector circle to receive allocation alerts before public drops and request custom atelier bespoke commissions.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="bg-gold hover:bg-[#e0bc43] text-navy text-xs font-bold px-7 py-3.5 rounded-full transition-all duration-300 tracking-wider uppercase shadow-md inline-flex items-center gap-2"
                >
                  Join Collector Circle
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/contact"
                  className="backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold px-7 py-3.5 rounded-full transition-all duration-300 tracking-wider uppercase inline-flex items-center gap-2"
                >
                  Contact Atelier
                  <ArrowUpRight className="w-3.5 h-3.5 text-white/70" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
