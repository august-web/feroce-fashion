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

      {/* Brand Story */}
            <section className="bg-cream py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <ScrollReveal>
            <div className="w-12 h-px bg-gold mx-auto mb-10" />
            <p className="label mb-6 text-center text-gold">The Origin</p>
            <div className="space-y-6 text-sm sm:text-base text-navy/70 leading-relaxed font-light text-center">
              <p className="font-serif text-xl sm:text-2xl text-navy leading-relaxed">Feroce was born from a single belief: luxury should have attitude.</p>
              <p>Founded in Dallas, Texas, Feroce began as a question — why does luxury always feel so quiet? So safe? We wanted to build something different: handbags that do not whisper, they speak. Bags with presence, with structure, with a point of view.</p>
              <p>Our name means fierce in French, and that is exactly what we design for. Every piece is handcrafted by skilled artisans using premium materials — Italian calfskin, gold-plated hardware, quilted monogram leather, and fur-textured finishes that demand a second look.</p>
              <p>Designed in Dallas is not just a label — it is a statement. Dallas is bold, unapologetic, and built different. That energy lives in every stitch, every clasp, every silhouette we create. We do not follow trends from Paris or Milan. We set our own standard, right here.</p>
              <p className="font-serif text-lg text-navy">The attitude is Feroce. And it was never meant for everyone.</p>
            </div>
            <div className="w-12 h-px bg-gold mx-auto mt-10" />
          </ScrollReveal>
        </div>
      </section>

      {/* Design Philosophy */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <ScrollReveal>
            <p className="label mb-3 text-center">What We Stand For</p>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-navy text-center mb-14">The Feroce Standard</h2>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-10 md:gap-12">
            {[ { icon: "layers", title: "Craftsmanship", desc: "Every Feroce bag is handcrafted by skilled artisans using premium materials — Italian calfskin, gold-plated hardware, and meticulous attention to detail." }, { icon: "star", title: "Design", desc: "Structured utility meets fierce elegance. Our designs are bold without being loud — clean lines, rich textures, and a silhouette that holds its shape." }, { icon: "heart", title: "Attitude", desc: "The attitude is Feroce. We do not follow trends — we set the standard. Our bags are for the bold, the confident, the ones who know exactly who they are." } ].map((pillar, i) => (
              <ScrollReveal key={i} delay={i * 150}>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-5 flex items-center justify-center border border-gold/40 text-gold">
                    {pillar.icon === "layers" && <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>}
                    {pillar.icon === "star" && <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>}
                    {pillar.icon === "heart" && <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>}
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-navy mb-3">{pillar.title}</h3>
                  <p className="text-sm text-navy/50 leading-relaxed max-w-xs mx-auto">{pillar.desc}</p>
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
                <h2 className="font-serif text-2xl md:text-3xl font-semibold text-navy mb-6">I wanted to build something Dallas had never seen.</h2>
                <div className="space-y-4 text-sm text-navy/60 leading-relaxed">
                  <p>When I started Feroce, people told me luxury had to come from New York or LA. That you could not build a premium handbag brand from Texas. I took that as motivation.</p>
                  <p>Every bag we make is a statement against mediocrity. The quilted monogram leather, the gold-plated F hardware, the structured silhouettes — none of it is accidental. Every detail is a choice, and every choice says the same thing: the attitude is Feroce.</p>
                  <p>We are just getting started. Dallas is home, but the world is the market.</p>
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <div className="w-8 h-px bg-gold" />
                  <p className="text-[11px] font-sans uppercase tracking-[0.2em] text-navy/40">Feroce Founder</p>
                </div>
              </div>
            </div>
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

      {/* CTA */}
      <section className="bg-cream py-16 md:py-24">
        <div className="mx-auto max-w-2xl px-5 md:px-8 text-center">
          <ScrollReveal>
            <p className="label mb-4 text-gold">Experience Feroce</p>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-navy mb-6">Ready to make a statement?</h2>
            <p className="text-sm text-navy/50 mb-8 max-w-md mx-auto leading-relaxed">Explore our collections and find the bag that matches your attitude.</p>
            <div className="flex flex-wrap items-center justify-center gap-4"><Link href="/shop" className="btn-primary py-4 min-h-[48px]">Shop the Collection</Link><Link href="/register" className="inline-flex items-center gap-2 border border-navy text-navy uppercase font-sans font-medium text-[11px] px-9 py-4 min-h-[48px] transition-all duration-300 hover:bg-navy hover:text-white" style={{ letterSpacing: "0.2em" }}>Join the Circle</Link></div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
