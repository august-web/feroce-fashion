'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

/**
 * NOTE: The hero image (public/images/hero-home.jpg) has branding text baked
 * into it. If any bags show misspelled branding ("FÉROLE," "TDAX'S," etc.),
 * the source photography must be re-shot or re-sourced. This component
 * handles the layout, overlays, and interactive elements only.
 */
export function HeroSection() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)
  }, [])

  return (
    <section className="relative flex min-h-[82vh] min-h-[500px] sm:min-h-[600px] items-end overflow-hidden">
      {/* ── Hero Image ── */}
      <picture className="absolute inset-0">
        <source
          media="(max-width: 767px)"
          srcSet="/images/hero-home.jpg"
        />
        <source
          media="(min-width: 768px)"
          srcSet="/images/hero-home.jpg"
        />
        <img
          src="/images/hero-home.jpg"
          alt="FÉROCE handbag collection"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-center motion-safe:transition-transform motion-safe:duration-100 motion-safe:ease-out"
          style={{
            objectPosition: '50% 30%',
          }}
        />
      </picture>

      {/* ── Strong gradient scrim — ensures text contrast on any image ── */}
      {/* Desktop: left-to-right dark scrim behind copy area */}
      <div className="absolute inset-0 hidden md:block"
        style={{
          background: 'linear-gradient(to right, rgba(10,17,40,0.65) 0%, rgba(10,17,40,0.4) 35%, rgba(10,17,40,0.1) 60%, transparent 100%)',
        }}
      />
      {/* Desktop: bottom-to-top dark scrim */}
      <div className="absolute inset-0 hidden md:block"
        style={{
          background: 'linear-gradient(to top, rgba(10,17,40,0.5) 0%, rgba(10,17,40,0.15) 40%, transparent 70%)',
        }}
      />
      {/* Mobile: bottom-to-top dark scrim for copy legibility */}
      <div className="absolute inset-0 md:hidden"
        style={{
          background: 'linear-gradient(to top, rgba(10,17,40,0.75) 0%, rgba(10,17,40,0.35) 40%, rgba(10,17,40,0.1) 70%, transparent 100%)',
        }}
      />

      {/* ── Content overlay (bottom-left) ── */}
      <div className="relative z-10 w-full px-5 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-32 md:px-12 md:pb-24 md:pt-32 lg:px-16">
        <div className="mx-auto max-w-7xl">
          {/* Label */}
          <p
            className="label mb-5 transition-all duration-700"
            style={{
              color: '#D4AF37',
              opacity: loaded ? 1 : 0,
              transform: loaded ? 'translateY(0)' : 'translateY(16px)',
              transitionDelay: '200ms',
            }}
          >
            The New Standard
          </p>

          {/* Headline — white for contrast against dark scrim */}
          <h1
            className="max-w-lg font-serif text-3xl sm:text-4xl font-semibold leading-[1.08] tracking-tight text-white md:text-6xl lg:text-7xl transition-all duration-900"
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? 'translateY(0)' : 'translateY(24px)',
              transitionDelay: '400ms',
              textShadow: '0 1px 3px rgba(0,0,0,0.3)',
            }}
          >
            Fierce elegance,{' '}
            <span className="italic text-gold">structured</span>{' '}
            utility.
          </h1>

          {/* Body copy — warm light gray for readability */}
          <p
            className="mt-5 sm:mt-6 max-w-md text-xs sm:text-sm leading-relaxed font-light transition-all duration-700"
            style={{
              color: '#c9c9c9',
              opacity: loaded ? 1 : 0,
              transform: loaded ? 'translateY(0)' : 'translateY(16px)',
              transitionDelay: '600ms',
            }}
          >
            Designed in Dallas. Handcrafted for those who refuse to blend in.
            Every stitch, every clasp — deliberate.
          </p>

          {/* CTAs with divider */}
          <div
            className="mt-8 sm:mt-10 flex flex-wrap items-center gap-6 sm:gap-8 transition-all duration-700"
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? 'translateY(0)' : 'translateY(16px)',
              transitionDelay: '800ms',
            }}
          >
            <Link href="/shop" className="btn-primary group relative overflow-hidden min-h-[48px]">
              <span className="relative z-10">Shop the Collection</span>
              <div className="absolute inset-0 bg-gold/20 translate-y-full transition-transform duration-300 group-hover:translate-y-0" />
            </Link>

            {/* Vertical divider */}
            <div className="hidden sm:block h-5 w-px bg-white/30" />

            <Link
              href="/collections"
              className="group flex items-center gap-2 text-[11px] font-sans uppercase text-white/80 transition-colors hover:text-gold"
              style={{ letterSpacing: '0.2em' }}
            >
              <span className="underline underline-offset-4 decoration-white/30 group-hover:decoration-gold transition-colors duration-300">
                View Lookbook
              </span>
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Scroll indicator — larger, more visible ── */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 transition-opacity duration-700"
        style={{ opacity: loaded ? 0.7 : 0, transitionDelay: '1200ms' }}
      >
        <span className="text-[9px] uppercase tracking-[0.3em] text-white/60 font-sans">Scroll</span>
        {/* Animated chevron */}
        <svg
          className="w-4 h-4 text-gold animate-bounce"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </section>
  )
}
