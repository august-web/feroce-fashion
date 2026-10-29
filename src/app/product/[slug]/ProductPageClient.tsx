'use client'

import { useState } from 'react'
import type { ShopProduct } from '@/lib/shop-data'
import { formatPrice } from '@/lib/types'
import { ImageGallery } from '@/components/product/ImageGallery'
import { ProductDetailsClient } from './ProductDetailsClient'
import { MiniCartDrawer } from '@/components/MiniCartDrawer'
import { InstallmentPill } from '@/components/product/InstallmentPill'

interface ProductPageClientProps {
  product: ShopProduct
}

export function ProductPageClient({ product }: ProductPageClientProps) {
  const [selectedColor, setSelectedColor] = useState(
    product.variants[0]?.color || product.color || 'Default'
  )
  const [showMiniCart, setShowMiniCart] = useState(false)

  const activeVariant =
    product.variants.find((v) => v.color === selectedColor) || product.variants[0]

  return (
    <>
      <MiniCartDrawer open={showMiniCart} onClose={() => setShowMiniCart(false)} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-14 items-start">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 lg:sticky lg:top-24">
          <ImageGallery
            images={product.image_urls}
            modelImages={product.model_image_urls}
            productName={product.name}
            activeVariant={activeVariant}
          />
        </div>

        {/* Right Column: Product Details */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <div className="space-y-6">
            {/* Top Badge Pill & Origin */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F6F6F8] border border-gray-200/80 text-[10px] font-bold uppercase tracking-wider text-navy/70">
                <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                Dallas Atelier
              </span>
              {product.preorder && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-navy text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                  Pre-Order Allocation
                </span>
              )}
              {product.is_new && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-gold text-navy text-[10px] font-bold uppercase tracking-wider">
                  New Release
                </span>
              )}
            </div>

            {/* Product Title */}
            <div>
              <h1 className="text-3xl sm:text-5xl font-sans font-bold text-navy tracking-[-0.035em] leading-[1.08]">
                {product.name}
              </h1>
            </div>

            {/* Price & Installments */}
            <div className="pb-2 border-b border-gray-100">
              <div className="flex items-baseline gap-3">
                <p className="text-2xl sm:text-3xl font-sans font-bold text-navy tracking-tight">
                  {formatPrice(product.price)}
                </p>
                {product.compare_at_price && product.compare_at_price > product.price && (
                  <span className="text-base text-navy/40 line-through font-normal">
                    {formatPrice(product.compare_at_price)}
                  </span>
                )}
              </div>
              <InstallmentPill price={product.price} />
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm leading-relaxed text-navy/70 font-normal">
              {product.description}
            </p>

            {/* Detailed Selectors and Add to Cart */}
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
