'use client'

import { useState } from 'react'

interface WhatFitsProps {
  dimensions?: string
  strapDrop?: string
  capacityItems?: string[]
}

const DEFAULT_CAPACITY = [
  'iPhone 16 Pro Max',
  'Compact Cardholder / Wallet',
  'Keys & Key Fob',
  'Lipstick & Compact',
  'Sunglasses in Soft Pouch',
  'Hand Sanitizer / Mint Tin'
]

export function WhatFitsAccordion({
  dimensions = '8.5" W × 5.5" H × 2.5" D',
  strapDrop = '21" – 24" adjustable (crossbody or double-strap shoulder)',
  capacityItems = DEFAULT_CAPACITY,
}: WhatFitsProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-line">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 text-left min-h-[48px] group"
      >
        <span className="font-serif text-sm font-medium text-navy group-hover:text-gold transition-colors">
          What Fits Inside & Dimensions
        </span>
        <span className={`text-lg text-navy/40 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
          +
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="space-y-3.5 text-xs text-navy/70">
          <div className="bg-cream/60 p-3.5 border border-line/70 space-y-1.5">
            <p>
              <strong className="font-medium text-navy">Exterior Measurements:</strong> {dimensions}
            </p>
            <p>
              <strong className="font-medium text-navy">Strap Drop:</strong> {strapDrop}
            </p>
          </div>

          <div>
            <p className="font-sans text-[10px] uppercase tracking-luxury text-navy/50 font-semibold mb-2">
              Tested Interior Capacity:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {capacityItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-white border border-line/60 p-2 text-[11px] text-navy/80">
                  <span className="text-gold font-bold text-xs">✓</span>
                  <span className="truncate">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
