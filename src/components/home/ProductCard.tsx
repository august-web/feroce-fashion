'use client'

import Link from 'next/link'
import type { Product } from '@/lib/types'
import { formatPrice } from '@/lib/types'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  // Model/lifestyle image shown on hover
  const modelImage =
    product.model_image_urls && product.model_image_urls.length > 0
      ? product.model_image_urls[0]
      : null

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block min-h-[48px]"
    >
      {/* Image container */}
      <div className="relative aspect-[4/5] overflow-hidden border border-line bg-white">
        {/* Product-only image — always visible */}
        <img
          src={product.image_urls[0] || '/images/products/quilted-cream/product-1.jpg'}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-cover transition-all duration-700 group-hover:scale-[1.03]"
          loading="lazy"
        />

        {/* Model/lifestyle image — fades in on hover only (desktop + mobile tap) */}
        {modelImage && (
          <img
            src={modelImage}
            alt={`${product.name} — worn`}
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            loading="lazy"
          />
        )}

        {/* NEW badge */}
        {product.is_new && (
          <span className="absolute left-2.5 top-2.5 sm:left-3 sm:top-3 bg-gold px-2.5 py-1 sm:px-3 sm:py-1.5 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-navy z-10">
            New
          </span>
        )}

        {/* Quick view bar — always visible on mobile (touch), hover on desktop */}
        <div className="absolute inset-x-0 bottom-0 bg-navy/90 md:translate-y-full md:transition-transform md:duration-400 md:group-hover:translate-y-0">
          <p className="py-2.5 sm:py-3 text-center text-[9px] sm:text-[10px] font-sans uppercase tracking-[0.2em] text-white">
            {modelImage ? 'View' : 'Quick View'}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="mt-3 sm:mt-4 space-y-1 sm:space-y-1.5">
        <h3 className="font-serif text-[13px] sm:text-sm font-medium text-navy transition-colors group-hover:text-gold leading-tight">
          {product.name}
        </h3>
        <p className="line-clamp-2 text-[10px] sm:text-[11px] leading-relaxed text-navy/45">
          {product.description}
        </p>
        <p className="text-[11px] sm:text-xs font-medium text-navy tracking-wide">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  )
}
