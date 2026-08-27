import type { Metadata } from 'next'
import Link from 'next/link'
import { ScrollReveal } from '@/components/ScrollReveal'

export const metadata: Metadata = {
  title: 'About — FÉROCE',
  description: 'The next generation of Black-owned luxury. Fierce by nature. Luxury by design. Built for legacy.',
}

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] md:h-[70vh] overflow-hidden">
        <img src="/images/about-hero.jpg" alt="Féroce craftsmanship" className="absolute inset-0 h-full w-full object-cover object-center" fetchPriority="high" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/30 to-navy/10" />
        <div className="relative z-10 flex h-full items-end px-5 pb-12 md:items-center md:pb-0 md:px-12 lg:px-16">
          <div className="mx-auto max-w-7xl w-full">
            <p className="label mb-4 text-gold">Our Story</p>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-[1.08] max-w-2xl">
              The Next Generation of<br />
              <span className="italic text-gold">Black-Owned</span> Luxury.
            </h1>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="bg-cream py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <ScrollReveal>
            <div className="w-12 h-px bg-gold mx-auto mb-10" />
            <p className="label mb-6 text-center text-gold">Our Story</p>
            <div className="space-y-6 text-sm sm:text-base text-navy/70 leading-relaxed font-light text-center">
              <p className="font-serif text-xl sm:text-2xl text-navy leading-relaxed">FÉROCE was created with one vision: to build a Black-owned luxury fashion house that deserves a place among the world's most recognized names.</p>
              <p>FÉROCE was created with a vision: to build a new generation of luxury—one defined by confidence, individuality, craftsmanship, and fearless self-expression.</p>
              <p>The name FÉROCE, meaning fierce, represents the spirit behind everything we create.</p>
            </div>
            <div className="w-12 h-px bg-gold mx-auto mt-10" />
          </ScrollReveal>
        </div>
      </section>

      {/* The Vision */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-5 md:px-8">
          <ScrollReveal>
            <div className="text-center">
              <p className="label mb-6 text-gold">The Vision</p>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold text-navy mb-8 leading-snug">The Vision Is Bigger Than a Handbag</h2>
              <div className="space-y-6 text-sm sm:text-base text-navy/70 leading-relaxed font-light max-w-2xl mx-auto">
                <p className="font-serif text-lg sm:text-xl text-navy leading-relaxed">We're not building FÉROCE for one season.</p>
                <p className="font-serif text-lg sm:text-xl text-navy leading-relaxed">We're building it for generations.</p>
                <p>The goal is to create a name that becomes synonymous with craftsmanship, innovation, exclusivity, and cultural impact—a Black-owned luxury house capable of standing proudly on the global fashion stage.</p>
              </div>
            </div>
            <div className="w-12 h-px bg-gold mx-auto mt-12" />
          </ScrollReveal>
        </div>
      </section>      {/* The Meaning Behind the Dove */}
      <section className="bg-cream py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <ScrollReveal>
            <div className="text-center">
              <p className="label mb-6 text-gold">The Symbol</p>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold text-navy mb-8 leading-snug">The Meaning Behind the Dove</h2>
              <div className="space-y-6 text-sm sm:text-base text-navy/70 leading-relaxed font-light max-w-2xl mx-auto">
                <p className="font-serif text-lg sm:text-xl text-navy leading-relaxed">At the heart of FÉROCE is the dove, a symbol that carries a meaning much deeper than fashion.</p>
                <p className="font-serif text-lg sm:text-xl text-navy leading-relaxed">The dove represents the Holy Spirit.</p>
              </div>
            </div>
            <div className="w-12 h-px bg-gold mx-auto mt-12" />
          </ScrollReveal>
        </div>
      </section>

{/* Editorial Image Strip */}
      <section className="grid md:grid-cols-2">
        <div className="relative aspect-[4/5] md:aspect-auto md:h-[600px] overflow-hidden">
          <img src="/images/products/Denim De Ville Collection/Blue & Gold/Preserve_the_EXACT_F_ROCE_hand_2.jpg" alt="Feroce Denim De Ville street style" className="h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 md:p-10">
            <p className="label text-gold mb-2">Denim De Ville</p>
            <p className="font-serif text-xl md:text-2xl text-white font-semibold">Street-luxury, redefined.</p>
          </div>
        </div>
        <div className="relative aspect-[4/5] md:aspect-auto md:h-[600px] overflow-hidden">
          <img src="/images/products/Naji Collection/Maroon Fur Bag/Main-Preview.jpg" alt="Feroce Naji craftsmanship" className="h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
          <div className="absolute bottom-0 right-0 p-6 md:p-10 text-right">
            <p className="label text-gold mb-2">Naji</p>
            <p className="font-serif text-xl md:text-2xl text-white font-semibold">Bold by nature.</p>
          </div>
        </div>
      </section>

            {/* Founder */}
      <section className="bg-cream py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-5 md:px-8">
          <ScrollReveal>
            <div className="grid md:grid-cols-[1fr_2fr] gap-10 md:gap-16 items-center">
              <div className="relative aspect-[3/4] overflow-hidden border border-line">
                <img src="/images/founder.jpg" alt="Feroce founder" className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div>
                <p className="label mb-4 text-gold">From the Founder</p>
                <h2 className="font-serif text-2xl md:text-3xl font-semibold text-navy mb-6">The Story Behind FÉROCE</h2>
                <div className="space-y-4 text-sm text-navy/60 leading-relaxed">
                  <p>FÉROCE was born from a place where there wasn't much to start with—except a vision, determination, and a creative mind.</p>
                  <p>I come from the bottom. I didn't start with wealth, connections, or everything already figured out. I started with the desire to create something bigger for myself and my family—something that could change the direction of our future.</p>
                  <p>I always knew I wanted more out of life. Not simply more for myself, but the opportunity to build something my family could be proud of and something future generations could benefit from.</p>
                  <p>Fashion became the place where I could turn that ambition into something real.</p>
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <div className="w-8 h-px bg-gold" />
                  <p className="text-[11px] font-sans uppercase tracking-[0.2em] text-navy/40">FÉROCE Founder</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Turning Creativity Into Reality */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <ScrollReveal>
            <div className="text-center">
              <p className="label mb-6 text-gold">The Process</p>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold text-navy mb-8 leading-snug">Turning Creativity Into Reality</h2>
              <div className="space-y-6 text-sm sm:text-base text-navy/70 leading-relaxed font-light max-w-2xl mx-auto">
                <p className="font-serif text-lg sm:text-xl text-navy leading-relaxed">I've always had a creative mind. I can imagine something before it exists—the colors, materials, details, shapes, and the feeling I want a design to give someone.</p>
                <p className="font-serif text-lg sm:text-xl text-navy leading-relaxed">Eventually, imagining wasn't enough.</p>
                <p className="font-serif text-lg sm:text-xl text-navy leading-relaxed">I wanted to bring those ideas to life.</p>
                <p className="font-serif text-lg sm:text-xl text-navy leading-relaxed">That desire became FÉROCE.</p>
                <p className="font-serif text-lg sm:text-xl text-navy leading-relaxed">Every design represents a piece of my creativity.</p>
              </div>
            </div>
            <div className="w-12 h-px bg-gold mx-auto mt-12" />
          </ScrollReveal>
        </div>
      </section>

{/* By the Numbers */}
      <section className="bg-navy py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-5 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '2', label: 'Collections' },
              { number: '4', label: 'Handbags' },
              { number: '100%', label: 'Handcrafted' },
              { number: 'Dallas', label: 'Designed In' },
            ].map((stat, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div>
                  <p className="font-serif text-3xl md:text-4xl font-semibold text-gold mb-1">{stat.number}</p>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">{stat.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Legacy Statement */}
      <section className="bg-navy py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-5 md:px-8 text-center">
          <ScrollReveal>
            <p className="font-serif text-2xl sm:text-3xl md:text-4xl text-white leading-snug mb-8">
              This isn't simply the arrival of another fashion brand.<br />
              <span className="text-gold">It's the beginning of a legacy.</span>
            </p>
            <div className="w-16 h-px bg-gold mx-auto mb-8" />
            <p className="font-serif text-lg sm:text-xl text-white/60 italic">FÉROCE</p>
            <p className="text-[11px] uppercase tracking-[0.3em] text-gold mt-3">Fierce by nature. Luxury by design. Built for legacy.</p>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cream py-16 md:py-24">
        <div className="mx-auto max-w-2xl px-5 md:px-8 text-center">
          <ScrollReveal>
            <p className="label mb-4 text-gold">Experience FÉROCE</p>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-navy mb-6">Ready to make a statement?</h2>
            <p className="text-sm text-navy/50 mb-8 max-w-md mx-auto leading-relaxed">Explore our collections and find the bag that matches your attitude.</p>
            <div className="flex flex-wrap items-center justify-center gap-4"><Link href="/shop" className="btn-primary py-4 min-h-[48px]">Shop the Collection</Link><Link href="/register" className="inline-flex items-center gap-2 border border-navy text-navy uppercase font-sans font-medium text-[11px] px-9 py-4 min-h-[48px] transition-all duration-300 hover:bg-navy hover:text-white" style={{ letterSpacing: "0.2em" }}>Join the Circle</Link></div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
