'use client'

import { useState } from 'react'
import type { ShopProduct } from '@/lib/shop-data'
import { formatPrice } from '@/lib/types'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'
import { Heart } from 'lucide-react'
import { useToastStore } from '@/components/Toast'
import { ColorSwatches } from '@/components/product/ColorSwatches'
import { SizeSelector } from '@/components/product/SizeSelector'
import { QuantitySelector } from '@/components/product/QuantitySelector'
import { Accordions } from '@/components/product/Accordions'
import { ShareButton } from '@/components/product/ShareButton'
import { WhatFitsAccordion } from '@/components/product/WhatFitsAccordion'
import { StickyATC } from '@/components/product/StickyATC'

interface ProductDetailsClientProps {
  product: ShopProduct
  selectedColor: string
  onColorChange: (color: string) => void
  onOpenMiniCart: () => void
}

export function ProductDetailsClient({ product, selectedColor, onColorChange, onOpenMiniCart }: ProductDetailsClientProps) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]?.label || 'One Size')
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((s) => s.addItem)
  const toast = useToastStore((s) => s.add)
  const { toggleItem, isInWishlist } = useWishlistStore()
  const inWishlist = isInWishlist(product.id)

  const activeVariant = product.variants.find((v) => v.color === selectedColor) || product.variants[0]

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: product.image_urls[0] || '',
        color: selectedColor,
        stripe_checkout_url: activeVariant?.stripe_checkout_url,
      })
    }
    toast(product.name + (product.preorder ? ' added to preorder' : ' added to bag'))
    onOpenMiniCart()
  }

  const subtotal = product.price * quantity

  const accordionItems = [
    { title: 'Materials & Fit', content: product.materials },
    { title: 'Care Instructions', content: product.careInstructions },
    {
      title: 'Shipping & Returns',
      content: product.preorder
        ? 'Made to order — ships within 4–8 weeks of purchase. Complimentary standard shipping (5–7 business days) on US orders over $200; a flat $15 applies below. Express (2–3 business days) available at checkout. All sales are final. If your piece arrives damaged or defective, contact us within 48 hours of delivery at Ferocefashionff@gmail.com with your order number and photos.'
        : 'Standard shipping (5–7 business days) is complimentary on US orders over $200; a flat $15 applies below. Express (2–3 business days) available at checkout. All sales are final. If your piece arrives damaged or defective, contact us within 48 hours of delivery at Ferocefashionff@gmail.com with your order number and photos.',
    },
  ]

  return (
    <>
      {product.variants.length > 0 && (
        <ColorSwatches variants={product.variants} activeColor={selectedColor} onSelect={onColorChange} />
      )}
      {product.sizes.length > 0 && (
        <SizeSelector sizes={product.sizes} activeSize={selectedSize} onSelect={setSelectedSize} />
      )}
      <QuantitySelector quantity={quantity} onChange={setQuantity} />

      <button
        id="primary-buy-button"
        onClick={handleAddToCart}
        className="w-full btn-primary py-4 text-center min-h-[48px] group relative overflow-hidden"
      >
        <span className="relative z-10">
          {product.preorder ? 'PREORDER' : 'ADD TO BAG'} — {formatPrice(subtotal)}
        </span>
        <div className="absolute inset-0 bg-gold/20 translate-y-full transition-transform duration-300 group-hover:translate-y-0" />
      </button>

      {/* Dallas Artisan Trust Pillars */}
      <div className="space-y-2.5 bg-cream/40 p-4 border border-line/70">
        {product.preorder && (
          <div className="flex items-center gap-2.5">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gold flex-shrink-0">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span className="text-[11px] text-navy/80 font-medium">Limited Pre-Order Batch — Handcrafted in Dallas, TX (Ships in 4–8 wks)</span>
          </div>
        )}
        <div className="flex items-center gap-2.5">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gold flex-shrink-0">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-[11px] text-navy/70">
            {product.preorder ? 'Reserve now with guaranteed priority production allocation' : 'Complimentary shipping on orders over $200'}
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gold flex-shrink-0">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-[11px] text-navy/70">Authenticity & craftsmanship guaranteed. Damage replacement guarantee within 48h.</span>
        </div>
      </div>

      <div className="flex items-center gap-4 border-t border-[#E2DFD8] pt-3">
        <button
          onClick={() => toggleItem({ productId: product.id, name: product.name, slug: product.slug, price: product.price, image: product.image_urls[0] || '', color: selectedColor })}
          className={"flex items-center gap-2 text-[11px] font-sans uppercase tracking-[0.1em] transition-colors " + (inWishlist ? 'text-red-500' : 'text-navy/50 hover:text-red-500')}
        >
          <Heart size={14} strokeWidth={1.5} fill={inWishlist ? 'currentColor' : 'none'} />
          {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
        </button>
        <ShareButton name={product.name} slug={product.slug} />
      </div>

      {/* Glamaholic "What Fits Inside" + Dimensions Guide */}
      <WhatFitsAccordion />

      {/* Product Accordions */}
      <Accordions items={accordionItems} />

      {/* Mobile Sticky Buy Rail */}
      <StickyATC
        product={product}
        selectedColor={selectedColor}
        targetTriggerId="primary-buy-button"
        onAddToCart={handleAddToCart}
      />
    </>
  )
}
