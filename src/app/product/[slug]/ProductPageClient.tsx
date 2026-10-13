'use client'

import { useState } from 'react'
import type { ShopProduct } from '@/lib/shop-data'
import { formatPrice } from '@/lib/types'
import { ImageGallery } from '@/components/product/ImageGallery'
import { ProductDetailsClient } from './ProductDetailsClient'
import { MiniCartDrawer } from '@/components/MiniCartDrawer'

interface ProductPageClientProps {
  product: ShopProduct
}

export function ProductPageClient({ product }: ProductPageClientProps) {
  const [selectedColor, setSelectedColor] = useState(product.variants[0]?.color || product.color)
  const [showMiniCart, setShowMiniCart] = useState(false)

  const activeVariant = product.variants.find((v) => v.color === selectedColor) || product.variants[0]

  return (
    <>
      {/* Portals — rendered outside the grid so they escape ScrollReveal's transform context */}
      <MiniCartDrawer open={showMiniCart} onClose={() => setShowMiniCart(false)} />

      <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-14">
        <div className="lg:sticky lg:top-20 lg:self-start">
          <ImageGallery
            images={product.image_urls}
            modelImages={product.model_image_urls}
            productName={product.name}
            activeVariant={activeVariant}
          />
        </div>
        <div className="lg:sticky lg:top-20 lg:self-start">
          <div className="space-y-5 sm:space-y-6">
            {/* Badges */}
            <div className="flex items-center gap-2">
              {product.is_new && (
                <span className="inline-block bg-gold px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-navy">
                  New
                </span>
              )}
              {product.preorder && (
                <span className="inline-block bg-navy px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-gold">
                  Preorder
                </span>
              )}
            </div>

            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-navy md:text-4xl">
                {product.name}
              </h1>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <p className="text-lg font-sans font-medium text-navy tracking-wide">
                {formatPrice(product.price)}
              </p>
            </div>

            {product.preorder && (
              <p className="text-[11px] uppercase tracking-[0.15em] text-gold font-medium">
                Preorder — ships in 4–8 weeks
              </p>
            )}

            <p className="text-sm leading-relaxed text-navy/60">
              {product.description}
            </p>
            <ProductDetailsClient
              product={product}
              selectedColor={selectedColor}
              onColorChange={setSelectedColor}
              onOpenMiniCart={() => setShowMiniCart(true)}
            />
          </div>
        </div>
      </div>
    </>
  )
}
