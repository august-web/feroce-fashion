'use client'

import { Star, ShieldCheck, Sparkles } from 'lucide-react'

const REVIEWS = [
  {
    quote:
      "The pictures were gorgeous, but seeing the cream denim with the gold chain in person blew me away. The stitching and hardware weight are top tier.",
    author: 'Erica T.',
    location: 'Dallas, TX',
    product: 'Denim De Ville - Cream & Gold',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
  },
  {
    quote:
      "Baby this bag is GIVINGGG 😍🔥. It looks and feels expensive. The chain strap lets me wear it as a crossbody for brunch then shoulder for dinner.",
    author: 'Fatima K.',
    location: 'Houston, TX',
    product: 'Denim De Ville - Blue & Gold',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
  },
  {
    quote:
      "The faux fur texture on the Naji bag is unmatched. I got stopped three times on my first night wearing it in Atlanta. Pure street luxury.",
    author: 'Gabrielle S.',
    location: 'Atlanta, GA',
    product: 'Naji - Gold Fur (XL)',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&h=120&q=80',
  },
]

export function ReviewsSection() {
  return (
    <section className="bg-white py-16 sm:py-24 border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-6">
          <div>
            <span className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-gold block mb-2">
              Social Proof & Trust
            </span>
            <h2 className="font-sans text-3xl sm:text-5xl font-bold tracking-tight text-navy leading-[1.1]">
              Client Impressions
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center text-gold">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="fill-gold text-gold" />
              ))}
            </div>
            <span className="font-sans text-xs font-bold text-navy">
              5.0 / 5.0 Rating Across 500+ Atelier Orders
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {REVIEWS.map((rev, idx) => (
            <div
              key={idx}
              className="rounded-[28px] sm:rounded-[36px] p-8 sm:p-10 bg-[#F6F6F8] border border-gray-200/70 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] transition-all duration-300"
            >
              <div>
                <div className="flex items-center gap-1 text-gold mb-5">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={14} className="fill-gold text-gold" />
                  ))}
                </div>
                <p className="font-sans text-sm sm:text-base text-navy/85 leading-relaxed font-normal">
                  “{rev.quote}”
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.avatar}
                    alt={rev.author}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-xs"
                  />
                  <div>
                    <p className="font-sans text-xs font-bold text-navy">{rev.author}</p>
                    <p className="text-[10px] text-navy/50 font-sans">{rev.location}</p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-gray-200 rounded-full text-[9px] font-sans font-semibold text-navy/70 uppercase tracking-wider">
                  <ShieldCheck size={12} className="text-gold" />
                  <span>Verified</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
