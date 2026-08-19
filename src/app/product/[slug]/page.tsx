import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { fetchProductBySlug, fetchRelatedProducts } from '@/lib/product-data'
import { formatPrice } from '@/lib/types'
import { ImageGallery } from '@/components/product/ImageGallery'
import { StarRating } from '@/components/product/StarRating'
import { ProductDetailsClient } from './ProductDetailsClient'
import { ProductCard } from '@/components/home/ProductCard'
import { ScrollReveal } from '@/components/ScrollReveal'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await fetchProductBySlug(slug)
  if (!product) return { title: 'Product — FÉROCE' }
  return {
    title: `${product.name} — FÉROCE`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.image_urls[0] ? [{ url: product.image_urls[0] }] : [],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await fetchProductBySlug(slug)
  if (!product) notFound()

  const related = await fetchRelatedProducts(product.category_id, product.id)
  const categoryName =
    product.category_id === '1' ? "Women's"
    : product.category_id === '2' ? "Men's"
    : product.category_id === '3' ? 'Totes'
    : 'Crossbody'

  return (
    <section className="bg-cream min-h-[60svh]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
        {/* Breadcrumb */}
        <nav className="mb-6 sm:mb-8 text-[10px] font-sans uppercase tracking-luxury text-navy/40">
          <Link href="/" className="hover:text-navy transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href={`/shop/${product.category_id === '1' ? 'womens' : product.category_id === '2' ? 'mens' : product.category_id === '3' ? 'totes' : 'crossbody'}`} className="hover:text-navy transition-colors">
            {categoryName}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-navy/60">{product.name}</span>
        </nav>

        {/* Main layout — gallery left, details right (sticky) */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-14">
          {/* Left — Image Gallery */}
          <ScrollReveal>
            <ImageGallery images={product.image_urls} modelImages={product.model_image_urls} productName={product.name} />
          </ScrollReveal>

          {/* Right — Product Details (sticky on desktop) */}
          <div className="lg:sticky lg:top-20 lg:self-start">
            <ScrollReveal delay={100}>
              <div className="space-y-6">
                {/* NEW badge */}
                {product.is_new && (
                  <span className="inline-block bg-gold px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-navy">
                    New
                  </span>
                )}

                {/* Title + Rating */}
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-navy md:text-4xl">
                    {product.name}
                  </h1>
                  <div className="mt-3">
                    <StarRating />
                  </div>
                </div>

                {/* Price */}
                <p className="text-lg font-sans font-medium text-navy tracking-wide">
                  {formatPrice(product.price)}
                </p>

                {/* Description */}
                <p className="text-sm leading-relaxed text-navy/60">
                  {product.description}
                </p>

                {/* Client-side interactive details */}
                <ProductDetailsClient product={product} />
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-16 sm:mt-20 md:mt-28 border-t border-line pt-14 sm:pt-16 md:pt-20">
            <ScrollReveal>
              <p className="label mb-3 text-center">You Might Also Like</p>
              <h2 className="font-serif text-xl sm:text-2xl font-semibold text-center text-navy mb-10 sm:mb-12">
                Complete the Look
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 md:gap-x-6 md:grid-cols-4">
              {related.map((p, i) => (
                <ScrollReveal key={p.id} delay={i * 80}>
                  <ProductCard product={p} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
