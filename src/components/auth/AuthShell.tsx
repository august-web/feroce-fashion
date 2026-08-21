'use client'

import Link from 'next/link'

interface AuthShellProps {
  children: React.ReactNode
}

export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="bg-cream">
      {/* ── Mobile (<768px): form only, no image ── */}

      {/* ── Tablet banner (768px–1023px) ── */}
      <div className="hidden md:block lg:hidden">
        <div className="relative h-[200px] w-full overflow-hidden">
          <img
            src="/images/products/navy-structured/model/lifestyle-1.jpg"
            alt=""
            className="h-full w-full object-cover object-center"
          />
          {/* Strong scrim for legibility over busy editorial photo */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
          <div className="absolute bottom-4 left-6 z-10">
            <span
              className="font-serif text-2xl font-bold tracking-tight text-gold"
              style={{ textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}
            >
              FÉROCE
            </span>
          </div>
        </div>
      </div>

      {/* ── Desktop split layout ── */}
      <div className="lg:relative lg:grid lg:grid-cols-[45fr_55fr] lg:min-h-[80svh]">
        {/* Left panel — fixed editorial image */}
        <div className="hidden lg:block lg:sticky lg:top-0 lg:h-screen lg:overflow-hidden">
          <img
            src="/images/products/navy-structured/model/lifestyle-1.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          {/* Strong gradient scrim — bottom-heavy for wordmark, full coverage */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
          <div className="absolute bottom-10 left-10 z-10">
            <span
              className="font-serif text-4xl font-bold tracking-tight text-gold"
              style={{ textShadow: '0 2px 12px rgba(0,0,0,0.7)' }}
            >
              FÉROCE
            </span>
          </div>
        </div>

        {/* Right panel — form */}
        <div className="flex items-center justify-center px-5 py-12 sm:px-8 md:py-14 lg:px-20 lg:py-0">
          <div className="w-full max-w-[440px]">
            {children}
          </div>
        </div>
      </div>

      {/* ── Back to FÉROCE link ── */}
      <div className="border-t border-line py-6 text-center">
        <Link
          href="/"
          className="inline-flex items-center min-h-[44px] px-4 text-[10px] font-sans uppercase tracking-[0.15em] text-[#6b6b6b] hover:text-navy transition-colors"
        >
          ← Back to Féroce
        </Link>
      </div>
    </div>
  )
}
