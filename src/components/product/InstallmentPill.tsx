'use client'

interface InstallmentPillProps {
  price: number
}

export function InstallmentPill({ price }: InstallmentPillProps) {
  if (!price || price < 40) return null

  const installmentAmount = (price / 4).toFixed(2)

  return (
    <div className="inline-flex flex-wrap items-center gap-2 rounded-full bg-[#F6F6F8] border border-gray-200/80 px-4 py-2 text-xs text-navy/70 mt-3">
      <span>or 4 interest-free payments of</span>
      <span className="font-bold text-navy font-sans">${installmentAmount}</span>
      <span>with</span>
      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#FFB3C7]/20 text-[#A01D53] border border-[#FFB3C7]/60 text-[10px] font-bold tracking-tight">
        Klarna
      </span>
      <span>or</span>
      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#B2FCE4]/40 text-[#006E52] border border-[#B2FCE4] text-[10px] font-bold tracking-tight">
        Afterpay
      </span>
    </div>
  )
}
