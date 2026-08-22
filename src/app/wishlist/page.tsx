'use client'

import Link from 'next/link'
import { useWishlistStore } from '@/store/wishlist'
import { formatPrice } from '@/lib/types'
import { ShoppingBag, Trash2 } from 'lucide-react'

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore()

  return (
    <section className="bg-cream min-h-[60svh]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 md:px-8 py-10 sm:py-14 md:py-20">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <p className="label mb-2 text-navy/40">Your Favorites</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-navy">
            Wishlist
          </h1>
          <div className="mt-4 h-px w-16 bg-gold/40" />
        </div>

        {items.length === 0 ? (
          /* Empty state */
          <div className="text-center py-16 sm:py-24">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white border border-line flex items-center justify-center">
              <svg className="w-7 h-7 text-navy/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <h2 className="font-serif text-xl text-navy mb-2">Your wishlist is empty</h2>
            <p className="text-sm text-navy/50 mb-6">Save your favorite bags here for later.</p>
            <Link href="/shop" className="btn-primary inline-block">Browse Collection</Link>
          </div>
        ) : (
          /* Wishlist grid */
          <>
            <p className="text-xs text-navy/50 mb-6">{items.length} {items.length === 1 ? 'item' : 'items'} saved</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {items.map((item) => (
                <div key={item.productId} className="group">
                  <Link href={'/product/' + item.slug} className="block">
                    <div className="relative aspect-[4/5] overflow-hidden border border-line bg-white">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        loading="lazy" />
                    </div>
                  </Link>
                  <div className="mt-3 space-y-1.5">
                    <Link href={'/product/' + item.slug}>
                      <h3 className="font-serif text-[13px] sm:text-sm font-medium text-navy hover:text-gold transition-colors leading-tight">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-[10px] sm:text-[11px] text-navy/40">{item.color}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] sm:text-xs font-medium text-navy">{formatPrice(item.price)}</p>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-navy/30 hover:text-red-500 transition-colors p-1"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 size={14} strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-12 sm:mt-16 text-center">
              <Link href="/shop" className="btn-primary inline-block">Continue Shopping</Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
