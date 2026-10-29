'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useCartStore } from '@/store/cart'
import { BagItem } from '@/components/bag/BagItem'
import { OrderSummary } from '@/components/bag/OrderSummary'
import { EmptyBag } from '@/components/bag/EmptyBag'
import { ProductCard } from '@/components/home/ProductCard'
import type { Product, CartItem } from '@/lib/types'
import { ArrowLeft, Sparkles, ArrowRight } from 'lucide-react'

const FREE_SHIPPING_THRESHOLD = 200

const DEMO_ITEMS: CartItem[] = [
  {
    productId: 'demo-1',
    name: 'Naji Gold Fur Bag (XL)',
    slug: 'naji-gold-fur-xl',
    price: 443.0,
    image: '/images/products/Naji Collection/Gold Fur Bag/Naji Collection -- Golden Fur.jpg',
    color: 'Gold Fur',
    quantity: 1,
  },
  {
    productId: 'demo-2',
    name: 'FÉROCE Satchel Bag',
    slug: 'feroce-satchel-bag',
    price: 300.0,
    image: '/images/products/Satchel/Mens -- Satchel bag.jpg',
    color: 'Classic Monogram',
    quantity: 1,
  },
]

const RELATED: Product[] = [
  {
    id: 'rel-1',
    category_id: 'cat-womens',
    name: 'Naji - Gold Fur (XL)',
    slug: 'naji-gold-fur-xl',
    description: 'Statement gold fur luxury bag.',
    price: 443,
    image_urls: ['/images/products/Naji Collection/Gold Fur Bag/Naji Collection -- Golden Fur.jpg'],
    color: 'Gold Fur',
    stock: 5,
    active: true,
    is_new: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'rel-2',
    category_id: 'cat-mens',
    name: 'FÉROCE Satchel Bag',
    slug: 'feroce-satchel-bag',
    description: 'Classic monogram leather satchel.',
    price: 300,
    image_urls: ['/images/products/Satchel/Mens -- Satchel bag.jpg'],
    color: 'Classic Monogram',
    stock: 8,
    active: true,
    is_new: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'rel-3',
    category_id: 'cat-womens',
    name: 'Denim De Ville (Cream & Gold)',
    slug: 'denim-de-ville-cream-gold',
    description: 'Signature cream and gold denim edition.',
    price: 250,
    image_urls: ['/images/products/Denim De Ville Collection/Cream & Gold/Preview 1.jpg'],
    color: 'Cream & Gold',
    stock: 4,
    active: true,
    is_new: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'rel-4',
    category_id: 'cat-mens',
    name: 'FÉROCE Fanny Pack',
    slug: 'feroce-fanny-pack-black',
    description: 'High-utility urban luxury leather belt bag.',
    price: 250,
    image_urls: ['/images/products/Fanny Pack/Mens -- Fanny Pack bag.jpg'],
    color: 'Obsidian Black',
    stock: 6,
    active: true,
    is_new: false,
    created_at: new Date().toISOString(),
  },
]

export default function BagClient() {
  const searchParams = useSearchParams()
  const isDemo = searchParams.get('demo') === '1'

  const { items, totalCount, subtotal } = useCartStore()
  const displayItems = items.length > 0 ? items : (isDemo ? DEMO_ITEMS : [])

  const count = displayItems.reduce((acc, i) => acc + i.quantity, 0)
  const currentSubtotal = displayItems.reduce((acc, i) => acc + i.price * i.quantity, 0)
  const freeShippingDelta = FREE_SHIPPING_THRESHOLD - currentSubtotal
  const shippingProgress = Math.min(100, Math.max(0, (currentSubtotal / FREE_SHIPPING_THRESHOLD) * 100))

  return (
    <div className="bg-white min-h-screen text-navy antialiased">
      {/* ── Top Atelier Subheader / Breadcrumb ── */}
      <section className="pt-28 pb-8 sm:pt-32 sm:pb-10 border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 bg-[#F6F6F8] border border-gray-200/80 text-[11px] font-semibold tracking-wider uppercase text-navy/70 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                Atelier Allocation · Dallas, TX
              </div>
              <h1 className="font-sans font-bold text-navy text-3xl sm:text-5xl md:text-6xl tracking-[-0.035em] leading-[1.05]">
                Your Curated Bag
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <span className="rounded-full px-4 py-2 bg-[#F6F6F8] border border-gray-200/80 text-xs font-semibold tracking-wide text-navy">
                ✦ {count} {count === 1 ? 'Piece' : 'Pieces'} Selected
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Content Section ── */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {displayItems.length === 0 ? (
            <EmptyBag />
          ) : (
            <>
              {/* Two-column layout */}
              <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12 items-start">
                {/* Left — Free Shipping Bar + Item Cards */}
                <div className="lg:col-span-7 xl:col-span-8 space-y-6">
                  {/* Free Shipping Progress Pill Card */}
                  <div className="rounded-[28px] sm:rounded-[32px] bg-[#F6F6F8] border border-gray-200/80 p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                    <div className="flex items-center justify-between text-xs sm:text-sm font-sans font-semibold mb-2.5">
                      {freeShippingDelta <= 0 ? (
                        <span className="text-emerald-700 flex items-center gap-1.5 font-bold">
                          <Sparkles size={14} className="text-gold" />
                          Complimentary US Express Shipping Unlocked
                        </span>
                      ) : (
                        <span className="text-navy/70">
                          Add <strong className="text-navy font-bold">${freeShippingDelta.toFixed(2)}</strong> more for Complimentary Express Shipping
                        </span>
                      )}
                      <span className="text-xs text-navy/40 font-mono">
                        {Math.round(shippingProgress)}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-gray-200/90 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gold transition-all duration-500 ease-out rounded-full"
                        style={{ width: `${shippingProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* List of Cart Items */}
                  <div className="space-y-4">
                    {displayItems.map((item) => (
                      <BagItem key={`${item.productId}-${item.color}`} item={item} />
                    ))}
                  </div>

                  {/* Continue Shopping Link */}
                  <div className="pt-2">
                    <Link
                      href="/shop"
                      className="inline-flex items-center gap-2 rounded-full px-6 py-3 bg-[#F6F6F8] hover:bg-gray-200/80 border border-gray-200/80 text-xs font-semibold uppercase tracking-wider text-navy transition-all duration-200 shadow-xs"
                    >
                      <ArrowLeft size={14} />
                      <span>Continue Exploring Collection</span>
                    </Link>
                  </div>
                </div>

                {/* Right — Order summary */}
                <div className="lg:col-span-5 xl:col-span-4">
                  <div className="lg:sticky lg:top-28">
                    <OrderSummary items={displayItems} />
                  </div>
                </div>
              </div>

              {/* ── Complete the Look / Recommended Pairings ── */}
              <div className="mt-20 sm:mt-28 border-t border-gray-100 pt-16 sm:pt-20">
                <div className="text-center mb-10 sm:mb-14">
                  <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 bg-[#F6F6F8] border border-gray-200/80 text-[11px] font-semibold tracking-wider uppercase text-navy/70 mb-3 shadow-2xs">
                    <Sparkles size={12} className="text-gold" />
                    Atelier Pairings
                  </div>
                  <h2 className="font-sans font-bold text-2xl sm:text-4xl text-navy tracking-[-0.035em]">
                    Complete The Ensemble
                  </h2>
                  <p className="text-xs sm:text-sm text-navy/60 font-sans mt-2 max-w-md mx-auto">
                    Curated accessories and companion silhouettes designed to complement your selection.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                  {RELATED.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>

              {/* ── Bottom Bespoke Concierge Card ── */}
              <div className="mt-16 sm:mt-24 rounded-[32px] sm:rounded-[40px] bg-[#F6F6F8] border border-gray-200/80 p-8 sm:p-14 text-center">
                <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 bg-white border border-gray-200/80 text-[11px] font-semibold tracking-wider uppercase text-navy/70 mb-3 shadow-xs">
                  <Sparkles size={13} className="text-gold" />
                  Dallas Atelier Concierge
                </div>
                <h3 className="font-sans font-bold text-2xl sm:text-3xl text-navy tracking-[-0.03em] mb-2">
                  Bespoke Handbag Commissions & Private Allocations
                </h3>
                <p className="text-sm text-navy/60 max-w-xl mx-auto mb-6 leading-relaxed">
                  Have questions about leather grain, custom monogram hardware, or international delivery? Connect directly with our Dallas atelier concierge.
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
                    Return to Boutique
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
