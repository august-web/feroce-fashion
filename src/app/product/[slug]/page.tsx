import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { fetchProductBySlug, fetchRelatedProducts } from '@/lib/product-data'
import { ProductPageClient } from './ProductPageClient'
import { ProductCard } from '@/components/home/ProductCard'
import { ScrollReveal } from '@/components/ScrollReveal'
import { ProductJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd'

export const dynamic = 'force-dynamic'

const SITE_URL = 'https://www.ferocefashionff.com'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await fetchProductBySlug(slug)
  if (!product) return { title: 'Product Not Found — FÉROCE' }

  const categoryName = product.category_id === '1' ? "Women's" : "Men's"
  const priceStr = '$' + product.price.toFixed(0)

  return {
    title: `${product.name} — ${categoryName} Handbag | FÉROCE`,
    description: product.description + ` Shop now at FÉROCE. ${priceStr}.`,
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
      title: `${product.name} — FÉROCE`,
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
      title: `${product.name} — FÉROCE`,
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
  const categoryName = product.category_id === '1' ? "Women's" : "Men's"

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
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: SITE_URL },
          { name: 'Shop', url: `${SITE_URL}/shop` },
          { name: categoryName, url: `${SITE_URL}/shop/${product.category_id === '1' ? 'womens' : 'mens'}` },
          { name: product.name, url: `${SITE_URL}/product/${product.slug}` },
        ]}
      />

      <section className="bg-cream min-h-[60svh]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
          <nav className="mb-6 sm:mb-8 text-[10px] font-sans uppercase tracking-luxury text-navy/40">
            <Link href="/" className="hover:text-navy transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/shop" className="hover:text-navy transition-colors">Shop</Link>
            <span className="mx-2">/</span>
            <Link href={"/shop/" + (product.category_id === "1" ? "womens" : "mens")} className="hover:text-navy transition-colors">
              {categoryName}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-navy/60">{product.name}</span>
          </nav>

          <ScrollReveal>
            <ProductPageClient product={product} />
          </ScrollReveal>

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
    </>
  )
}
