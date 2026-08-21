import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Feroce',
  description: 'Feroce privacy policy and data protection information.',
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative h-[40vh] min-h-[280px] flex items-end">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/images/about-hero.jpg)' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/50 to-transparent" />
        <div className="relative z-10 w-full px-6 pb-12 md:px-16 md:pb-16">
          <p className="font-label text-[11px] uppercase tracking-[0.3em] text-gold mb-3">Legal</p>
          <h1 className="font-serif text-4xl md:text-5xl text-white mb-2">Privacy Policy</h1>
          <p className="text-white/70 text-sm">Last updated: August 21, 2026</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <h2 className="font-serif text-2xl text-navy mb-6">Information We Collect</h2>
        <p className="text-[#6b6b6b] text-sm leading-relaxed mb-6">Feroce collects personal information you provide directly, such as your name, email address, and payment information. We also collect automatic data such as your IP address, browser type, and device information to improve your experience.</p>

        <h2 className="font-serif text-2xl text-navy mb-6 mt-8">How We Use Your Information</h2>
        <p className="text-[#6b6b6b] text-sm leading-relaxed mb-6">Information we collect is used to process your orders, communicate with you, and improve our services. We do not sell or share your personal information with third-party parties except as required by law.</p>

        <h2 className="font-serif text-2xl text-navy mb-6 mt-8">Security</h2>
        <p className="text-[#6b6b6b] text-sm leading-relaxed mb-6">We use industry-standard security measures to protect your data, including the industry standard. All payment transactions are processed via Stripe&apos;s encrypted payment portal.</p>

        <h2 className="font-serif text-2xl text-navy mb-6 mt-8">Your Rights</h2>
        <p className="text-[#6b6b6b] text-sm leading-relaxed mb-6">You can access, update, or delete your personal information at any time by contacting us at Ferocefashionff@gmail.com.</p>

        <h2 className="font-serif text-2xl text-navy mb-6 mt-8">Cookies</h2>
        <p className="text-[#6b6b6b] text-sm leading-relaxed mb-6">We use cookies to improve your experience. You can control cookie settings through your browser settings.</p>

        <h2 className="font-serif text-2xl text-navy mb-6 mt-8">Contact</h2>
        <p className="text-[#6b6b6b] text-sm leading-relaxed">For questions about this policy, contact us at Ferocefashionff@gmail.com.</p>
      </section>
    </main>
  )
}
