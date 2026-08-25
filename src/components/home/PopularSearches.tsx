'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const SEARCHES = [
  { label: 'Luxury Handbags', href: '/shop' },
  { label: 'Fur Bags', href: '/shop' },
  { label: 'Women\'s Bags', href: '/shop?category=womens' },
  { label: 'Men\'s Bags', href: '/shop?category=mens' },
  { label: 'Crossbody', href: '/shop' },
  { label: 'Structured', href: '/shop' },
  { label: 'Denim Collection', href: '/shop' },
  { label: 'Naji Collection', href: '/shop' },
  { label: 'Designer Tote', href: '/shop' },
  { label: 'Party Bags', href: '/shop' },
  { label: 'Fanny Packs', href: '/shop' },
  { label: 'Satchel', href: '/shop' },
]

export function PopularSearches() {
  return (
    <section className='bg-cream border-t border-line'>
      <div className='mx-auto max-w-7xl px-5 py-14 md:px-10 md:py-20'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className='text-center'
        >
          <p className='mb-3 font-sans text-[11px] uppercase tracking-[0.3em] text-gold'>
            Trending Now
          </p>
          <h2 className='mb-10 font-serif text-2xl text-navy md:text-3xl'>
            Popular Searches
          </h2>

          <div className='flex flex-wrap justify-center gap-3'>
            {SEARCHES.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                <Link
                  href={item.href}
                  className='inline-block border border-line bg-white px-5 py-2.5 font-sans text-[11px] uppercase tracking-[0.15em] text-navy/70 transition-all duration-200 hover:border-gold hover:text-navy hover:shadow-sm'
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
