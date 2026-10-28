'use client'

import { formatPrice } from '@/lib/types'

interface InstallmentPillProps {
  price: number
}

export function InstallmentPill({ price }: InstallmentPillProps) {
  // If price is over $40, calculate 4 equal payments
  if (!price || price < 40) return null

  const installmentAmount = (price / 4).toFixed(2)

  return (
    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-navy/70 pt-1 pb-2">
      <span>or 4 interest-free payments of</span>
      <span className="font-semibold text-navy font-sans">${installmentAmount}</span>
      <span>with</span>
      <span className="inline-flex items-center px-1.5 py-0.5 bg-[#FFB3C7]/20 text-[#A01D53] border border-[#FFB3C7]/50 text-[9px] font-bold tracking-tight">
        Klarna
      </span>
      <span>or</span>
      <span className="inline-flex items-center px-1.5 py-0.5 bg-[#B2FCE4]/40 text-[#006E52] border border-[#B2FCE4] text-[9px] font-bold tracking-tight">
        Afterpay
      </span>
    </div>
  )
}
