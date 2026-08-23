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
          <h2 className="font-serif text-2xl md:text-3xl text-navy mb-8">Returns & Exchanges Policy</h2><div className="space-y-6">  <div className="bg-white border border-line p-6">    <h3 className="text-navy font-serif text-lg mb-3">All Sales Are Final</h3>    <p className="text-[#6b6b6b] text-sm leading-relaxed mb-4">Due to the handcrafted nature of our products and our commitment to quality, <strong className="text-navy">all sales are final</strong>. We do not accept refunds, returns, or exchanges.</p>    <ul className="text-[#6b6b6b] text-sm space-y-2 ml-4">      <li>No refunds will be issued for any purchase</li>      <li>No returns are accepted once an order has been delivered</li>      <li>No exchanges for different sizes, colors, or styles</li>    </ul>  </div>  <div>    <h3 className="text-navy font-serif text-lg mb-2">Damaged or Defective Items</h3>    <p className="text-[#6b6b6b] text-sm">If your item arrives damaged or defective, please contact us within 48 hours of delivery at Ferocefashionff@gmail.com with your order number and photos of the damage. We will review on a case-by-case basis.</p>  </div>  <div>    <h3 className="text-navy font-serif text-lg mb-2">Questions?</h3>    <p className="text-[#6b6b6b] text-sm">If you have any concerns about your order, please reach out to us via email at Ferocefashionff@gmail.com or DM us on Instagram (@ferocefashion_ff). We are committed to ensuring your satisfaction.</p>  </div></div>
        </div>
      </section>

      <section className="relative bg-navy px-6 py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-10"><img src="/logo.png" alt="" className="h-48 w-48 md:h-64 md:w-64 object-contain" /></div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-2xl md:text-3xl text-white mb-4">Need Help?</h2>
          <p className="text-white/70 text-sm mb-8">We&apos;re here to help with any shipping or return questions.</p>
          <Link href="/contact" className="btn-primary bg-white text-navy hover:bg-white/90">CONTACT US</Link>
        </div>
      </section>
    </main>
  )
}
