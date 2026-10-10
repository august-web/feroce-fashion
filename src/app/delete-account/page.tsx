import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Account & Data Deletion | Feroce',
  description: 'How to request deletion of your FÉROCE account and associated personal data.',
}

export default function DeleteAccountPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative h-[40vh] min-h-[280px] flex items-end">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/images/about-hero.jpg)' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/50 to-transparent" />
        <div className="relative z-10 w-full px-6 pb-12 md:px-16 md:pb-16">
          <p className="font-label text-[11px] uppercase tracking-[0.3em] text-gold mb-3">Your Account</p>
          <h1 className="font-serif text-4xl md:text-5xl text-white mb-2">Account &amp; Data Deletion</h1>
          <p className="text-white/70 text-sm">Request deletion of your FÉROCE account and personal data</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <p className="text-[#6b6b6b] text-sm leading-relaxed mb-6">
          You can request deletion of your FÉROCE account and the personal data associated with it at any time.
          This applies to the FÉROCE mobile app and to ferocefashionff.com.
        </p>

        <h2 className="font-serif text-2xl text-navy mb-6 mt-8">Delete your account in the FÉROCE app</h2>
        <ol className="list-decimal list-inside text-[#6b6b6b] text-sm leading-relaxed mb-6 space-y-2">
          <li>Open the FÉROCE app and sign in to your account.</li>
          <li>Go to <span className="text-navy">Account &rarr; Settings</span>.</li>
          <li>Tap <span className="text-navy">Delete Account</span>, then confirm <span className="text-navy">Request Deletion</span>.</li>
          <li>Our team is notified immediately and completes the permanent deletion of your account within 30 days.</li>
        </ol>

        <h2 className="font-serif text-2xl text-navy mb-6 mt-8">Request deletion by email</h2>
        <p className="text-[#6b6b6b] text-sm leading-relaxed mb-6">
          If you cannot access your account, email us at{' '}
          <a className="text-gold underline" href="mailto:ferocefashionff@gmail.com">ferocefashionff@gmail.com</a>{' '}
          from the email address associated with your account. We will verify the request and delete your account
          and personal data within 30 days.
        </p>

        <h2 className="font-serif text-2xl text-navy mb-6 mt-8">What is deleted</h2>
        <p className="text-[#6b6b6b] text-sm leading-relaxed mb-6">
          Deletion permanently removes your name, email address, login credentials, saved shipping addresses, and
          wishlist. This cannot be undone. Order records are retained for legal and accounting purposes but are
          unlinked from your identity, so they can no longer be associated with you.
        </p>

        <h2 className="font-serif text-2xl text-navy mb-6 mt-8">Contact</h2>
        <p className="text-[#6b6b6b] text-sm leading-relaxed">
          Questions about deletion or your data? Contact us at Ferocefashionff@gmail.com. See also our{' '}
          <a className="text-gold underline" href="/privacy">Privacy Policy</a>.
        </p>
      </section>
    </main>
  )
}
