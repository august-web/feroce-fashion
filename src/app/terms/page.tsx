import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms & Conditions | Feroce',
  description: 'Feroce terms and conditions of service.',
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative h-[40vh] min-h-[280px] flex items-end">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/images/about-hero.jpg)' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/50 to-transparent" />
        <div className="relative z-10 w-full px-6 pb-12 md:px-16 md:pb-16">
          <p className="font-label text-[11px] uppercase tracking-[0.3em] text-gold mb-3">Legal</p>
          <h1 className="font-serif text-4xl md:text-5xl text-white mb-2">Terms & Conditions</h1>
          <p className="text-white/70 text-sm">Last updated: August 21, 2026</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <div className="space-y-8">
          <div>
            <h2 className="font-serif text-2xl text-navy mb-4">Use of Site</h2>
            <p className="text-[#6b6b6b] text-sm leading-relaxed">You must be at least 18 years old to use our website. Your use of the site is conditional upon compliance with these terms. We reserve the right to modify or terminate services at any time without notice.</p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-navy mb-4">Products & Pricing</h2>
            <p className="text-[#6b6b6b] text-sm leading-relaxed">All products are subject to availability. Prices are subject to change without notice. Weight, dimensions, and colors may vary slightly from product photography.</p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-navy mb-4">Orders & Payment</h2>
            <p className="text-[#6b6b6b] text-sm leading-relaxed">All payments are processed securely via Stripe. We do not store credit card information. Orders are final when confirmed by the payment provider.</p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-navy mb-4">Shipping & Returns</h2>
            <p className="text-[#6b6b6b] text-sm leading-relaxed">We ship worldwide. See our Shipping & Returns page for details. All sales are final. We do not accept refunds, returns, or exchanges.</p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-navy mb-4">Limitation of Liability</h2>
            <p className="text-[#6b6b6b] text-sm leading-relaxed">In no event will Feroce be liable for any indirect, incidental, or consequential damages.</p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-navy mb-4">Governing Law</h2>
            <p className="text-[#6b6b6b] text-sm leading-relaxed">These terms are governed by the laws of the State of Texas.</p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-navy mb-4">Contact</h2>
            <p className="text-[#6b6b6b] text-sm leading-relaxed">For questions about terms, contact us at Ferocefashionff@gmail.com.</p>
          </div>
        </div>
      </section>
    </main>
  )
}
