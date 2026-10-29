'use client'

import { useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'

interface WhatFitsProps {
  dimensions?: string
  strapDrop?: string
  capacityItems?: string[]
}

const DEFAULT_CAPACITY = [
  'iPhone 16 Pro Max',
  'Compact Cardholder / Slim Wallet',
  'Keys & Key Fob',
  'Lipstick & Touch-up Compact',
  'Sunglasses in Soft Pouch',
  'AirPods & Mint Tin',
]

export function WhatFitsAccordion({
  dimensions = '8.5" W × 5.5" H × 2.5" D',
  strapDrop = '21" – 24" adjustable (crossbody or double-strap shoulder)',
  capacityItems = DEFAULT_CAPACITY,
}: WhatFitsProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="rounded-[20px] bg-[#F6F6F8] border border-gray-100 overflow-hidden transition-all duration-200 mt-2">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <span className="text-xs sm:text-sm font-bold text-navy tracking-tight">
          What Fits Inside & Silhouette Dimensions
        </span>
        <ChevronDown
          className={`w-4 h-4 text-navy/50 transition-transform duration-300 ${
            isOpen ? 'rotate-180 text-navy' : ''
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 px-5 ${
          isOpen ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="space-y-4 text-xs text-navy/70 pt-1">
          <div className="bg-white rounded-[16px] p-4 border border-gray-200/80 space-y-1.5 shadow-sm">
            <p>
              <strong className="font-semibold text-navy">Exterior Measurements:</strong> {dimensions}
            </p>
            <p>
              <strong className="font-semibold text-navy">Strap Drop:</strong> {strapDrop}
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider text-navy/50 font-bold mb-2.5">
              Tested Interior Capacity:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {capacityItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                  <span className="text-navy/80 font-medium text-[11px]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
