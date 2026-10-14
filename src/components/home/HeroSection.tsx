'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: 'easeOut' as const, delay },
});

const HEADLINE = (
  <>
    Fierce elegance, <span className="italic text-gold">structured</span> utility.
  </>
);

export function HeroSection() {
  return (
    <>
      {/* Mobile: full-bleed portrait. The 480px source matches a phone viewport ~1:1,
          so it stays sharp; the 2:3 frame means no cropping at all. */}
      <section className="relative md:hidden isolate overflow-hidden bg-navy aspect-[2/3]">
        <img
          src="/images/hero-home-mobile.jpg"
          alt="Four FÉROCE bags beneath the house mark"
          fetchPriority="high"
          decoding="async"
          width={480}
          height={720}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(10,17,40,0.92) 0%, rgba(10,17,40,0.78) 26%, rgba(10,17,40,0.34) 50%, transparent 68%)' }}
        />
        <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-16">
          <motion.h1 {...fadeUp(0.3)} className="max-w-[19rem] font-serif text-[26px] leading-[1.1] tracking-tight text-white" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}>
            {HEADLINE}
          </motion.h1>
          <motion.p {...fadeUp(0.45)} className="mt-3 max-w-xs text-[13px] leading-relaxed font-light text-white/80" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
            Designed in Dallas. Handcrafted for those who refuse to blend in.
          </motion.p>
          <motion.div {...fadeUp(0.6)} className="mt-7 flex flex-wrap items-center gap-6">
            <Link href="/shop" className="min-h-[48px] inline-flex items-center bg-white text-navy uppercase font-sans font-medium text-[11px] px-8 py-4 transition-colors duration-300 hover:bg-gold" style={{ letterSpacing: '0.2em' }}>
              Shop the Collection
            </Link>
            <Link href="/about" className="group flex items-center gap-2 text-[11px] font-sans uppercase text-white/90 transition-colors hover:text-gold" style={{ letterSpacing: '0.2em' }}>
              <span className="underline underline-offset-4 decoration-white/40 group-hover:decoration-gold transition-colors duration-300">About Féroce</span>
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Desktop: the 720px landscape source is shown at near-native scale in a framed
          panel rather than stretched full-bleed, where it would upscale ~2.7x and blur. */}
      <section className="hidden md:block bg-navy">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-8 py-14 lg:grid-cols-12 lg:px-12 lg:py-20">
          <div className="lg:col-span-5">
            <motion.div {...fadeUp(0.2)} className="h-px w-16 bg-gold/60 mb-7" />
            <motion.h1 {...fadeUp(0.3)} className="max-w-md font-serif text-4xl leading-[1.1] tracking-tight text-white lg:text-5xl xl:text-6xl">
              {HEADLINE}
            </motion.h1>
            <motion.p {...fadeUp(0.5)} className="mt-5 max-w-sm text-sm leading-relaxed font-light text-white/70">
              Designed in Dallas. Handcrafted for those who refuse to blend in. Every stitch, every clasp — deliberate.
            </motion.p>
            <motion.div {...fadeUp(0.7)} className="mt-9 flex flex-wrap items-center gap-7">
              <Link href="/shop" className="min-h-[48px] inline-flex items-center bg-white text-navy uppercase font-sans font-medium text-[11px] px-9 py-4 transition-colors duration-300 hover:bg-gold" style={{ letterSpacing: '0.2em' }}>
                Shop the Collection
              </Link>
              <Link href="/about" className="group flex items-center gap-2 text-[11px] font-sans uppercase text-white/85 transition-colors hover:text-gold" style={{ letterSpacing: '0.2em' }}>
                <span className="underline underline-offset-4 decoration-white/35 group-hover:decoration-gold transition-colors duration-300">About Féroce</span>
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </motion.div>
          </div>
          <motion.div {...fadeUp(0.4)} className="lg:col-span-7">
            <div className="border border-gold/25">
              <img
                src="/images/hero-home-desktop.jpg"
                alt="Four FÉROCE bags — denim, cream, maroon and gold — beneath the house mark"
                fetchPriority="high"
                decoding="async"
                width={720}
                height={419}
                className="block w-full h-auto"
              />
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
