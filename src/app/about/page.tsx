import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, ShieldCheck, Sparkles, Feather } from 'lucide-react'
import { ScrollReveal } from '@/components/ScrollReveal'

export const metadata: Metadata = {
  title: 'About FÉROCE Fashion — The Next Generation of Black-Owned Luxury',
  description: 'FÉROCE was created with one vision: to build a Black-owned luxury fashion house. Fierce by nature. Luxury by design. Built for legacy in Dallas, Texas.',
}

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen text-navy antialiased">
      {/* 1. Header / Hero Intro */}
      <section className="pt-8 sm:pt-14 pb-8 sm:pb-12 px-5 sm:px-8 lg:px-12 max-w-[1440px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 sm:pb-12 border-b border-gray-100">
          <div className="max-w-4xl">
            {/* Category pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F6F6F8] border border-gray-200/60 text-[11px] font-semibold tracking-wider uppercase text-navy/70 mb-5 sm:mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
              Black-Owned Luxury House · Dallas, TX
            </div>

            {/* Bold geometric display heading with inline pill */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-sans font-bold text-navy tracking-[-0.035em] leading-[1.05]">
              The Next Generation of Black-Owned Luxury
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-[#4A4D52] hover:bg-navy text-white text-xs font-semibold px-6 py-3.5 rounded-full transition-all duration-300 ml-3 sm:ml-4 align-middle tracking-wider uppercase shadow-sm group"
              >
                Explore Catalog
                <ArrowUpRight className="w-3.5 h-3.5 text-white/80 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </h1>
          </div>

          {/* Right-aligned heritage quote */}
          <div className="lg:max-w-xs flex flex-col justify-end pt-4 lg:pt-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#F6F6F8] flex items-center justify-center border border-gray-200">
                <ShieldCheck className="w-4 h-4 text-gold" />
              </div>
              <span className="text-xs font-bold tracking-tight text-navy">Authentic Dallas Craftsmanship</span>
            </div>
            <p className="text-xs sm:text-sm text-navy/60 leading-relaxed font-normal">
              Fierce by nature. Luxury by design. Founded to claim our rightful seat among the world's most recognized global fashion houses.
            </p>
          </div>
        </div>

        {/* Hero Full Showcase Card */}
        <div className="mt-8 sm:mt-10 relative rounded-[32px] sm:rounded-[44px] overflow-hidden aspect-[16/10] sm:aspect-[21/9] min-h-[380px] sm:min-h-[500px] shadow-[0_20px_50px_rgba(0,0,0,0.06)] bg-navy">
          <img
            src="/images/about-hero.jpg"
            alt="FÉROCE atelier craftsmanship and leather detailing"
            className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.92] contrast-[1.05]"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />

          {/* Floating frosted glass pill - Bottom Left */}
          <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10 z-10">
            <div className="backdrop-blur-md bg-white/80 border border-white/70 rounded-full px-5 sm:px-6 py-3 sm:py-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <div>
                <p className="text-xs sm:text-sm font-bold text-navy tracking-tight">Dallas Atelier Craftsmanship</p>
                <p className="text-[10px] sm:text-[11px] text-navy/60 font-medium">Original silhouettes sculpted by hand</p>
              </div>
            </div>
          </div>

          {/* Floating frosted glass pill - Bottom Right */}
          <div className="hidden sm:block absolute bottom-6 sm:bottom-10 right-6 sm:right-10 z-10">
            <div className="backdrop-blur-md bg-white/80 border border-white/70 rounded-full px-5 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
              <span className="text-xs font-bold text-navy uppercase tracking-wider">Built For Generations</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Brand Story & The Vision (NEST Container Card) */}
      <section className="py-10 sm:py-16 px-5 sm:px-8 lg:px-12 max-w-[1440px] mx-auto">
        <ScrollReveal>
          <div className="rounded-[32px] sm:rounded-[44px] bg-[#F6F6F8] p-8 sm:p-14 lg:p-16 border border-gray-100">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
              {/* Left Column: Story */}
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-gray-200/80 text-[11px] font-semibold tracking-wider uppercase text-navy/70">
                  Our Story
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold text-navy tracking-[-0.03em] leading-tight">
                  Built to deserve a place among the world's most recognized names.
                </h2>
                <div className="space-y-4 text-sm sm:text-base text-navy/70 leading-relaxed font-normal">
                  <p>
                    FÉROCE was created with one uncompromising vision: to build a Black-owned luxury fashion house that deserves a place among the world's most recognized and celebrated names.
                  </p>
                  <p>
                    We set out to build a new generation of luxury—one defined by confidence, individuality, meticulous craftsmanship, and fearless self-expression. The name <strong className="font-semibold text-navy">FÉROCE</strong>, meaning fierce, represents the unyielding spirit poured into every stitch, silhouette, and hardware casting we release.
                  </p>
                </div>
              </div>

              {/* Right Column: The Vision Highlight Card */}
              <div className="lg:col-span-6">
                <div className="bg-white rounded-[28px] sm:rounded-[36px] p-8 sm:p-10 border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 text-gold text-[10px] font-bold tracking-widest uppercase">
                    The Vision
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-sans font-bold text-navy tracking-tight leading-snug">
                    The vision is bigger than a handbag. We're building for generations.
                  </h3>
                  <div className="w-12 h-0.5 bg-gold" />
                  <div className="space-y-4 text-sm text-navy/70 leading-relaxed">
                    <p className="text-base font-semibold text-navy">
                      We're not building FÉROCE for one fleeting season. We're building it for generations.
                    </p>
                    <p>
                      The goal is to create a house synonymous with craftsmanship, innovation, exclusivity, and profound cultural impact—a Black-owned luxury house capable of standing proudly on the global fashion stage.
                    </p>
                  </div>
                  <div className="pt-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-navy/50 uppercase tracking-wider">
                      <span>Dallas Atelier</span>
                      <span>•</span>
                      <span>Generational Heritage</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 3. The Symbol Behind the Dove (Feature Showcase) */}
      <section className="py-8 sm:py-14 px-5 sm:px-8 lg:px-12 max-w-[1440px] mx-auto">
        <ScrollReveal>
          <div className="rounded-[32px] sm:rounded-[44px] bg-white border border-gray-200/80 p-8 sm:p-14 lg:p-16 shadow-[0_15px_40px_rgba(0,0,0,0.03)] overflow-hidden relative">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Emblem Presentation */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-56 h-56 sm:w-72 sm:h-72 rounded-full bg-gradient-to-br from-[#F6F6F8] to-[#ECECEE] p-8 flex items-center justify-center border border-gray-200/60 shadow-inner group">
                  <div className="absolute inset-4 rounded-full border border-gold/30" />
                  <img
                    src="/images/feroce-emblem.png"
                    alt="FÉROCE Golden Dove Emblem"
                    className="w-36 h-36 sm:w-44 sm:h-44 object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute -bottom-3 bg-white border border-gray-200 px-4 py-1.5 rounded-full shadow-sm text-[10px] font-bold uppercase tracking-wider text-navy">
                    The Holy Spirit
                  </div>
                </div>
              </div>

              {/* Text Narrative */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F6F6F8] border border-gray-200/80 text-[11px] font-semibold tracking-wider uppercase text-navy/70">
                  <Feather className="w-3.5 h-3.5 text-gold" />
                  The Sacred Symbol
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold text-navy tracking-[-0.03em] leading-tight">
                  The Meaning Behind the Dove
                </h2>
                <div className="space-y-4 text-sm sm:text-base text-navy/70 leading-relaxed font-normal">
                  <p className="text-base sm:text-lg font-semibold text-navy leading-snug">
                    At the heart of FÉROCE is the dove, a symbol that carries a meaning much deeper than fashion.
                  </p>
                  <p>
                    The dove represents the Holy Spirit. It stands as an enduring emblem of peace, divine guidance, and purpose-driven creation. In every piece bearing our golden emblem, there is a testament to unwavering faith and fearless ambition.
                  </p>
                  <p>
                    When you carry FÉROCE, you carry more than elevated luxury—you carry a statement of purpose, protection, and uncompromising dignity.
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 bg-[#4A4D52] hover:bg-navy text-white text-xs font-semibold px-7 py-4 rounded-full transition-all duration-300 tracking-wider uppercase group"
                  >
                    View Emblem Pieces
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 4. Dual Editorial Silhouettes (Denim De Ville & Naji) */}
      <section className="py-8 sm:py-14 px-5 sm:px-8 lg:px-12 max-w-[1440px] mx-auto">
        <ScrollReveal>
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F6F6F8] border border-gray-200/80 text-[11px] font-semibold tracking-wider uppercase text-navy/70 mb-3">
                Signature Silhouettes
              </div>
              <h2 className="text-3xl sm:text-4xl font-sans font-bold text-navy tracking-[-0.03em]">
                Sculpted in Our Dallas Atelier
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-semibold text-navy hover:text-gold uppercase tracking-wider inline-flex items-center gap-1 transition-colors"
            >
              All Collections →
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {/* Card 1: Denim De Ville */}
          <ScrollReveal delay={100}>
            <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden aspect-[4/5] bg-navy group shadow-[0_15px_35px_rgba(0,0,0,0.05)]">
              <img
                src="/images/products/Denim De Ville Collection/Blue & Gold/Preserve_the_EXACT_F_ROCE_hand_2.jpg"
                alt="FÉROCE Denim De Ville collection"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />

              {/* Floating frosted glass pill at bottom */}
              <div className="absolute bottom-6 left-6 right-6 z-10">
                <div className="backdrop-blur-md bg-white/80 border border-white/70 rounded-full p-2 pl-6 pr-2 shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-navy tracking-tight">Denim De Ville</p>
                    <p className="text-[11px] text-navy/60 font-medium">Street-luxury, redefined</p>
                  </div>
                  <Link
                    href="/shop?collection=Denim+De+Ville"
                    className="w-10 h-10 rounded-full bg-[#4A4D52] hover:bg-navy text-white flex items-center justify-center transition-colors"
                    aria-label="View Denim De Ville collection"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 2: The Naji Edit */}
          <ScrollReveal delay={200}>
            <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden aspect-[4/5] bg-navy group shadow-[0_15px_35px_rgba(0,0,0,0.05)]">
              <img
                src="/images/products/naji-red-fur-model.jpg"
                alt="FÉROCE Naji Fur Handbag"
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />

              {/* Floating frosted glass pill at bottom */}
              <div className="absolute bottom-6 left-6 right-6 z-10">
                <div className="backdrop-blur-md bg-white/80 border border-white/70 rounded-full p-2 pl-6 pr-2 shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-navy tracking-tight">The Naji Edit</p>
                    <p className="text-[11px] text-navy/60 font-medium">Bold by nature · Exotic fur & gold</p>
                  </div>
                  <Link
                    href="/shop?collection=Naji"
                    className="w-10 h-10 rounded-full bg-[#4A4D52] hover:bg-navy text-white flex items-center justify-center transition-colors"
                    aria-label="View Naji collection"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 5. From the Founder (Zhanne' Lyles) */}
      <section className="py-10 sm:py-16 px-5 sm:px-8 lg:px-12 max-w-[1440px] mx-auto">
        <ScrollReveal>
          <div className="rounded-[32px] sm:rounded-[44px] bg-[#F6F6F8] p-8 sm:p-14 lg:p-16 border border-gray-100">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Founder Photo */}
              <div className="lg:col-span-5">
                <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden aspect-[3/4] shadow-[0_15px_35px_rgba(0,0,0,0.06)] bg-navy">
                  <img
                    src="/images/founder.jpg"
                    alt="Zhanne' Lyles — Founder and Creative Director of FÉROCE Fashion"
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent" />

                  {/* Floating badge */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="backdrop-blur-md bg-white/85 border border-white/70 rounded-full px-5 py-3 shadow-md">
                      <p className="text-xs font-bold text-navy tracking-tight">Zhanne' Lyles</p>
                      <p className="text-[10px] text-navy/60 font-medium uppercase tracking-wider">Founder & Creative Director</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Founder Narrative */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-gray-200/80 text-[11px] font-semibold tracking-wider uppercase text-navy/70">
                  From the Founder
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold text-navy tracking-[-0.03em] leading-tight">
                  The Story Behind FÉROCE
                </h2>

                <div className="space-y-4 text-sm sm:text-base text-navy/70 leading-relaxed font-normal">
                  <p className="text-base sm:text-lg font-medium text-navy leading-snug">
                    "FÉROCE was born from a place where there wasn't much to start with—except a vision, determination, and a creative mind."
                  </p>
                  <p>
                    I come from the bottom. I didn't start with wealth, connections, or everything already figured out. I started with the desire to create something bigger for myself and my family—something that could change the direction of our future.
                  </p>
                  <p>
                    I always knew I wanted more out of life. Not simply more for myself, but the opportunity to build something my family could be proud of and something future generations could benefit from. Fashion became the place where I could turn that ambition into something real.
                  </p>
                  <p>
                    I've always had a creative mind. I can imagine something before it exists—the colors, materials, details, shapes, and the feeling I want a design to give someone. Eventually, imagining wasn't enough. I wanted to bring those ideas to life. That desire became FÉROCE. Every design represents a piece of my creativity.
                  </p>
                </div>

                <div className="pt-4 flex items-center gap-4 border-t border-gray-200/60">
                  <div className="w-10 h-0.5 bg-gold" />
                  <div>
                    <p className="text-xs font-bold text-navy uppercase tracking-wider">Zhanne' Lyles</p>
                    <p className="text-[11px] text-navy/50">Founder, FÉROCE Fashion · Dallas, TX</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 6. By the Numbers (Sleek Stat Cards) */}
      <section className="py-8 sm:py-12 px-5 sm:px-8 lg:px-12 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { number: '02', label: 'Curated Collections', sub: 'Denim De Ville & Naji' },
            { number: '04', label: 'Signature Silhouettes', sub: 'Handcrafted luxury forms' },
            { number: '100%', label: 'Atelier Precision', sub: 'Hand-assembled in Dallas' },
            { number: 'Dallas', label: 'Conceived & Designed', sub: 'Texas roots, global reach' },
          ].map((stat, i) => (
            <div
              key={i}
              className="rounded-[24px] sm:rounded-[28px] bg-white border border-gray-200/80 p-6 sm:p-8 text-center shadow-[0_8px_25px_rgba(0,0,0,0.02)] hover:border-gold/50 transition-all duration-300"
            >
              <p className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold text-navy tracking-tight mb-2">
                {stat.number}
              </p>
              <p className="text-xs font-bold text-navy uppercase tracking-wider mb-1">
                {stat.label}
              </p>
              <p className="text-[11px] text-navy/50 font-normal">
                {stat.sub}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Legacy Statement & Bottom CTA Banner */}
      <section className="py-12 sm:py-20 px-5 sm:px-8 lg:px-12 max-w-[1440px] mx-auto">
        <div className="rounded-[32px] sm:rounded-[44px] bg-[#0A1128] text-white p-10 sm:p-16 lg:p-20 text-center relative overflow-hidden shadow-2xl">
          {/* Background Dove Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <img
              src="/images/feroce-emblem.png"
              alt=""
              className="w-[500px] h-[500px] object-contain"
              aria-hidden="true"
            />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-[11px] font-semibold tracking-wider uppercase text-gold">
              <Sparkles className="w-3.5 h-3.5" />
              The Beginning of a Legacy
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-sans font-bold tracking-[-0.03em] leading-tight">
              This isn't simply another fashion brand. It's the beginning of a legacy.
            </h2>

            <p className="text-sm sm:text-base text-white/70 max-w-xl mx-auto leading-relaxed">
              Fierce by nature. Luxury by design. Built for legacy. Explore our collections and discover the bag that defines your statement.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/shop"
                className="bg-gold hover:bg-[#e0bc43] text-navy text-xs font-bold px-8 py-4 rounded-full transition-all duration-300 tracking-wider uppercase shadow-lg inline-flex items-center gap-2 group"
              >
                Shop The Collection
                <ArrowUpRight className="w-3.5 h-3.5 text-navy transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                href="/register"
                className="backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold px-8 py-4 rounded-full transition-all duration-300 tracking-wider uppercase inline-flex items-center gap-2"
              >
                Join The Circle
                <ArrowUpRight className="w-3.5 h-3.5 text-white/70" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
