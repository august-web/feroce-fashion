'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, ArrowUpRight, Sparkles } from 'lucide-react'
import { useCartStore } from '@/store/cart'

const FEATURED_HERO_PRODUCTS = [
  {
    id: 'hero-card-1',
    name: 'Naji - Gold Fur (XL)',
    price: 443,
    slug: 'naji-gold-fur-xl',
    image: '/images/products/naji-gold-fur-hero.jpg',
    color: 'Gold Fur',
  },
  {
    id: 'hero-card-2',
    name: 'Feroce Luxury Satchel',
    price: 300,
    slug: 'feroce-satchel-bag',
    image: '/images/products/mens-satchel-hero.jpg',
    color: 'Obsidian Black',
  },
  {
    id: 'hero-card-3',
    name: 'Feroce Luxury Fanny Pack',
    price: 250,
    slug: 'feroce-fanny-pack-black',
    image: '/images/products/Fanny Pack/Mens -- Fanny Pack 2.jpg',
    color: 'Dallas Midnight',
  },
]

const CLIENT_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&h=120&q=80',
]

export function HeroSection() {
  const addItem = useCartStore((s) => s.addItem)
  const openMiniCart = useCartStore((s) => s.openMiniCart)

  const handleQuickAdd = (p: typeof FEATURED_HERO_PRODUCTS[0], e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      productId: p.id,
      name: p.name,
      price: p.price,
      image: p.image,
      color: p.color,
      slug: p.slug,
    })
    openMiniCart()
  }

  return (
    <section className="bg-white w-full pt-8 sm:pt-14 pb-16 sm:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        {/* ── TOP SECTION: Asymmetric Editorial Header (Matching Reference Image) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          {/* Left Column: Bold Modern Sans-serif Headline with Inline CTA Capsule */}
          <div className="lg:col-span-8">
            <h1 className="font-sans text-4xl sm:text-6xl lg:text-[72px] font-bold tracking-[-0.03em] leading-[1.08] text-navy">
              <span>Elevated</span>
              <br />
              <span>Style. Luxury with</span>
              <br />
              <span className="inline-flex items-center flex-wrap gap-3.5 sm:gap-5 mt-2">
                <span>FÉROCE</span>
                <Link
                  href="/shop"
                  className="group inline-flex items-center gap-2 bg-[#4A4D52] hover:bg-navy text-white px-5 sm:px-6 py-2.5 sm:py-3.5 rounded-full text-xs sm:text-sm font-medium tracking-normal transition-all duration-300 shadow-sm"
                >
                  <span>Explore Products</span>
                  <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </span>
            </h1>
          </div>

          {/* Right Column: Micro Social-Proof Cluster & Editorial Quote */}
          <div className="lg:col-span-4 flex flex-col justify-end lg:pl-6 pb-2">
            <div className="flex items-center gap-3">
              {/* Overlapping Client Avatars */}
              <div className="flex -space-x-2.5 overflow-hidden">
                {CLIENT_AVATARS.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="Verified Client"
                    className="inline-block h-8 w-8 sm:h-9 sm:w-9 rounded-full ring-2 ring-white object-cover"
                  />
                ))}
              </div>
              <div>
                <p className="font-sans text-xs sm:text-sm font-bold text-navy tracking-tight">
                  15K++ Positive Reviews
                </p>
              </div>
            </div>

            {/* Subtle Divider Line & Fashion Editorial Statement */}
            <div className="mt-4 pt-3 flex items-start gap-4">
              <div className="w-12 h-px bg-gray-300 mt-2 shrink-0" />
              <p className="font-sans text-xs text-navy/60 leading-relaxed max-w-xs font-normal">
                Fierce elegance, structured utility. Sculpted silhouettes, custom gold-plated monogramming, and unyielding Dallas swagger.
              </p>
            </div>
          </div>
        </div>

        {/* ── BOTTOM SECTION: 3-Column Product Showcase Shelf (Matching Reference Image) ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-12 sm:mt-16">
          {FEATURED_HERO_PRODUCTS.map((prod) => (
            <Link
              key={prod.id}
              href={`/product/${prod.slug}`}
              className="group relative block aspect-[3/4] sm:aspect-[4/5] rounded-[28px] sm:rounded-[36px] overflow-hidden bg-[#ECECEE] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-all duration-500"
            >
              {/* On-Figure Fashion Imagery */}
              <img
                src={prod.image}
                alt={prod.name}
                className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="eager"
              />

              {/* Signature Floating Frosted Glass Pill Capsule at the Bottom */}
              <div className="absolute bottom-5 inset-x-5 sm:inset-x-6 backdrop-blur-md bg-white/75 border border-white/70 rounded-full px-5 py-3 flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 group-hover:bg-white/90">
                <span className="font-sans text-sm sm:text-base font-semibold text-navy tracking-tight">
                  ${prod.price.toFixed(2)}
                </span>
                <button
                  type="button"
                  onClick={(e) => handleQuickAdd(prod, e)}
                  aria-label={`Add ${prod.name} to bag`}
                  className="w-10 h-10 rounded-full bg-navy text-white hover:bg-gold hover:text-navy flex items-center justify-center transition-all duration-300 shadow-sm shrink-0"
                >
                  <ShoppingBag size={16} strokeWidth={1.8} />
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
