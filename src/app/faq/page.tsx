import type { Metadata } from 'next'
import { FaqJsonLd } from '@/components/seo/JsonLd'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'FAQ | Feroce',
  description: 'Frequently asked questions about Feroce handbags. Shipping, returns, payment methods, and more.',
  alternates: { canonical: 'https://www.ferocefashionff.com/faq' },
}

const faqs = [
  {
    q: 'How do I purchase a Feroce bag?',
    a: 'All purchases are made through our secure Stripe checkout. Browse the collection, select your preferred color, and click "Buy Now" to be redirected to Stripe\'s secure payment page where you can pay by card, Apple Pay, or Google Pay.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit/debit cards, Apple Pay, and Google Pay through our secure Stripe checkout. All transactions are encrypted and processed by Stripe.',
  },
  {
    q: 'How long does shipping take?',
    a: 'Standard shipping takes 5-7 business days within the US. Express shipping (2-3 business days) is available at checkout. International shipping times vary by destination.',
  },
  {
    q: 'Do you ship internationally?',
    a: 'Yes! We ship worldwide. International shipping rates and delivery times vary by destination and will be calculated at checkout.',
  },
  {
    q: 'What is your return policy?',
    a: 'All sales are final. We do not accept refunds, returns, or exchanges. If you have any concerns about your order, please contact us.',
  },
  {
    q: 'How do I care for my Feroce bag?',
    a: 'Store your bag in the included dust bag when not in use. Avoid prolonged exposure to direct sunlight. Clean with a soft, dry cloth. For leather care, use a quality leather conditioner periodically. Avoid contact with water and harsh chemicals.',
  },
  {
    q: 'Are the bags handmade?',
    a: 'Yes. Every Feroce bag is handcrafted using premium Italian calfskin leather and 24K gold-plated hardware. Each piece is hand-stitched in our Dallas atelier.',
  },
  {
    q: 'How can I contact you?',
    a: 'You can email us at Ferocefashionff@gmail.com, DM us on Instagram (@ferocefashion_ff), or visit our Contact page. We typically respond within 24 hours.',
  },
]

export default function FAQPage() {
  const faqItems = faqs.map((f) => ({ question: f.q, answer: f.a }))

  return (
    <>
      <FaqJsonLd items={faqItems} />
      <main className="min-h-screen bg-white">
      <section className="relative h-[40vh] min-h-[280px] flex items-end">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/images/about-hero.jpg)' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/50 to-transparent" />
        <div className="relative z-10 w-full px-6 pb-12 md:px-16 md:pb-16">
          <p className="font-label text-[11px] uppercase tracking-[0.3em] text-gold mb-3">Help Center</p>
          <h1 className="font-serif text-4xl md:text-5xl text-white mb-2">Frequently Asked Questions</h1>
          <p className="text-white/70 text-sm">Everything you need to know about Feroce.</p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <div className="space-y-0">
          {faqs.map((faq, i) => (
            <details key={i} className="group border-b border-line">
              <summary className="flex items-center justify-between py-6 cursor-pointer list-none">
                <h3 className="font-serif text-lg md:text-xl text-navy pr-4">{faq.q}</h3>
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-navy transition-transform duration-200 group-open:rotate-45 text-2xl font-light">+</span>
              </summary>
              <p className="text-[#6b6b6b] text-sm leading-relaxed pb-6">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="bg-cream py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-serif text-2xl md:text-3xl text-navy mb-4">Still Have Questions?</h2>
          <p className="text-[#6b6b6b] text-sm mb-8">We&apos;re here to help. Reach out and we&apos;ll get back to you within 24 hours.</p>
          <Link href="/contact" className="btn-primary">CONTACT US</Link>
        </div>
      </section>
    </main>
    </>
  )
}
