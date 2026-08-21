'use client'

import Link from 'next/link'
import type { Category } from '@/lib/types'
import { ScrollReveal } from '@/components/ScrollReveal'

const CATEGORY_IMAGES: Record<string, string> = {
  womens: '/images/products/Denim De Ville Collection/Blue & Gold/Denim De Ville Collection --Blue & Gold.jpg',
  mens: '/images/products/Naji Collection/Gold Fur Bag/Naji Collection -- Golden Fur.jpg',
}

interface CategoryIconsProps {
  categories: Category[]
  productCounts: Record<string, number>
}

export function CategoryIcons({ categories, productCounts }: CategoryIconsProps) {
  return (
    <section className='bg-cream py-14 sm:py-20 md:py-28 overflow-hidden'>
      <div className='mx-auto max-w-7xl px-4 md:px-8'>
        <ScrollReveal>
          <p className='label mb-4 text-center'>Shop by Category</p>
          <h2 className='font-serif text-2xl font-semibold text-center text-navy mb-14 md:text-3xl'>
            Find Your Silhouette
          </h2>
        </ScrollReveal>

        <div className='grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-2 md:gap-8 max-w-2xl mx-auto'>
          {categories.map((cat, i) => {
            const img = CATEGORY_IMAGES[cat.slug]
            const count = productCounts[cat.slug] || 0
            return (
              <ScrollReveal key={cat.id} delay={i * 100}>
                <Link href={"/shop/" + cat.slug} className='group flex flex-col items-center gap-5'>
                  <div className='relative flex h-32 w-32 sm:h-40 sm:w-40 items-center justify-center rounded-full border border-line bg-white overflow-hidden transition-all duration-500 group-hover:border-gold group-hover:shadow-[0_8px_30px_rgba(212,175,55,0.15)] group-hover:scale-105 md:h-44 md:w-44'>
                    {img ? (
                      <img src={img} alt={cat.name + " bags"}
                        className='absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110'
                        loading="lazy" />
                    ) : (
                      <span className='font-serif text-4xl text-navy/20'>{cat.name[0]}</span>
                    )}
                    <div className='absolute inset-0 rounded-full border-2 border-transparent transition-all duration-500 group-hover:border-gold/30 group-hover:scale-110' />
                  </div>
                  <div className="text-center">
                    <p className='font-serif text-base font-medium text-navy transition-colors group-hover:text-gold'>
                      {cat.name}
                    </p>
                    <p className='mt-1 text-[10px] uppercase tracking-luxury text-navy/40'>
                      {cat.slug === 'mens' ? 'Coming Soon' : 'Explore Collection'}
                    </p>
                  </div>
                </Link>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}