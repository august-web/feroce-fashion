'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Heart } from 'lucide-react'
import { useWishlistStore } from '@/store/wishlist'
import { Share2, Copy, Check, X } from 'lucide-react'
import type { Product } from '@/lib/types'
import { formatPrice } from '@/lib/types'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [showShare, setShowShare] = useState(false)
  const [copied, setCopied] = useState(false)
  const { toggleItem, isInWishlist } = useWishlistStore()
  const inWishlist = isInWishlist(product.id)

  const modelImage =
    product.model_image_urls && product.model_image_urls.length > 0
      ? product.model_image_urls[0]
      : null

  const productUrl = `https://ferocefashionff.com/product/${product.slug}`
  const shareText = `Check out the ${product.name} from FÉROCE — luxury handbags designed in Dallas.`

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowShare(!showShare)
  }

  const copyLink = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    navigator.clipboard.writeText(productUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const shareTo = (platform: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowShare(false)
    const urls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + productUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(productUrl)}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(productUrl)}&description=${encodeURIComponent(shareText)}`,
    }
    if (urls[platform]) window.open(urls[platform], '_blank', 'width=600,height=400')
  }

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block min-h-[48px]"
    >
      {/* Image container */}
      <div className="relative aspect-[4/5] overflow-hidden border border-line bg-white">
        <img
          src={product.image_urls[0] || '/images/products/Denim De Ville Collection/Blue & Gold/Denim De Ville Collection --Blue & Gold.jpg'}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-cover transition-all duration-700 group-hover:scale-[1.03]"
          loading="lazy"
        />

        {modelImage && (
          <img
            src={modelImage}
            alt={`${product.name} — worn`}
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            loading="lazy"
          />
        )}

        {/* Badges — top left */}
        <div className="absolute left-2.5 top-2.5 sm:left-3 sm:top-3 z-10 flex flex-col gap-1.5">
          {product.is_new && (
            <span className="bg-gold px-2.5 py-1 sm:px-3 sm:py-1.5 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-navy">
              New
            </span>
          )}
          {product.preorder && (
            <span className="bg-navy px-2.5 py-1 sm:px-3 sm:py-1.5 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-gold">
              Preorder
            </span>
          )}
          {product.compare_at_price && !product.preorder && (
            <span className="bg-red-600 px-2.5 py-1 sm:px-3 sm:py-1.5 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-white">
              Sale
            </span>
          )}
        </div>

                {/* Wishlist heart */}
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            toggleItem({
              productId: product.id,
              name: product.name,
              slug: product.slug,
              price: product.price,
              image: product.image_urls[0] || '',
              color: product.color,
            })
          }}
          className={"absolute right-2.5 top-2.5 sm:right-3 sm:top-3 z-20 w-8 h-8 flex items-center justify-center backdrop-blur-sm transition-all duration-150 " + (inWishlist ? 'bg-red-500 text-white' : 'bg-white/90 text-navy/60 hover:text-red-500 hover:bg-white')}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={14} strokeWidth={1.5} fill={inWishlist ? "currentColor" : "none"} />
        </button>

{/* Share icon — top right */}
        <button
          onClick={handleShare}
          className="absolute right-2.5 top-2.5 sm:right-3 sm:top-3 z-20 w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm text-navy/60 hover:text-navy hover:bg-white transition-all duration-150"
          aria-label={`Share ${product.name}`}
        >
          <Share2 size={14} strokeWidth={1.5} />
        </button>

        {/* Share dropdown */}
        {showShare && (
          <div
            className="absolute right-2.5 top-12 sm:right-3 sm:top-12 z-30 w-48 bg-white border border-[#E2DFD8] shadow-lg"
            onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
          >
            <div className="flex items-center justify-between px-3 py-2 border-b border-[#E2DFD8]">
              <span className="text-[9px] uppercase tracking-[0.2em] text-navy/60 font-medium">Share</span>
              <button onClick={(e) => { e.preventDefault(); setShowShare(false) }} className="text-navy/40 hover:text-navy">
                <X size={12} />
              </button>
            </div>
            <div className="py-1">
              {[
                { name: 'WhatsApp', key: 'whatsapp' },
                { name: 'Facebook', key: 'facebook' },
                { name: 'Twitter / X', key: 'twitter' },
                { name: 'Pinterest', key: 'pinterest' },
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={(e) => shareTo(opt.key, e)}
                  className="w-full text-left px-3 py-2 text-[11px] text-navy/70 hover:bg-cream hover:text-navy transition-colors"
                >
                  {opt.name}
                </button>
              ))}
            </div>
            <div className="border-t border-[#E2DFD8] px-3 py-2">
              <button onClick={copyLink} className="flex items-center gap-1.5 w-full text-[11px] text-navy/70 hover:text-navy transition-colors">
                {copied ? (
                  <>
                    <Check size={12} className="text-green-600" />
                    <span className="text-green-600 uppercase tracking-wider">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} strokeWidth={1.5} />
                    <span className="uppercase tracking-[0.15em]">Copy link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Quick view bar */}
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
        <div className="flex items-center gap-2">
          <p className="text-[11px] sm:text-xs font-medium text-navy tracking-wide">
            {formatPrice(product.price)}
          </p>
          {product.compare_at_price && product.compare_at_price > product.price && (
            <p className="text-[10px] sm:text-[11px] text-navy/30 line-through">
              {formatPrice(product.compare_at_price)}
            </p>
          )}
        </div>
        {product.preorder && (
          <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-gold font-medium">
            Preorder — ships in 2–3 weeks
          </p>
        )}
      </div>
    </Link>
  )
}
