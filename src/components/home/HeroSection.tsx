'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: 'easeOut' as const, delay },
});

export function HeroSection() {
  return (
    <section
      className="relative flex items-end overflow-hidden bg-navy"
      style={{
        /* Mobile: 150vw matches the 2:3 portrait source exactly, so the frame shows
           in full with no crop. Desktop: near full-viewport height. */
        minHeight: 'min(150vw, 90svh)',
      }}
    >
      <picture className="absolute inset-0">
        <source media="(max-width: 767px)" srcSet="/images/hero-home-mobile.jpg" />
        <img
          src="/images/hero-home-desktop.jpg"
          alt="Four FÉROCE bags — denim, cream, maroon and gold — beneath the house mark"
          fetchPriority="high"
          decoding="async"
          width={720}
          height={419}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      </picture>

      {/* Bottom scrim carries the headline; the left scrim is desktop-only contrast */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(10,17,40,0.92) 0%, rgba(10,17,40,0.72) 20%, rgba(10,17,40,0.28) 44%, transparent 62%)' }}
      />
      <div
        className="absolute inset-0 hidden md:block"
        style={{ background: 'linear-gradient(to right, rgba(10,17,40,0.55) 0%, rgba(10,17,40,0.22) 38%, transparent 66%)' }}
      />

      <div className="relative z-10 w-full px-5 pb-16 sm:px-6 md:px-12 md:pb-20 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <motion.h1 {...fadeUp(0.3)} className="max-w-lg font-serif text-[26px] sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight text-white" style={{ textShadow: '0 2px 14px rgba(0,0,0,0.65), 0 1px 3px rgba(0,0,0,0.5)' }}>
            Fierce elegance, <span className="italic text-gold">structured</span> utility.
          </motion.h1>

          <motion.p {...fadeUp(0.5)} className="mt-4 max-w-md text-[13px] sm:text-sm leading-relaxed font-light text-white/80" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
            Designed in Dallas. Handcrafted for those who refuse to blend in. Every stitch, every clasp — deliberate.
          </motion.p>

          <motion.div {...fadeUp(0.7)} className="mt-7 sm:mt-9 flex flex-wrap items-center gap-6 sm:gap-8">
            <Link href="/shop" className="min-h-[48px] inline-flex items-center bg-white text-navy uppercase font-sans font-medium text-[11px] px-8 sm:px-9 py-4 transition-colors duration-300 hover:bg-gold" style={{ letterSpacing: '0.2em' }}>
              Shop the Collection
            </Link>
            <Link href="/about" className="group flex items-center gap-2 text-[11px] font-sans uppercase text-white/90 transition-colors hover:text-gold" style={{ letterSpacing: '0.2em' }}>
              <span className="underline underline-offset-4 decoration-white/40 group-hover:decoration-gold transition-colors duration-300">About Féroce</span>
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
