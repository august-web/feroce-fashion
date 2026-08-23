'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const STRIP_IMAGES = [
  {
    src: '/images/products/Denim De Ville Collection/Blue & Gold/Preserve_the_EXACT_F_ROCE_hand_2.jpg',
    alt: 'Féroce Denim De Ville — street style',
    label: 'Street Style',
    href: '/product/denim-de-ville',
  },
  {
    src: '/images/products/Naji Collection/Gold Fur Bag/Main-Preview.jpg',
    alt: 'Féroce Naji — craftsmanship',
    label: 'Craftsmanship',
    href: '/product/naji',
  },
  {
    src: '/images/products/Denim De Ville Collection/Cream & Gold/Preview 1.jpg',
    alt: 'Féroce Denim De Ville Cream — details',
    label: 'Details',
    href: '/product/denim-de-ville',
  },
]

export function LifestyleStrip() {
  return (
    <section className="bg-cream py-14 sm:py-20 md:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <p className="label mb-3 text-center">The World of Féroce</p>
          <h2 className="font-serif text-2xl font-semibold text-center text-navy mb-10 sm:mb-14 md:text-3xl">
            Made to Be Seen
          </h2>
        </motion.div>

        {/* Mobile: horizontal scroll. Desktop: 3-col grid */}
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-3 md:gap-6 md:overflow-visible pb-4 md:pb-0">
          {STRIP_IMAGES.map((img, i) => (
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.15 }}>
              <Link
                href={img.href}
                className="group relative block aspect-[3/4] sm:aspect-[4/5] overflow-hidden border border-line snap-center min-w-[70vw] sm:min-w-[55vw] md:min-w-0"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Stronger scrim — always visible on mobile, fades in on desktop hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent md:opacity-0 md:transition-opacity md:duration-500 md:group-hover:opacity-100" />

                {/* Label — textShadow ensures legibility over any photo */}
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 md:translate-y-4 md:opacity-0 md:transition-all md:duration-500 md:group-hover:translate-y-0 md:group-hover:opacity-100 translate-y-0 opacity-100">
                  <p
                    className="text-[10px] font-sans uppercase tracking-[0.3em] text-white/95"
                    style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}
                  >
                    {img.label}
                  </p>
                  <p
                    className="mt-1 font-serif text-sm text-white"
                    style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}
                  >
                    Explore →
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
