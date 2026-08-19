'use client'

interface QuantitySelectorProps {
  quantity: number
  onChange: (qty: number) => void
  max?: number
}

export function QuantitySelector({ quantity, onChange, max = 10 }: QuantitySelectorProps) {
  return (
    <div>
      <p className="label mb-3">Quantity</p>
      <div className="flex items-center border border-line bg-white">
        <button
          onClick={() => onChange(Math.max(1, quantity - 1))}
          disabled={quantity <= 1}
          className="flex h-11 w-11 items-center justify-center text-lg text-navy hover:bg-cream transition-colors disabled:text-navy/20 disabled:cursor-not-allowed"
        >
          −
        </button>
        <span className="flex h-11 w-14 items-center justify-center text-sm font-sans text-navy border-x border-line">
          {quantity}
        </span>
        <button
          onClick={() => onChange(Math.min(max, quantity + 1))}
          disabled={quantity >= max}
          className="flex h-11 w-11 items-center justify-center text-lg text-navy hover:bg-cream transition-colors disabled:text-navy/20 disabled:cursor-not-allowed"
        >
          +
        </button>
      </div>
    </div>
  )
}
