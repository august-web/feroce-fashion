import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="bg-cream min-h-[70svh] flex items-center">
      <div className="mx-auto max-w-lg px-4 py-16 sm:py-24 text-center">
        <p className="text-[11px] font-sans uppercase tracking-[0.3em] text-gold mb-4">404</p>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-navy mb-4">
          Page Not Found
        </h1>
        <p className="text-sm text-navy/50 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="h-px w-16 bg-gold/40 mx-auto mb-8" />
        <Link
          href="/"
          className="inline-block btn-primary py-4 min-h-[48px]"
        >
          Back to Home
        </Link>
      </div>
    </section>
  )
}
