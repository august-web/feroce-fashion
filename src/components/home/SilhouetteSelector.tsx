'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

interface SilhouetteItem {
  name: string
  subtitle: string
  href: string
  image: string
  badge?: string
}

const SILHOUETTES: SilhouetteItem[] = [
  {
    name: 'Denim De Ville',
    subtitle: 'Quilted Indigo & Cream Mini Flap Bags',
    href: '/shop/womens',
    image: '/images/products/Denim De Ville Collection/Cream & Gold/Preview 1.jpg',
    badge: 'Pre-Order',
  },
  {
    name: 'The Naji Fur Edit',
    subtitle: 'Statement Faux-Fur Evening Totes',
    href: '/shop/womens',
    image: '/images/products/naji-red-fur-model.jpg',
    badge: 'Limited Drop',
  },
  {
    name: 'Luxury Fanny Packs',
    subtitle: 'Monogrammed Leather Belt Bags',
    href: '/shop/mens',
    image: '/images/products/Fanny Pack/Mens -- Fanny Pack 2.jpg',
    badge: 'Urban Luxe',
  },
  {
    name: 'Signature Satchels',
    subtitle: 'Top-Handle Structured Crossbody',
    href: '/shop/mens',
    image: '/images/products/Satchel/Mens -- Satchel Preview 1.jpg',
    badge: 'Core Edition',
  },
]

export function SilhouetteSelector() {
  return (
    <section className="bg-white py-16 sm:py-24 border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        {/* Section Header with Reference Typographic Treatment */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-6">
          <div>
            <span className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-gold block mb-2">
              Curated Silhouettes
            </span>
            <h2 className="font-sans text-3xl sm:text-5xl font-bold tracking-tight text-navy leading-[1.1]">
              Explore by Silhouette
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-sans font-semibold text-navy hover:text-gold transition-colors group"
          >
            <span>View All Pieces</span>
            <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* 4-Column Silhouette Cards Shelf */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {SILHOUETTES.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="group relative block aspect-[3/4] sm:aspect-[4/5] rounded-[28px] sm:rounded-[36px] overflow-hidden bg-[#ECECEE] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-all duration-500"
            >
              {/* Product Photography */}
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Top Badge Pill */}
              {item.badge && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="backdrop-blur-md bg-navy/80 text-white text-[9px] font-sans font-semibold tracking-wider uppercase px-3 py-1 rounded-full shadow-xs">
                    {item.badge}
                  </span>
                </div>
              )}

              {/* Signature Floating Frosted Glass Capsule Pill at Bottom */}
              <div className="absolute bottom-4 inset-x-4 sm:bottom-5 sm:inset-x-5 backdrop-blur-md bg-white/75 border border-white/70 rounded-full px-4 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.06)] group-hover:bg-white/95 transition-all">
                <div className="min-w-0 pr-2">
                  <h3 className="font-sans text-xs sm:text-sm font-bold text-navy truncate">
                    {item.name}
                  </h3>
                  <p className="text-[10px] text-navy/55 font-sans truncate">
                    {item.subtitle}
                  </p>
                </div>
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-navy text-white group-hover:bg-gold group-hover:text-navy flex items-center justify-center transition-all duration-300 shadow-sm shrink-0">
                  <ArrowUpRight size={15} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
