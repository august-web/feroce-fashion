import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Accessibility | Feroce',
  description: 'Feroce accessibility statement and standards.',
}

export default function AccessibilityPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative h-[40vh] min-h-[280px] flex items-end">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/images/about-hero.jpg)' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/50 to-transparent" />
        <div className="relative z-10 w-full px-6 pb-12 md:px-16 md:pb-16">
          <p className="font-label text-[11px] uppercase tracking-[0.3em] text-gold mb-3">Accessibility</p>
          <h1 className="font-serif text-4xl md:text-5xl text-white mb-2">Accessibility Statement</h1>
          <p className="text-white/70 text-sm">We are committed to making our website accessible to all users.</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <h2 className="font-serif text-2xl text-navy mb-6">Our Commitment</h2>
        <p className="text-[#6b6b6b] text-sm leading-relaxed mb-6">Feroce is committed to ensuring our website is accessible to all people, regardless of disability. We aspire to meet the Web Content Accessibility Guidelines (WCAG) 2.1 level A and are working toward compliance with October 2.1.</p>

        <h2 className="font-serif text-2xl text-navy mb-6 mt-8">What We Do</h2>
        <ul className="text-[#6b6b6b] text-sm space-y-4 ml-4">
          <li>Semantic HTML with proper headings and language structure</li>
          <li>Alternative text for all non-text content</li>
          <li>Keyboard navigation and screen reader support</li>
          <li>Visual focus indicators on interactive elements</li>
          <li>Color contrast ratios meeting WCAG AA standards</li>
          <li>Mobile-responsive design with touch-target requirements</li>
          <li>Form labels associated with inputs</li>
        </ul>

        <h2 className="font-serif text-2xl text-navy mb-6 mt-8">Feedback</h2>
        <p className="text-[#6b6b6b] text-sm leading-relaxed">If you have any difficulties accessing our website, please contact us at Ferocefashionff@gmail.com with a description of the issue and your contact information.</p>
      </section>
    </main>
  )
}
