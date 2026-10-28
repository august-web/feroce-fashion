'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Heart, ShoppingBag, Check } from 'lucide-react'
import { useWishlistStore } from '@/store/wishlist'
import { useCartStore } from '@/store/cart'
import type { Product } from '@/lib/types'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [added, setAdded] = useState(false)
  const { toggleItem, isInWishlist } = useWishlistStore()
  const addItem = useCartStore((s) => s.addItem)
  const openMiniCart = useCartStore((s) => s.openMiniCart)
  const inWishlist = isInWishlist(product.id)

  const modelImage =
    product.model_image_urls && product.model_image_urls.length > 0
      ? product.model_image_urls[0]
      : null

  const mainImage =
    product.image_urls && product.image_urls.length > 0
      ? product.image_urls[0]
      : '/images/products/Denim De Ville Collection/Blue & Gold/Denim De Ville Collection --Blue & Gold.jpg'

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: mainImage,
      color: product.color,
    })
    setAdded(true)
    openMiniCart()
    setTimeout(() => setAdded(false), 2000)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: mainImage,
      slug: product.slug,
      color: product.color || 'Default',
    })
  }

  return (
    <div className="group relative block aspect-[3/4] sm:aspect-[4/5] rounded-[28px] sm:rounded-[36px] overflow-hidden bg-[#ECECEE] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] transition-all duration-500">
      <Link href={`/product/${product.slug}`} className="block h-full w-full">
        {/* Main Product Image */}
        <img
          src={mainImage}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Hover Model Crossfade Image */}
        {modelImage && (
          <img
            src={modelImage}
            alt={`${product.name} on figure`}
            className="absolute inset-0 h-full w-full object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"
            loading="lazy"
          />
        )}
      </Link>

      {/* Top Left Status Badge */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 pointer-events-none">
        {product.preorder && (
          <span className="backdrop-blur-md bg-navy/85 text-white text-[9px] font-sans font-semibold tracking-wider uppercase px-3 py-1 rounded-full shadow-xs">
            Pre-Order
          </span>
        )}
        {product.is_new && !product.preorder && (
          <span className="backdrop-blur-md bg-gold text-navy text-[9px] font-sans font-bold tracking-wider uppercase px-3 py-1 rounded-full shadow-xs">
            New
          </span>
        )}
      </div>

      {/* Top Right Wishlist Heart Button */}
      <button
        type="button"
        onClick={handleWishlist}
        aria-label="Add to wishlist"
        className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full backdrop-blur-md bg-white/75 hover:bg-white text-navy flex items-center justify-center transition-all duration-200 shadow-xs"
      >
        <Heart
          size={16}
          className={inWishlist ? 'fill-gold text-gold' : 'text-navy/80 hover:text-navy'}
        />
      </button>

      {/* ── Signature Floating Frosted Glass Capsule Pill (Matching Reference) ── */}
      <div className="absolute bottom-4 inset-x-4 sm:bottom-5 sm:inset-x-5 backdrop-blur-md bg-white/75 border border-white/70 rounded-full px-4 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.06)] group-hover:bg-white/95 transition-all z-10">
        <div className="min-w-0 pr-2">
          <p className="font-sans text-xs sm:text-sm font-bold text-navy tracking-tight truncate">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-[10px] text-navy/55 font-sans truncate -mt-0.5">
            {product.name}
          </p>
        </div>

        {/* Quick Add Action Button */}
        <button
          type="button"
          onClick={handleQuickAdd}
          aria-label={`Add ${product.name} to bag`}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-navy text-white hover:bg-gold hover:text-navy flex items-center justify-center transition-all duration-300 shadow-sm shrink-0"
        >
          {added ? <Check size={16} /> : <ShoppingBag size={16} strokeWidth={1.8} />}
        </button>
      </div>
    </div>
  )
}
