'use client'

import { useState } from 'react'
import { ShoppingBag, ArrowUpRight, Heart, ShieldCheck, Clock, Award } from 'lucide-react'
import type { ShopProduct } from '@/lib/shop-data'
import { formatPrice } from '@/lib/types'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'
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

export function ProductDetailsClient({
  product,
  selectedColor,
  onColorChange,
  onOpenMiniCart,
}: ProductDetailsClientProps) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]?.label || 'One Size')
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((s) => s.addItem)
  const toast = useToastStore((s) => s.add)
  const { toggleItem, isInWishlist } = useWishlistStore()
  const inWishlist = isInWishlist(product.id)

  const activeVariant =
    product.variants.find((v) => v.color === selectedColor) || product.variants[0]

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: product.image_urls[0] || '',
        color: selectedColor,
        preorder: Boolean(product.preorder),
        stripe_checkout_url: activeVariant?.stripe_checkout_url,
      })
    }
    toast(product.name + (product.preorder ? ' added to preorder' : ' added to bag'))
    onOpenMiniCart()
  }

  const subtotal = product.price * quantity

  const accordionItems = [
    { title: 'Materials & Handcrafted Artistry', content: product.materials },
    { title: 'Care & Preservation Instructions', content: product.careInstructions },
    {
      title: 'Complimentary Shipping & Atelier Warranty',
      content: product.preorder
        ? 'Made to order in Dallas atelier — ships within 4–8 weeks with tracked express courier. Complimentary standard delivery on US orders over $200. All sales are final. If your piece arrives with any damage or defect, contact us within 48 hours at Ferocefashionff@gmail.com for priority concierge support.'
        : 'Handcrafted precision. Complimentary tracked delivery on US orders over $200. All sales are final. If your piece arrives with any defect, notify us within 48 hours for immediate replacement.',
    },
  ]

  return (
    <div className="space-y-6 pt-2">
      {/* 1. Color Swatches */}
      {product.variants.length > 0 && (
        <ColorSwatches
          variants={product.variants}
          activeColor={selectedColor}
          onSelect={onColorChange}
        />
      )}

      {/* 2. Size Selector */}
      {product.sizes.length > 0 && (
        <SizeSelector
          sizes={product.sizes}
          activeSize={selectedSize}
          onSelect={setSelectedSize}
        />
      )}

      {/* 3. Quantity & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 pt-1">
        <QuantitySelector quantity={quantity} onChange={setQuantity} />

        <div className="flex-1">
          <button
            id="primary-buy-button"
            onClick={handleAddToCart}
            className="w-full bg-[#4A4D52] hover:bg-navy text-white text-xs sm:text-sm font-semibold rounded-full py-4 px-8 tracking-wider uppercase shadow-md transition-all duration-300 inline-flex items-center justify-center gap-3 min-h-[52px] group"
          >
            <ShoppingBag className="w-4 h-4 text-gold transition-transform group-hover:scale-110" />
            <span>
              {product.preorder ? 'Pre-Order Allocation' : 'Add to Bag'} — {formatPrice(subtotal)}
            </span>
            <ArrowUpRight className="w-4 h-4 text-white/80 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>

      {/* 4. Dallas Atelier Trust Pillars */}
      <div className="rounded-[24px] bg-[#F6F6F8] p-5 sm:p-6 border border-gray-100 space-y-3">
        {product.preorder && (
          <div className="flex items-start gap-3">
            <Clock className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
            <p className="text-xs text-navy/80 font-medium leading-relaxed">
              <strong>Limited Atelier Batch:</strong> Handcrafted in Dallas, TX. Priority production allocation reserved instantly (Ships in 4–8 weeks).
            </p>
          </div>
        )}
        <div className="flex items-start gap-3">
          <Award className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
          <p className="text-xs text-navy/70 leading-relaxed">
            Authenticity and 24K gold-plated monogram hardware craftsmanship guaranteed by FÉROCE Dallas.
          </p>
        </div>
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
          <p className="text-xs text-navy/70 leading-relaxed">
            Complimentary express delivery on US orders over $200. Dedicated 48-hour concierge support.
          </p>
        </div>
      </div>

      {/* 5. Wishlist & Share Pills */}
      <div className="flex items-center gap-3 pt-1">
        <button
          onClick={() =>
            toggleItem({
              productId: product.id,
              name: product.name,
              slug: product.slug,
              price: product.price,
              image: product.image_urls[0] || '',
              color: selectedColor,
              preorder: Boolean(product.preorder),
            })
          }
          className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold border transition-all duration-200 ${
            inWishlist
              ? 'border-red-200 bg-red-50 text-red-600'
              : 'border-gray-200 bg-white text-navy/70 hover:text-navy hover:border-gray-300'
          }`}
        >
          <Heart size={14} fill={inWishlist ? 'currentColor' : 'none'} />
          <span>{inWishlist ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
        </button>

        <ShareButton name={product.name} slug={product.slug} />
      </div>

      {/* 6. What Fits Inside & Accordions */}
      <WhatFitsAccordion />
      <Accordions items={accordionItems} />

      {/* 7. Mobile Sticky Buy Rail */}
      <StickyATC
        product={product}
        selectedColor={selectedColor}
        targetTriggerId="primary-buy-button"
        onAddToCart={handleAddToCart}
      />
    </div>
  )
}
