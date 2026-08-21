'use client'

import { useState } from 'react'
import type { ShopProduct } from '@/lib/shop-data'
import { formatPrice } from '@/lib/types'
import { useCartStore } from '@/store/cart'
import { useToastStore } from '@/components/Toast'
import { useAuth } from '@/hooks/useAuth'
import { AuthPromptModal } from '@/components/AuthPromptModal'
import { MiniCartDrawer } from '@/components/MiniCartDrawer'
import { ColorSwatches } from '@/components/product/ColorSwatches'
import { SizeSelector } from '@/components/product/SizeSelector'
import { QuantitySelector } from '@/components/product/QuantitySelector'
import { Accordions } from '@/components/product/Accordions'
import { ShareButton } from '@/components/product/ShareButton'

interface ProductDetailsClientProps {
  product: ShopProduct
  selectedColor: string
  onColorChange: (color: string) => void
}

export function ProductDetailsClient({ product, selectedColor, onColorChange }: ProductDetailsClientProps) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]?.label || 'One Size')
  const [quantity, setQuantity] = useState(1)
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)
  const [showMiniCart, setShowMiniCart] = useState(false)
  const addItem = useCartStore((s) => s.addItem)
  const toast = useToastStore((s) => s.add)
  const { isAuthenticated, loading } = useAuth()

  const activeVariant = product.variants.find((v) => v.color === selectedColor) || product.variants[0]

  const handleAddToCart = () => {
    if (!loading && !isAuthenticated) {
      setShowAuthPrompt(true)
      return
    }

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
    toast(product.name + ' added to bag')
    setShowMiniCart(true)
  }

  const subtotal = product.price * quantity

  const accordionItems = [
    { title: 'Materials & Fit', content: product.materials },
    { title: 'Care Instructions', content: product.careInstructions },
    {
      title: 'Shipping & Returns',
      content: 'Complimentary standard shipping on orders over $200. Express shipping available at checkout. Free returns within 30 days of delivery. Items must be unused with tags attached.',
    },
  ]

  return (
    <>
      <AuthPromptModal
        open={showAuthPrompt}
        onClose={() => setShowAuthPrompt(false)}
        message="Sign in or create an account to add items to your bag and checkout."
      />

      <MiniCartDrawer open={showMiniCart} onClose={() => setShowMiniCart(false)} />

      {product.variants.length > 0 && (
        <ColorSwatches variants={product.variants} activeColor={selectedColor} onSelect={onColorChange} />
      )}
      {product.sizes.length > 0 && (
        <SizeSelector sizes={product.sizes} activeSize={selectedSize} onSelect={setSelectedSize} />
      )}
      <QuantitySelector quantity={quantity} onChange={setQuantity} />

      <button
        onClick={handleAddToCart}
        disabled={loading}
        className="w-full btn-primary py-4 text-center min-h-[48px] group relative overflow-hidden disabled:opacity-50"
      >
        <span className="relative z-10">
          ADD TO CART — {formatPrice(subtotal)}
        </span>
        <div className="absolute inset-0 bg-gold/20 translate-y-full transition-transform duration-300 group-hover:translate-y-0" />
      </button>

      <div className="space-y-2.5">
        <div className="flex items-center gap-2.5">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gold flex-shrink-0">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-[11px] text-navy/50">In stock — ships within 2–4 business days</span>
        </div>
        <div className="flex items-center gap-2.5">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gold flex-shrink-0">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-[11px] text-navy/50">Free returns within 30 days</span>
        </div>
      </div>

      <div className="border-t border-[#E2DFD8] pt-3">
        <ShareButton name={product.name} slug={product.slug} />
      </div>

      <Accordions items={accordionItems} />
    </>
  )
}
