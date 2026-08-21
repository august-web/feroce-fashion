import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Shipping & Returns | Feroce',
  description: 'Shipping policies and return information for Feroce handbags.',
}

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative h-[40vh] min-h-[280px] flex items-end">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/images/about-hero.jpg)' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/50 to-transparent" />
        <div className="relative z-10 w-full px-6 pb-12 md:px-16 md:pb-16">
          <p className="font-label text-[11px] uppercase tracking-[0.3em] text-gold mb-3">Details</p>
          <h1 className="font-serif text-4xl md:text-5xl text-white mb-2">Shipping & Returns</h1>
          <p className="text-white/70 text-sm">Everything you need to know.</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <h2 className="font-serif text-2xl md:text-3xl text-navy mb-8">Shipping Policy</h2>
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <div>
            <h3 className="font-serif text-lg text-navy mb-2">United States</h3>
            <p className="text-[#6b6b6b] text-sm leading-relaxed">Standard shipping: 5-7 business days. Express shipping: 2-3 business days ($18 at checkout).</p>
            <p className="text-[#6b6b6b] text-sm leading-relaxed mt-2">All orders over $200 receive free standard shipping within the United States.</p>
          </div>
          <div>
            <h3 className="font-serif text-lg text-navy mb-2">International Shipping</h3>
            <p className="text-[#6b6b6b] text-sm leading-relaxed">We ship worldwide. Rates and delivery times vary by destination and will be calculated at checkout.</p>
          </div>
          <div>
            <h3 className="font-serif text-lg text-navy mb-2">Order Processing</h3>
            <p className="text-[#6b6b6b] text-sm leading-relaxed">Orders are processed within 1-2 business days. You will receive a tracking number via email once your order ships.</p>
          </div>
        </div>
      </section>

      <section className="bg-cream px-6 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl text-navy mb-8">Returns Policy</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-navy font-serif text-lg mb-2">Eligibility</h3>
              <ul className="text-[#6b6b6b] text-sm space-y-2 ml-4">
                <li>Free returns within 30 days of delivery</li>
                <li>Item must be unused, unworn, in original packaging</li>
                <li>Original tags must remain attached</li>
                <li>Shoes must not be worn</li>
              </ul>
            </div>
            <div>
              <h3 className="text-navy font-serif text-lg mb-2">How to Initiate a Return</h3>
              <p className="text-[#6b6b6b] text-sm">Contact us via email at Ferocefashionff@gmail.com or give us a call with your order number.</p>
            </div>
            <div>
              <h3 className="text-navy font-serif text-lg mb-2">Refunds</h3>
              <p className="text-[#6b6b6b] text-sm">Full refund processed within 7-10 business days of receiving your return.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-navy px-6 py-16 md:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-2xl md:text-3xl text-white mb-4">Need Help?</h2>
          <p className="text-white/70 text-sm mb-8">We&apos;re here to help with any shipping or return questions.</p>
          <Link href="/contact" className="btn-primary bg-white text-navy hover:bg-white/90">CONTACT US</Link>
        </div>
      </section>
    </main>
  )
}
