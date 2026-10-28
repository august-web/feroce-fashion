'use client'

import Link from 'next/link'
import { Sparkles, ArrowUpRight, ShieldCheck, Truck, Clock } from 'lucide-react'

export function DropShowcase() {
  return (
    <section className="bg-white py-12 sm:py-20 border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        {/* Enclosed Editorial Card Container with Generous Rounded Corners */}
        <div className="bg-[#F6F6F8] border border-gray-200/80 rounded-[32px] sm:rounded-[44px] p-6 sm:p-10 lg:p-14 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Visual Column: Dual Rounded Editorial Model Photos */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <div className="relative aspect-[3/4] rounded-[24px] sm:rounded-[32px] overflow-hidden bg-white shadow-sm group">
                  <img
                    src="/images/products/Denim De Ville Collection/Cream & Gold/Preview 2.jpg"
                    alt="Denim De Ville Cream and Gold styling"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute bottom-4 inset-x-4 backdrop-blur-md bg-white/80 border border-white/60 rounded-full px-4 py-2 text-center shadow-xs">
                    <span className="font-sans text-[11px] font-semibold text-navy">
                      Cream & Gold
                    </span>
                  </div>
                </div>

                <div className="relative aspect-[3/4] rounded-[24px] sm:rounded-[32px] overflow-hidden bg-white shadow-sm mt-6 sm:mt-10 group">
                  <img
                    src="/images/products/Denim De Ville Collection/Blue & Gold/Preserve_the_EXACT_F_ROCE_hand_5.jpg"
                    alt="Denim De Ville Blue and Gold on figure"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute bottom-4 inset-x-4 backdrop-blur-md bg-white/80 border border-white/60 rounded-full px-4 py-2 text-center shadow-xs">
                    <span className="font-sans text-[11px] font-semibold text-navy">
                      Blue & Gold
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Editorial Content & Allocation Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-gray-200 rounded-full text-[10px] font-sans font-semibold uppercase tracking-wider text-navy shadow-xs">
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                <span>Flagship Drop • Limited Allocation</span>
              </div>

              <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold text-navy leading-[1.1] tracking-tight">
                The Denim De Ville Series.
              </h2>

              <p className="font-sans text-xs sm:text-sm text-navy/70 leading-relaxed font-normal">
                Street-luxury reimagined with custom gold-plated monogram hardware and artisanal quilted jacquard denim. Seamlessly transitions from double-strap shoulder carry to an urban crossbody silhouette.
              </p>

              {/* Specification Highlights */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs border-b border-gray-200 pb-2.5 font-sans">
                  <span className="text-navy/55">Hardware</span>
                  <span className="font-semibold text-navy">24K Gold-Plated Custom Monogram</span>
                </div>
                <div className="flex items-center justify-between text-xs border-b border-gray-200 pb-2.5 font-sans">
                  <span className="text-navy/55">Craftsmanship</span>
                  <span className="font-semibold text-navy">Quilted Jacquard Denim</span>
                </div>
                <div className="flex items-center justify-between text-xs border-b border-gray-200 pb-2.5 font-sans">
                  <span className="text-navy/55">Production Window</span>
                  <span className="font-semibold text-gold">Limited 4–8 Week Artisan Batch</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                <Link
                  href="/product/denim-de-ville-cream-gold"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-navy hover:bg-gold text-white hover:text-navy px-8 py-4 rounded-full text-xs font-sans font-semibold uppercase tracking-wider transition-all duration-300 shadow-sm"
                >
                  <span>Pre-Order Allocation ($350.00)</span>
                  <ArrowUpRight size={16} />
                </Link>
                <Link
                  href="/shop/womens"
                  className="w-full sm:w-auto inline-flex items-center justify-center text-xs font-sans font-semibold text-navy/70 hover:text-navy py-3 px-5 transition-colors"
                >
                  View Colorways →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
