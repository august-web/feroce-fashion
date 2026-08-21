import type { Metadata } from 'next'
import Link from 'next/link'
import { ScrollReveal } from '@/components/ScrollReveal'

export const metadata: Metadata = {
  title: 'About — FÉROCE',
  description: 'Designed in Dallas. Handcrafted for those who refuse to blend in.',
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
              Designed in Dallas.<br />
              <span className="italic text-gold">Handcrafted</span> for those who refuse to blend in.
            </h1>
          </div>
        </div>
      </section>

      {/* Brand Statement */}
      <section className="bg-cream py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-5 md:px-8 text-center">
          <ScrollReveal>
            <div className="w-12 h-px bg-gold mx-auto mb-8" />
            <p className="font-serif text-xl sm:text-2xl md:text-3xl text-navy leading-relaxed">
              Feroce was born from a single belief: luxury should have attitude.
              Every stitch, every clasp, every silhouette — deliberate. We design
              handbags for people who walk into a room and do not ask for attention.
              They command it.
            </p>
            <div className="w-12 h-px bg-gold mx-auto mt-8" />
          </ScrollReveal>
        </div>
      </section>

      {/* Three Pillars */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <ScrollReveal>
            <p className="label mb-3 text-center">What We Stand For</p>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-navy text-center mb-14">The Feroce Standard</h2>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-10 md:gap-12">
            {[
              { icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>, title: 'Craftsmanship', description: 'Every Feroce bag is handcrafted by skilled artisans using premium materials — Italian calfskin, gold-plated hardware, and meticulous attention to detail.' },
              { icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>, title: 'Design', description: 'Structured utility meets fierce elegance. Our designs are bold without being loud — clean lines, rich textures, and a silhouette that holds its shape.' },
              { icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>, title: 'Attitude', description: 'The attitude is Feroce. We do not follow trends — we set the standard. Our bags are for the bold, the confident, the ones who know exactly who they are.' },
            ].map((pillar, i) => (
              <ScrollReveal key={i} delay={i * 150}>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-5 flex items-center justify-center border border-gold/40 text-gold">{pillar.icon}</div>
                  <h3 className="font-serif text-lg font-semibold text-navy mb-3">{pillar.title}</h3>
                  <p className="text-sm text-navy/50 leading-relaxed max-w-xs mx-auto">{pillar.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
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

      {/* Numbers */}
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

      {/* CTA */}
      <section className="bg-cream py-16 md:py-24">
        <div className="mx-auto max-w-2xl px-5 md:px-8 text-center">
          <ScrollReveal>
            <p className="label mb-4 text-gold">Experience Feroce</p>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-navy mb-6">Ready to make a statement?</h2>
            <p className="text-sm text-navy/50 mb-8 max-w-md mx-auto leading-relaxed">Explore our collections and find the bag that matches your attitude.</p>
            <Link href="/shop" className="btn-primary inline-block py-4 min-h-[48px]">Shop the Collection</Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
