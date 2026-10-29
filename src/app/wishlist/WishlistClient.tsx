'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useWishlistStore, type WishlistItem } from '@/store/wishlist'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/types'
import { ShoppingBag, Trash2, Heart, Check, ArrowRight, Sparkles } from 'lucide-react'

const DEMO_ITEMS: WishlistItem[] = [
  {
    productId: 'demo-1',
    name: 'Naji Gold Fur Bag (XL)',
    slug: 'naji-gold-fur-xl',
    price: 443.0,
    image: '/images/products/Naji Collection/Gold Fur Bag/Naji Collection -- Golden Fur.jpg',
    color: 'Gold Fur',
    preorder: false,
  },
  {
    productId: 'demo-2',
    name: 'FÉROCE Satchel Bag',
    slug: 'feroce-satchel-bag',
    price: 300.0,
    image: '/images/products/Satchel/Mens -- Satchel bag.jpg',
    color: 'Classic Monogram',
    preorder: true,
  },
  {
    productId: 'demo-3',
    name: 'Denim De Ville (Cream & Gold)',
    slug: 'denim-de-ville-cream-gold',
    price: 250.0,
    image: '/images/products/Denim De Ville Collection/Cream & Gold/Preview 1.jpg',
    color: 'Cream & Gold',
    preorder: true,
  },
]

export default function WishlistClient() {
  const searchParams = useSearchParams()
  const isDemo = searchParams.get('demo') === '1'

  const { items, removeItem } = useWishlistStore()
  const addItem = useCartStore((s) => s.addItem)
  const openMiniCart = useCartStore((s) => s.openMiniCart)
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({})

  const displayItems = items.length > 0 ? items : (isDemo ? DEMO_ITEMS : [])

  const handleQuickAdd = (e: React.MouseEvent, item: WishlistItem) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      productId: item.productId,
      name: item.name,
      slug: item.slug,
      price: item.price,
      image: item.image,
      color: item.color || 'Default',
      preorder: item.preorder,
    })
    setAddedIds((prev) => ({ ...prev, [item.productId]: true }))
    openMiniCart()
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [item.productId]: false }))
    }, 2000)
  }

  const handleMoveAllToBag = () => {
    displayItems.forEach((item) => {
      addItem({
        productId: item.productId,
        name: item.name,
        slug: item.slug,
        price: item.price,
        image: item.image,
        color: item.color || 'Default',
        preorder: item.preorder,
      })
    })
    openMiniCart()
  }

  return (
    <div className="bg-white min-h-screen text-navy antialiased">
      {/* ── Top Atelier Subheader / Breadcrumb ── */}
      <section className="pt-28 pb-8 sm:pt-32 sm:pb-10 border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 bg-[#F6F6F8] border border-gray-200/80 text-[11px] font-semibold tracking-wider uppercase text-navy/70 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                Curated Vault · Dallas, TX
              </div>
              <h1 className="font-sans font-bold text-navy text-3xl sm:text-5xl md:text-6xl tracking-[-0.035em] leading-[1.05]">
                Saved Creations
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <span className="rounded-full px-4 py-2 bg-[#F6F6F8] border border-gray-200/80 text-xs font-semibold tracking-wide text-navy">
                ✦ {displayItems.length} {displayItems.length === 1 ? 'Piece' : 'Pieces'} Saved
              </span>
              {displayItems.length > 0 && (
                <button
                  onClick={handleMoveAllToBag}
                  className="inline-flex items-center gap-2 bg-[#4A4D52] hover:bg-navy text-white rounded-full px-6 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-sm cursor-pointer"
                >
                  <ShoppingBag size={14} />
                  Move All to Bag
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Content Section ── */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {displayItems.length === 0 ? (
            /* ── Empty State ── */
            <div className="rounded-[32px] sm:rounded-[44px] bg-[#F6F6F8] border border-gray-200/80 p-10 sm:p-20 text-center max-w-3xl mx-auto shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white border border-gray-200/80 flex items-center justify-center shadow-xs">
                <Heart className="w-9 h-9 text-gold fill-gold/20" strokeWidth={1.5} />
              </div>

              <h2 className="font-sans font-bold text-2xl sm:text-3xl text-navy tracking-[-0.03em] mb-3">
                Your Vault is Currently Empty
              </h2>
              <p className="text-sm sm:text-base text-navy/60 max-w-md mx-auto mb-8 font-sans leading-relaxed">
                Save your favorite limited atelier bags and runway silhouettes here to easily compare, reserve, or commission later.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/shop"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#4A4D52] hover:bg-navy text-white rounded-full px-8 py-4 text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-sm"
                >
                  Explore The Archive
                  <ArrowRight size={14} />
                </Link>
                <Link
                  href="/about"
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-full px-8 py-4 text-xs font-semibold uppercase tracking-wider text-navy bg-white border border-gray-200 hover:border-navy transition-all duration-300"
                >
                  Our Heritage
                </Link>
              </div>

              {/* Recommended Quick Navigation */}
              <div className="mt-12 pt-10 border-t border-gray-200/70">
                <p className="text-xs uppercase tracking-widest font-semibold text-navy/40 mb-4">
                  Signature Silhouettes
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <Link
                    href="/product/naji-gold-fur-xl"
                    className="rounded-full px-4 py-2 bg-white border border-gray-200 text-xs font-medium text-navy/80 hover:text-navy hover:border-navy transition-colors"
                  >
                    Naji Gold Fur Bag · $443.00
                  </Link>
                  <Link
                    href="/product/feroce-satchel-bag"
                    className="rounded-full px-4 py-2 bg-white border border-gray-200 text-xs font-medium text-navy/80 hover:text-navy hover:border-navy transition-colors"
                  >
                    FÉROCE Satchel Bag · $300.00
                  </Link>
                  <Link
                    href="/shop/womens"
                    className="rounded-full px-4 py-2 bg-white border border-gray-200 text-xs font-medium text-navy/80 hover:text-navy hover:border-navy transition-colors"
                  >
                    Denim De Ville Archive
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            /* ── Wishlist Grid ── */
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                {displayItems.map((item) => {
                  const isAdded = !!addedIds[item.productId]

                  return (
                    <div
                      key={item.productId}
                      className="group relative aspect-[3/4] sm:aspect-[4/5] rounded-[28px] sm:rounded-[36px] overflow-hidden bg-[#ECECEE] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] transition-all duration-500"
                    >
                      <Link href={`/product/${item.slug}`} className="block h-full w-full">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                          loading="lazy"
                        />
                      </Link>

                      {/* Top Left Tag */}
                      <div className="absolute top-4 left-4 z-10 pointer-events-none">
                        <span className="backdrop-blur-md bg-white/85 text-navy text-[10px] font-sans font-semibold tracking-wider uppercase px-3 py-1 rounded-full shadow-xs">
                          {item.color || 'Atelier'}
                        </span>
                      </div>

                      {/* Top Right Quick Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        aria-label="Remove from wishlist"
                        className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full backdrop-blur-md bg-white/80 hover:bg-white text-navy/70 hover:text-red-500 flex items-center justify-center transition-all duration-200 shadow-xs cursor-pointer"
                      >
                        <Trash2 size={15} strokeWidth={1.8} />
                      </button>

                      {/* ── Signature Floating Frosted Glass Capsule Pill ── */}
                      <div className="absolute bottom-4 inset-x-4 sm:bottom-5 sm:inset-x-5 backdrop-blur-md bg-white/80 border border-white/70 rounded-full px-4 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.06)] group-hover:bg-white/95 transition-all z-10">
                        <div className="min-w-0 pr-2">
                          <p className="font-sans text-xs sm:text-sm font-bold text-navy tracking-tight truncate">
                            {formatPrice(item.price)}
                          </p>
                          <p className="text-[10px] text-navy/60 font-sans truncate -mt-0.5">
                            {item.name}
                          </p>
                        </div>

                        {/* Quick Add Action Button */}
                        <button
                          type="button"
                          onClick={(e) => handleQuickAdd(e, item)}
                          aria-label={`Add ${item.name} to bag`}
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm shrink-0 cursor-pointer ${
                            isAdded
                              ? 'bg-gold text-navy'
                              : 'bg-navy text-white hover:bg-gold hover:text-navy'
                          }`}
                        >
                          {isAdded ? <Check size={16} /> : <ShoppingBag size={16} strokeWidth={1.8} />}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* ── Bottom Atelier Allocation & Concierge Card ── */}
              <div className="mt-16 sm:mt-24 rounded-[32px] sm:rounded-[40px] bg-[#F6F6F8] border border-gray-200/80 p-8 sm:p-14 text-center">
                <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 bg-white border border-gray-200/80 text-[11px] font-semibold tracking-wider uppercase text-navy/70 mb-3 shadow-xs">
                  <Sparkles size={13} className="text-gold" />
                  Dallas Atelier Concierge
                </div>
                <h3 className="font-sans font-bold text-2xl sm:text-3xl text-navy tracking-[-0.03em] mb-2">
                  Bespoke Sizing & Commission Requests
                </h3>
                <p className="text-sm text-navy/60 max-w-xl mx-auto mb-6 leading-relaxed">
                  Have questions about leather grain, hardware finishes, or personalized colorways on your saved pieces? Inquire directly with our Dallas atelier team.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 bg-[#4A4D52] hover:bg-navy text-white rounded-full px-8 py-3.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-sm"
                  >
                    Contact Concierge
                    <ArrowRight size={14} />
                  </Link>
                  <Link
                    href="/shop"
                    className="rounded-full px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-navy bg-white border border-gray-200 hover:border-navy transition-all duration-300"
                  >
                    Continue Browsing
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
