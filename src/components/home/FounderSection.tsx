'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1] as const

export function FounderSection() {
  return (
    <section className="bg-cream py-16 sm:py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 md:grid-cols-12 md:gap-16 md:px-8 lg:px-12">
        {/* Portrait plate — replace this block with the founder shoot photo */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: EASE }}
          className="md:col-span-5"
        >
          <div className="relative aspect-[3/4] overflow-hidden bg-navy">
            <motion.div
              initial={{ opacity: 0, clipPath: 'inset(10% 0% 10% 0%)' }}
              whileInView={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 1.1, ease: EASE }}
              className="absolute inset-5 border border-gold/30"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
              <span className="font-serif text-[72px] italic leading-none text-gold">F</span>
              <span className="h-px w-10 bg-gold/40" aria-hidden="true" />
              <span className="text-[9px] font-sans uppercase tracking-[0.35em] text-white/50">
                Dallas · Texas
              </span>
            </div>
          </div>
          <p className="mt-4 text-[10px] font-sans uppercase tracking-[0.25em] text-navy/45">
            Zhanne&apos; Lyles — Founder
          </p>
        </motion.div>

        {/* Words */}
        <div className="md:col-span-6 md:col-start-7 flex flex-col justify-center">
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
          >
            <p className="font-serif text-[22px] italic leading-[1.3] text-navy sm:text-[26px] md:text-[30px]">
              I didn&apos;t start with wealth, connections, or everything already figured out. I
              started with the desire to create something bigger for myself and my family.
            </p>
            <footer className="mt-6 flex items-center gap-3">
              <span className="h-px w-8 bg-gold" aria-hidden="true" />
              <cite className="text-[10px] font-sans uppercase not-italic tracking-[0.25em] text-navy/50">
                Zhanne&apos; Lyles, founder
              </cite>
            </footer>
          </motion.blockquote>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
            className="mt-10 border-t border-line pt-8"
          >
            <h2 className="font-serif text-lg text-navy sm:text-xl">
              A Black-owned luxury house, built in Dallas.
            </h2>
            <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-navy/70">
              Structured silhouettes, plush fur, quilted denim, gold-tone hardware. Every FÉROCE
              piece is designed in Dallas and made in small batches — built to be handed down, not
              replaced.
            </p>
            <Link
              href="/about"
              className="mt-7 inline-flex items-center gap-2 text-[11px] font-sans font-medium uppercase text-navy underline-offset-4 transition-colors hover:text-gold"
              style={{ letterSpacing: '0.2em' }}
            >
              Read the full story
              <span aria-hidden="true">→</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
