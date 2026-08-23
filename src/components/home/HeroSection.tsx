'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export function HeroSection() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)
  }, [])

  return (
    <section className='relative flex min-h-[85vh] min-h-[540px] sm:min-h-[600px] md:min-h-[82vh] items-end overflow-hidden'>
      {/* Background image */}
      <picture className='absolute inset-0'>
        <source media='(max-width: 767px)' srcSet='/images/hero-home.jpg' />
        <source media='(min-width: 768px)' srcSet='/images/hero-home.jpg' />
        <img
          src='/images/hero-home.jpg'
          alt='FEROCE handbag collection'
          fetchPriority='high'
          decoding='async'
          width={1920}
          height={1080}
          className='absolute inset-0 h-full w-full object-cover'
          style={{ objectPosition: '50% 60%' }}
        />
      </picture>

      {/* ── Scrims ── */}
      <div
        className='absolute inset-0 hidden md:block'
        style={{
          background:
            'linear-gradient(to right, rgba(10,17,40,0.88) 0%, rgba(10,17,40,0.7) 30%, rgba(10,17,40,0.3) 55%, transparent 80%)',
        }}
      />
      <div
        className='absolute inset-0 hidden md:block'
        style={{
          background:
            'linear-gradient(to top, rgba(10,17,40,0.75) 0%, rgba(10,17,40,0.35) 30%, transparent 55%)',
        }}
      />
      <div
        className='absolute inset-0 md:hidden'
        style={{
          background:
            'linear-gradient(to top, rgba(10,17,40,0.92) 0%, rgba(10,17,40,0.65) 20%, rgba(10,17,40,0.4) 40%, rgba(10,17,40,0.25) 60%, transparent 80%)',
        }}
      />

      {/* ── Content overlay (bottom-left) ── */}
      <div className='relative z-20 w-full px-5 pb-24 pt-12 sm:px-6 sm:pb-28 md:px-12 md:pb-24 lg:px-16'>
        <div className='mx-auto max-w-7xl'>
          {/* Eyebrow — hidden on mobile to reduce density */}
          <p
            className='label mb-3 md:mb-5 text-[10px] md:text-[11px] hidden sm:block'
            style={{
              color: '#D4AF37',
              opacity: loaded ? 1 : 0,
              transform: loaded ? 'translateY(0)' : 'translateY(12px)',
              transition: 'all 0.7s',
              transitionDelay: '200ms',
            }}
          >
            The New Standard
          </p>

          {/* Headline */}
          <h1
            className='max-w-lg font-serif text-[26px] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold leading-[1.08] tracking-tight text-white'
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? 'translateY(0)' : 'translateY(16px)',
              transition: 'all 0.9s',
              transitionDelay: '400ms',
              textShadow: '0 2px 12px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.5)',
            }}
          >
            Fierce elegance,{' '}
            <span className='italic text-gold'>structured</span> utility.
          </h1>

          {/* Body copy — hidden on mobile */}
          <p
            className='mt-3 sm:mt-5 max-w-md text-[13px] sm:text-sm leading-relaxed font-light hidden sm:block'
            style={{
              color: '#e0e0e0',
              opacity: loaded ? 1 : 0,
              transform: loaded ? 'translateY(0)' : 'translateY(12px)',
              transition: 'all 0.7s',
              transitionDelay: '600ms',
              textShadow: '0 1px 4px rgba(0,0,0,0.4)',
            }}
          >
            Designed in Dallas. Handcrafted for those who refuse to blend in.
            Every stitch, every clasp — deliberate.
          </p>

          {/* CTA row */}
          <div
            className='mt-5 sm:mt-8 flex flex-wrap items-center gap-5 sm:gap-8'
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? 'translateY(0)' : 'translateY(12px)',
              transition: 'all 0.7s',
              transitionDelay: '800ms',
            }}
          >
            <Link
              href='/shop'
              className='group relative overflow-hidden min-h-[48px] inline-flex items-center bg-navy text-white uppercase font-sans font-medium text-[11px] px-9 py-4 transition-all duration-300 hover:bg-navy hover:text-white hover:shadow-none'
              style={{ letterSpacing: '0.2em' }}
            >
              <span className='relative z-10'>Shop the Collection</span>
              <div className='absolute inset-0 bg-white/10 translate-y-full transition-transform duration-300 group-hover:translate-y-0' />
            </Link>
            <div className='hidden sm:block h-5 w-px bg-white/30' />
            <Link
              href='/shop'
              className='group flex items-center gap-2 text-[11px] font-sans uppercase text-white/90 transition-colors hover:text-gold'
              style={{ letterSpacing: '0.2em' }}
            >
              <span className='underline underline-offset-4 decoration-white/40 group-hover:decoration-gold transition-colors duration-300'>
                View Lookbook
              </span>
              <span className='inline-block transition-transform duration-300 group-hover:translate-x-1'>
                →
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div
        className='absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-20'
        style={{
          opacity: loaded ? 0.8 : 0,
          transition: 'opacity 0.7s',
          transitionDelay: '1200ms',
        }}
      >
        <span className='text-[9px] uppercase tracking-[0.3em] text-white/70 font-sans'>
          Scroll
        </span>
        <svg
          className='w-4 h-4 text-gold animate-bounce'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='M6 9l6 6 6-6' />
        </svg>
      </div>
    </section>
  )
}
