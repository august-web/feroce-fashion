'use client'

import { useState } from 'react'
import type { ShopProduct } from '@/lib/shop-data'
import { formatPrice } from '@/lib/types'
import { ImageGallery } from '@/components/product/ImageGallery'
import { ProductDetailsClient } from './ProductDetailsClient'
import { MiniCartDrawer } from '@/components/MiniCartDrawer'
import { AuthPromptModal } from '@/components/AuthPromptModal'

interface ProductPageClientProps {
  product: ShopProduct
}

export function ProductPageClient({ product }: ProductPageClientProps) {
  const [selectedColor, setSelectedColor] = useState(product.variants[0]?.color || product.color)
  const [showMiniCart, setShowMiniCart] = useState(false)
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)

  const activeVariant = product.variants.find((v) => v.color === selectedColor) || product.variants[0]

  const hasSale = !!product.compare_at_price && product.compare_at_price > product.price

  return (
    <>
      {/* Portals — rendered outside the grid so they escape ScrollReveal's transform context */}
      <MiniCartDrawer open={showMiniCart} onClose={() => setShowMiniCart(false)} />
      <AuthPromptModal
        open={showAuthPrompt}
        onClose={() => setShowAuthPrompt(false)}
        message="Sign in or create an account to add items to your bag and checkout."
      />

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
              {hasSale && (
                <span className="inline-block bg-red-600 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-white">
                  Sale
                </span>
              )}
            </div>

            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-navy md:text-4xl">
                {product.name}
              </h1>
            </div>

            {/* Price with sale */}
            <div className="flex items-center gap-3">
              <p className="text-lg font-sans font-medium text-navy tracking-wide">
                {formatPrice(product.price)}
              </p>
              {hasSale && (
                <p className="text-base text-navy/30 line-through">
                  {formatPrice(product.compare_at_price!)}
                </p>
              )}
            </div>

            {product.preorder && (
              <p className="text-[11px] uppercase tracking-[0.15em] text-gold font-medium">
                Preorder — ships in 2–3 weeks
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
              onOpenAuthPrompt={() => setShowAuthPrompt(true)}
            />
          </div>
        </div>
      </div>
    </>
  )
}
