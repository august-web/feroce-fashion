'use client'

import { useState } from 'react'

export function AnnouncementBar() {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div className="relative bg-gold px-4 py-2.5 text-center min-h-[40px] flex items-center justify-center">
      <p className="text-[9px] sm:text-[10px] font-sans uppercase text-navy pr-8 leading-tight">
        <span className="hidden sm:inline">Free Shipping Over $200 — The Attitude is Féroce</span>
        <span className="sm:hidden">Free Shipping Over $200</span>
        <span className="mx-2 text-navy/40 hidden sm:inline">|</span>
        <span className="hidden sm:inline">
          <button className="underline underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy/40 rounded-sm">English</button>
          <span className="mx-1">/</span>
          <button className="underline underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy/40 rounded-sm">USD</button>
        </span>
      </p>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/60 hover:text-navy text-sm w-8 h-8 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-navy/40 rounded-sm"
        aria-label="Close announcement bar"
      >
        ✕
      </button>
    </div>
  )
}
