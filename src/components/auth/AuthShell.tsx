'use client'

import Link from 'next/link'

interface AuthShellProps {
  children: React.ReactNode
}

const AUTH_IMAGE = "/images/products/Denim De Ville Collection/Cream & Gold/Preview 1.jpg"

export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="relative min-h-screen">
      {/* ── Full-page background image — all viewports ── */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={AUTH_IMAGE}
          alt=""
          className="h-full w-full object-cover"
          /* Position focal point (model + product) in upper-center area
             so it stays visible above/beside the centered card */
          style={{ objectPosition: '50% 25%' }}
        />
        {/* Soft scrim — keeps photo visible but ensures card contrast */}
        <div className="absolute inset-0 bg-navy/25" />
      </div>

      {/* ── Centered auth card with drop shadow ── */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16">
        <div
          className="w-full max-w-[440px] bg-white/95 backdrop-blur-sm border border-white/60 px-8 py-10 sm:px-10 sm:py-12"
          style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.08)' }}
        >
          {children}
        </div>
      </div>

      {/* ── Back to FÉROCE link ── */}
      <div className="relative z-10 border-t border-white/20 py-6 text-center">
        <Link
          href="/"
          className="inline-flex items-center min-h-[44px] px-4 text-[10px] font-sans uppercase tracking-[0.15em] text-white/70 hover:text-white transition-colors"
        >
          ← Back to Féroce
        </Link>
      </div>
    </div>
  )
}
