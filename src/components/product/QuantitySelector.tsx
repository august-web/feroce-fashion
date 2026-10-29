'use client'

import { Minus, Plus } from 'lucide-react'

interface QuantitySelectorProps {
  quantity: number
  onChange: (qty: number) => void
  max?: number
}

export function QuantitySelector({ quantity, onChange, max = 10 }: QuantitySelectorProps) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wider text-navy/60 mb-2.5">Quantity</p>
      <div className="inline-flex items-center rounded-full border border-gray-200 bg-[#F6F6F8] p-1">
        <button
          onClick={() => onChange(Math.max(1, quantity - 1))}
          disabled={quantity <= 1}
          className="flex h-9 w-9 items-center justify-center rounded-full text-navy hover:bg-white hover:shadow-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Decrease quantity"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="flex w-10 items-center justify-center text-xs font-bold font-sans text-navy">
          {quantity}
        </span>
        <button
          onClick={() => onChange(Math.min(max, quantity + 1))}
          disabled={quantity >= max}
          className="flex h-9 w-9 items-center justify-center rounded-full text-navy hover:bg-white hover:shadow-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Increase quantity"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
