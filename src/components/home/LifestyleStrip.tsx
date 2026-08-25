'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const STRIP_IMAGES = [
  {
    src: '/images/products/Denim De Ville Collection/Blue & Gold/Preserve_the_EXACT_F_ROCE_hand_2.jpg',
    alt: 'Féroce Denim De Ville — street style',
    label: 'Street Style',
    href: '/product/denim-de-ville-blue-gold',
  },
  {
    src: '/images/products/Satchel/Mens -- Satchel Preview 1.jpg',
    alt: 'Féroce Satchel — men\'s luxury',
    label: 'For Him',
    href: '/product/feroce-satchel-bag',
  },
  {
    src: '/images/products/Naji Collection/Gold Fur Bag/Main-Preview.jpg',
    alt: 'Féroce Naji — craftsmanship',
    label: 'Craftsmanship',
    href: '/product/naji-gold-fur-xl',
  },
  {
    src: '/images/products/Fanny Pack/Mens -- Fanny Pack 3.jpg',
    alt: 'Féroce Fanny Pack — men\'s accessory',
    label: 'Essentials',
    href: '/product/feroce-fanny-pack',
  },
  {
    src: '/images/products/Denim De Ville Collection/Cream & Gold/Preview 1.jpg',
    alt: 'Féroce Denim De Ville Cream — details',
    label: 'Details',
    href: '/product/denim-de-ville-cream-gold',
  },
  {
    src: '/images/products/Naji Collection/Maroon Fur Bag/Main-Preview.jpg',
    alt: 'Féroce Naji Maroon — statement piece',
    label: 'Statement',
    href: '/product/naji-maroon-red-fur-xl',
  },
]

// Duplicate for seamless infinite scroll
const LOOP_IMAGES = [...STRIP_IMAGES, ...STRIP_IMAGES]

export function LifestyleStrip() {
  return (
    <section className='bg-cream py-14 sm:py-20 md:py-28 overflow-hidden'>
      <div className='mx-auto max-w-7xl px-4 md:px-8'>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <p className='label mb-3 text-center'>The World of Féroce</p>
          <h2 className='font-serif text-2xl font-semibold text-center text-navy mb-10 sm:mb-14 md:text-3xl'>
            Made to Be Seen
          </h2>
        </motion.div>

        {/* Auto-scrolling carousel — CSS animation for infinite loop */}
        <div className='group relative'>
          {/* Fade edges */}
          <div className='pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-cream to-transparent md:w-24' />
          <div className='pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-cream to-transparent md:w-24' />

          {/* Scroll container */}
          <div className='flex gap-4 overflow-hidden md:gap-6'>
            <div className='flex gap-4 animate-scroll md:gap-6 md:group-hover:[animation-play-state:paused]'>
              {LOOP_IMAGES.map((img, i) => (
                <Link
                  key={`${img.label}-${i}`}
                  href={img.href}
                  className='group/card relative block aspect-[3/4] min-w-[65vw] snap-center overflow-hidden border border-line sm:min-w-[50vw] md:min-w-[22vw] md:min-w-0 md:flex-shrink-0 md:w-[calc(33.333%-1rem)]'
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className='h-full w-full object-cover transition-transform duration-700 group-hover/card:scale-105'
                    loading='lazy'
                  />

                  {/* Gradient scrim — always visible on mobile, hover on desktop */}
                  <div className='absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent md:opacity-0 md:transition-opacity md:duration-500 md:group-hover/card:opacity-100' />

                  {/* Label */}
                  <div className='absolute bottom-0 left-0 right-0 p-5 sm:p-6 md:translate-y-4 md:opacity-0 md:transition-all md:duration-500 md:group-hover/card:translate-y-0 md:group-hover/card:opacity-100 translate-y-0 opacity-100'>
                    <p
                      className='text-[10px] font-sans uppercase tracking-[0.3em] text-white/95'
                      style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}
                    >
                      {img.label}
                    </p>
                    <p
                      className='mt-1 font-serif text-sm text-white'
                      style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}
                    >
                      Explore →
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
