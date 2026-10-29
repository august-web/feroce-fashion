'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Sparkles, ShieldCheck } from 'lucide-react'

interface AuthShellProps {
  children: React.ReactNode
}

const CAMPAIGN_IMAGE = '/images/products/Denim De Ville Collection/Cream & Gold/Preview 1.jpg'

export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="bg-white min-h-screen text-navy antialiased flex flex-col justify-between">
      {/* ── Top Bar ── */}
      <header className="w-full border-b border-gray-100 py-4 px-4 sm:px-8">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-[#F6F6F8] hover:bg-gray-200/70 border border-gray-200/80 text-xs font-semibold tracking-wider uppercase text-navy transition-all duration-200 shadow-xs"
          >
            <ArrowLeft size={14} />
            Back to Boutique
          </Link>

          <div className="hidden sm:inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 bg-[#F6F6F8] border border-gray-200/70 text-[10px] font-semibold tracking-widest uppercase text-navy/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Dallas, TX
          </div>
        </div>
      </header>

      {/* ── Main Editorial Split Layout ── */}
      <main className="flex-1 py-10 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* ── Left Column: Editorial Campaign Visual Card (Desktop Only) ── */}
            <div className="hidden lg:block lg:col-span-5 relative">
              <div className="relative aspect-[3/4] rounded-[40px] overflow-hidden bg-[#ECECEE] shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-gray-100">
                <img
                  src={CAMPAIGN_IMAGE}
                  alt="FÉROCE Atelier Campaign"
                  className="h-full w-full object-cover object-[50%_20%]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />

                {/* Top Badge */}
                <div className="absolute top-6 left-6 z-10">
                  <span className="backdrop-blur-md bg-white/80 border border-white/60 text-navy text-[10px] font-sans font-semibold tracking-wider uppercase px-4 py-1.5 rounded-full shadow-xs">
                    • Dallas Fashion Vault
                  </span>
                </div>

                {/* Bottom Quote Capsule */}
                <div className="absolute bottom-6 inset-x-6 z-10 backdrop-blur-md bg-white/85 border border-white/70 rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
                  <p className="font-serif italic text-xs sm:text-[13px] text-navy/90 leading-relaxed mb-3">
                    &ldquo;Each silhouette is an intentional manifestation of faith, precision Dallas craftsmanship, and generational luxury.&rdquo;
                  </p>
                  <div className="flex items-center justify-between border-t border-gray-200/60 pt-3">
                    <div>
                      <p className="text-[11px] font-bold font-sans text-navy tracking-tight">
                        Zhanne&apos; Lyles
                      </p>
                      <p className="text-[9px] text-navy/55 uppercase tracking-wider font-semibold">
                        Founder & Creative Director
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 bg-gold/15 text-navy text-[9px] font-bold uppercase tracking-wider">
                      <Sparkles size={10} className="text-gold" />
                      Dallas, TX
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right Column: Form Container Card ── */}
            <div className="w-full lg:col-span-7 max-w-xl mx-auto">
              <div className="rounded-[36px] sm:rounded-[44px] bg-[#F6F6F8] border border-gray-200/80 p-8 sm:p-12 md:p-14 shadow-[0_8px_32px_rgba(0,0,0,0.03)]">
                {/* Emblem Header */}
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-white border border-gray-200/80 flex items-center justify-center p-3 shadow-xs">
                    <img
                      src="/images/feroce-emblem.png"
                      alt="FÉROCE Emblem"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {children}

                {/* Security Tag */}
                <div className="mt-8 pt-6 border-t border-gray-200/60 flex items-center justify-center gap-2 text-[10px] font-medium uppercase tracking-widest text-navy/45">
                  <ShieldCheck size={13} className="text-navy/50" />
                  <span>256-Bit Encrypted Client Access</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
