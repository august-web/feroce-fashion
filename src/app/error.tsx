'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('App error:', error)
  }, [error])

  return (
    <section className="bg-cream min-h-[70svh] flex items-center">
      <div className="mx-auto max-w-lg px-4 py-16 sm:py-24 text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center bg-red-50">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-8 w-8 text-red-500 mx-auto">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-navy mb-4">
          Something Went Wrong
        </h1>
        <p className="text-sm text-navy/50 mb-8">
          An unexpected error occurred. Please try again.
        </p>
        <div className="h-px w-16 bg-gold/40 mx-auto mb-8" />
        <button
          onClick={() => reset()}
          className="inline-block btn-primary py-4 min-h-[48px]"
        >
          Try Again
        </button>
      </div>
    </section>
  )
}
