import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { fetchProductBySlug, fetchRelatedProducts } from '@/lib/product-data'
import { fetchProductReviews, fetchReviewSummary } from '@/lib/review-data'
import { ProductPageClient } from './ProductPageClient'
import { ProductReviews } from './ProductReviews'
import { ProductCard } from '@/components/home/ProductCard'
import { ProductJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd'

export const dynamic = 'force-dynamic'

const SITE_URL = 'https://www.ferocefashionff.com'

function truncateMeta(s: string, max = 155): string {
  if (s.length <= max) return s
  const cut = s.slice(0, max)
  return cut.slice(0, cut.lastIndexOf(' ')).trimEnd() + '…'
}

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await fetchProductBySlug(slug)
  if (!product) notFound()

  const categoryName = product.category_name || 'FÉROCE'
  const priceStr = '$' + product.price.toFixed(0)

  return {
    title: `${product.name} — ${categoryName} Handbag | FÉROCE Fashion`,
    description: truncateMeta(product.description + ` Shop now at FÉROCE. ${priceStr}.`),
    keywords: [
      product.name,
      'FÉROCE handbag',
      `${categoryName} handbag`,
      'luxury handbag',
      'designer bag',
      product.color || '',
      product.collection || '',
    ].filter(Boolean),
    openGraph: {
      title: `${product.name} — FÉROCE Fashion`,
      description: product.description,
      url: `${SITE_URL}/product/${product.slug}`,
      type: 'website',
      images: product.image_urls.slice(0, 4).map((url) => ({
        url,
        alt: product.name,
        width: 800,
        height: 1000,
      })),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} — FÉROCE Fashion`,
      description: product.description,
      images: product.image_urls.slice(0, 1),
    },
    alternates: {
      canonical: `${SITE_URL}/product/${product.slug}`,
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await fetchProductBySlug(slug)
  if (!product) notFound()

  const related = await fetchRelatedProducts(product.category_id, product.id)
  const [reviews, summary] = await Promise.all([
    fetchProductReviews(product.id),
    fetchReviewSummary(product.id),
  ])
  const categoryName = product.category_name || 'FÉROCE'
  const categorySlug = product.category_slug || 'shop'

  return (
    <>
      <ProductJsonLd
        name={product.name}
        description={product.description}
        image={product.image_urls}
        url={`${SITE_URL}/product/${product.slug}`}
        price={product.price}
        availability={
          product.preorder
            ? 'https://schema.org/PreOrder'
            : product.stock > 0
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock'
        }
        reviewCount={summary.count || undefined}
        ratingValue={summary.count ? summary.average : undefined}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: SITE_URL },
          { name: 'Shop', url: `${SITE_URL}/shop` },
          { name: categoryName, url: `${SITE_URL}/shop/${categorySlug}` },
          { name: product.name, url: `${SITE_URL}/product/${product.slug}` },
        ]}
      />

      <div className="bg-white min-h-screen text-navy antialiased">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 py-6 sm:py-10">
          {/* Breadcrumb Navigation */}
          <nav className="mb-6 sm:mb-8 flex items-center gap-2 overflow-x-auto scrollbar-hide text-[11px] font-semibold text-navy/50 uppercase tracking-wider">
            <Link href="/" className="hover:text-navy transition-colors">Home</Link>
            <span className="text-gray-300">/</span>
            <Link href="/shop" className="hover:text-navy transition-colors">Shop</Link>
            <span className="text-gray-300">/</span>
            <Link href={`/shop/${categorySlug}`} className="hover:text-navy transition-colors">
              {categoryName}
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-navy truncate max-w-[200px]">{product.name}</span>
          </nav>

          {/* Product Client Layout */}
          <ProductPageClient product={product} />

          {/* Customer Reviews Section */}
          <ProductReviews productId={product.id} reviews={reviews} summary={summary} />

          {/* Complete the Look / Related Creations */}
          {related.length > 0 && (
            <div className="mt-16 sm:mt-24 border-t border-gray-100 pt-12 sm:pt-16">
              <div className="mb-8 sm:mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F6F6F8] border border-gray-200/80 text-[11px] font-semibold tracking-wider uppercase text-navy/70 mb-3">
                    Curated Pairings
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-sans font-bold text-navy tracking-tight">
                    Complete the Look
                  </h2>
                </div>
                <Link
                  href="/shop"
                  className="text-xs font-semibold text-navy hover:text-gold uppercase tracking-wider inline-flex items-center gap-1 transition-colors"
                >
                  View Full Catalog →
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8 md:grid-cols-3 lg:grid-cols-4">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
