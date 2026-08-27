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
    <section className="relative flex min-h-[70vh] min-h-[500px] sm:min-h-[600px] md:min-h-[82vh] items-end overflow-hidden bg-[#3d3024]">
      {/* Background image */}
      <picture className="absolute inset-0">
        <source media="(max-width: 767px)" srcSet="/images/mobile-hero-home.jpg" />
        <img
          src="/images/hero-home.jpg"
          alt="FÉROCE handbag collection"
          fetchPriority="high"
          decoding="async"
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full md:object-cover md:object-[center_55%] max-md:object-contain max-md:object-top"
          style={{ objectPosition: '48% top' }}
        />
      </picture>

      {/* Scrims — desktop */}
      <div className="absolute inset-0 hidden md:block" style={{ background: 'linear-gradient(to right, rgba(10,17,40,0.88) 0%, rgba(10,17,40,0.7) 30%, rgba(10,17,40,0.3) 55%, transparent 80%)' }} />
      <div className="absolute inset-0 hidden md:block" style={{ background: 'linear-gradient(to top, rgba(10,17,40,0.75) 0%, rgba(10,17,40,0.35) 30%, transparent 55%)' }} />

      {/* Scrims — mobile: gentle overlay at bottom for text readability only */}
      <div className="absolute inset-0 md:hidden" style={{ background: 'linear-gradient(to top, rgba(10,17,40,0.7) 0%, rgba(10,17,40,0.25) 30%, transparent 55%)' }} />

      {/* Content */}
      <div className="relative z-20 w-full px-5 pb-24 pt-12 sm:px-6 sm:pb-28 md:px-12 md:pb-24 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <motion.p {...fadeUp(0.2)} className="label mb-3 md:mb-5 text-[10px] md:text-[11px] hidden sm:block" style={{ color: '#D4AF37' }}>
            The New Standard
          </motion.p>

          <motion.h1 {...fadeUp(0.4)} className="max-w-lg font-serif text-[26px] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold leading-[1.08] tracking-tight text-white" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.5)' }}>
            Fierce elegance, <span className="italic text-gold">structured</span> utility.
          </motion.h1>

          <motion.p {...fadeUp(0.6)} className="mt-3 sm:mt-5 max-w-md text-[13px] sm:text-sm leading-relaxed font-light hidden sm:block" style={{ color: '#e0e0e0', textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
            Designed in Dallas. Handcrafted for those who refuse to blend in. Every stitch, every clasp — deliberate.
          </motion.p>

          <motion.div {...fadeUp(0.8)} className="mt-5 sm:mt-8 flex flex-wrap items-center gap-5 sm:gap-8">
            <Link href="/shop" className="group relative overflow-hidden min-h-[48px] inline-flex items-center bg-navy text-white uppercase font-sans font-medium text-[11px] px-9 py-4 transition-all duration-300 hover:bg-navy hover:text-white hover:shadow-none" style={{ letterSpacing: '0.2em' }}>
              <span className="relative z-10">Shop the Collection</span>
              <div className="absolute inset-0 bg-white/10 translate-y-full transition-transform duration-300 group-hover:translate-y-0" />
            </Link>
            <div className="hidden sm:block h-5 w-px bg-white/30" />
            <Link href="/about" className="group flex items-center gap-2 text-[11px] font-sans uppercase text-white/90 transition-colors hover:text-gold" style={{ letterSpacing: '0.2em' }}>
              <span className="underline underline-offset-4 decoration-white/40 group-hover:decoration-gold transition-colors duration-300">About Féroce</span>
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div {...fadeUp(1.2)} className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-20">
        <span className="text-[9px] uppercase tracking-[0.3em] text-white/70 font-sans">Scroll</span>
        <svg className="w-4 h-4 text-gold animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </motion.div>
    </section>
  );
}
