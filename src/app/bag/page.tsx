'use client'

import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import { BagItem } from '@/components/bag/BagItem'
import { OrderSummary } from '@/components/bag/OrderSummary'
import { EmptyBag } from '@/components/bag/EmptyBag'
import { ScrollReveal } from '@/components/ScrollReveal'

// Related products to show "Complete the Look"
// (slugs + prices match the live products table)
const RELATED = [
  { name: 'Denim De Ville — Cream & Gold', slug: 'denim-de-ville-cream-gold', price: 350, image: '/images/products/Denim De Ville Collection/Cream & Gold/Denim De Ville Collection -- Cream & Gold.jpg' },
  { name: 'Naji — Gold Fur (XL)', slug: 'naji-gold-fur-xl', price: 443, image: '/images/products/Naji Collection/Gold Fur Bag/Naji Collection -- Golden Fur.jpg' },
  { name: 'Denim De Ville — Blue & Gold', slug: 'denim-de-ville-blue-gold', price: 350, image: '/images/products/Denim De Ville Collection/Blue & Gold/Denim De Ville Collection --Blue & Gold.jpg' },
  { name: 'Naji — Maroon Red Fur (XL)', slug: 'naji-maroon-red-fur-xl', price: 443, image: '/images/products/Naji Collection/Maroon Fur Bag/Naji Collection -- Maroon Red Fur.jpg' },
]

export default function BagPage() {
  const { items, totalCount } = useCartStore()
  const count = totalCount()

  return (
    <section className="bg-cream min-h-[60svh]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-10 sm:py-14 md:py-20">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-navy md:text-5xl">
            Your Bag
          </h1>
          <p className="mt-2 text-sm text-navy/50">
            {count} {count === 1 ? 'item' : 'items'}
          </p>
          <div className="mt-4 h-px w-16 bg-gold/40" />
        </div>

        {items.length === 0 ? (
          <EmptyBag />
        ) : (
          <>
            {/* Two-column layout */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10">
              {/* Left — Item cards */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <BagItem key={`${item.productId}-${item.color}`} item={item} />
                ))}

                {/* Continue shopping */}
                <div className="pt-4">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 text-[11px] font-sans uppercase tracking-luxury text-navy/50 hover:text-navy transition-colors min-h-[44px]"
                  >
                    <span>←</span>
                    Continue shopping
                  </Link>
                </div>
              </div>

              {/* Right — Order summary */}
              <div className="lg:col-span-1">
                <div className="lg:sticky lg:top-20">
                  <OrderSummary />
                </div>
              </div>
            </div>

            {/* Complete the Look */}
            <div className="mt-16 sm:mt-20 md:mt-28 border-t border-line pt-14 sm:pt-16">
              <ScrollReveal>
                <p className="label mb-3 text-center">Complete the Look</p>
                <h2 className="font-serif text-xl sm:text-2xl font-semibold text-center text-navy mb-10">
                  You Might Also Like
                </h2>
              </ScrollReveal>

              <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 md:grid-cols-4 md:gap-x-6">
                {RELATED.map((p, i) => (
                  <ScrollReveal key={p.slug} delay={i * 80}>
                    <Link href={`/product/${p.slug}`} className="group block">
                      <div className="relative aspect-[4/5] overflow-hidden border border-line bg-white">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                          loading="lazy"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-navy/90 md:translate-y-full md:transition-transform md:duration-400 md:group-hover:translate-y-0">
                          <p className="py-2.5 text-center text-[9px] sm:text-[10px] font-sans uppercase tracking-[0.2em] text-white">
                            Quick View
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 space-y-1">
                        <h3 className="font-serif text-[13px] sm:text-sm font-medium text-navy transition-colors group-hover:text-gold">
                          {p.name}
                        </h3>
                        <p className="text-[11px] sm:text-xs font-medium text-navy">
                          ${p.price.toFixed(2)}
                        </p>
                      </div>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
