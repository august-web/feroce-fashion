'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import Image from 'next/image'

export function FeaturedInfluencer() {
  return (
    <section className='bg-white'>
      <div className='mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* Label */}
          <p className='mb-6 text-center font-sans text-[11px] uppercase tracking-[0.3em] text-gold'>
            As Seen On
          </p>

          {/* Two-column layout */}
          <div className='grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12'>
            {/* Image */}
            <div className='relative overflow-hidden'>
              <div className='relative aspect-[3/4] w-full overflow-hidden md:aspect-[4/5]'>
                <Image
                  src='/images/products/Naji Collection/Gold Fur Bag/Main-Preview.jpg'
                  alt='FÉROCE Naji Gold Fur — as seen on influencer'
                  fill
                  className='object-cover object-center'
                  sizes='(max-width: 768px) 100vw, 50vw'
                />
              </div>
              {/* Gold accent line */}
              <div className='absolute bottom-0 left-0 h-[3px] w-full bg-gold' />
            </div>

            {/* Copy */}
            <div className='flex flex-col items-center gap-6 text-center md:items-start md:text-left'>
              {/* Star rating */}
              <div className='flex items-center gap-1'>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className='fill-gold text-gold' />
                ))}
              </div>

              <p className='max-w-md font-serif text-2xl leading-snug text-navy md:text-3xl lg:text-4xl'>
                &ldquo;The Naji Gold Fur is IT. Everyone asks me where I got it.&rdquo;
              </p>

              <div className='flex flex-col items-center gap-2 md:items-start'>
                <p className='font-sans text-xs uppercase tracking-[0.2em] text-navy/60'>
                  — FÉROCE MUSE
                </p>
                <div className='flex items-center gap-2 text-navy/40'>
                  <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><rect x='2' y='2' width='20' height='20' rx='5' ry='5' /><path d='M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z' /><line x1='17.5' y1='6.5' x2='17.51' y2='6.5' /></svg>
                  <span className='font-sans text-xs'>Verified Purchase</span>
                </div>
              </div>

              {/* CTA */}
              <a
                href='/product/naji-gold-fur-xl'
                className='mt-4 inline-block bg-navy px-8 py-4 font-sans text-[11px] uppercase tracking-[0.2em] text-white transition-all duration-200 hover:bg-navy/90'
              >
                SHOP THE NAJI COLLECTION
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
