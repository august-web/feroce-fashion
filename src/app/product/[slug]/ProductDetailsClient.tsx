'use client'

import { useState } from 'react'
import type { ExtendedProduct } from '@/data/seed'
import { formatPrice } from '@/lib/types'
import { useCartStore } from '@/store/cart'
import { useToastStore } from '@/components/Toast'
import { ColorSwatches } from '@/components/product/ColorSwatches'
import { SizeSelector } from '@/components/product/SizeSelector'
import { QuantitySelector } from '@/components/product/QuantitySelector'
import { Accordions } from '@/components/product/Accordions'

interface ProductDetailsClientProps {
  product: ExtendedProduct
}

export function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const [selectedColor, setSelectedColor] = useState(product.variants[0]?.color || product.color)
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]?.label || 'One Size')
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((s) => s.addItem)
  const toast = useToastStore((s) => s.add)

  const handleAddToBag = () => {
    // Add item quantity times (cart store adds 1 per call)
    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: product.image_urls[0] || '',
        color: selectedColor,
      })
    }
    toast(`${product.name} added to bag`)
  }

  const subtotal = product.price * quantity

  const accordionItems = [
    { title: 'Materials & Fit', content: product.materials },
    { title: 'Care Instructions', content: product.careInstructions },
    {
      title: 'Shipping & Returns',
      content:
        'Complimentary standard shipping on orders over $200. Express shipping available at checkout. Free returns within 30 days of delivery. Items must be unused with tags attached.',
    },
  ]

  return (
    <>
      {/* Color Swatches */}
      {product.variants.length > 0 && (
        <ColorSwatches
          variants={product.variants}
          activeColor={selectedColor}
          onSelect={setSelectedColor}
        />
      )}

      {/* Size Selector */}
      {product.sizes.length > 0 && (
        <SizeSelector
          sizes={product.sizes}
          activeSize={selectedSize}
          onSelect={setSelectedSize}
        />
      )}

      {/* Quantity */}
      <QuantitySelector quantity={quantity} onChange={setQuantity} />

      {/* ADD TO BAG button */}
      <button
        onClick={handleAddToBag}
        className="w-full btn-primary py-4 text-center min-h-[48px] group relative overflow-hidden"
      >
        <span className="relative z-10">
          Add to Bag — {formatPrice(subtotal)}
        </span>
        <div className="absolute inset-0 bg-gold/20 translate-y-full transition-transform duration-300 group-hover:translate-y-0" />
      </button>

      {/* Trust signals */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2.5">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gold flex-shrink-0">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-[11px] text-navy/50">
            In stock — ships within 2–4 business days
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gold flex-shrink-0">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-[11px] text-navy/50">
            Free returns within 30 days
          </span>
        </div>
      </div>

      {/* Accordions */}
      <Accordions items={accordionItems} />
    </>
  )
}
