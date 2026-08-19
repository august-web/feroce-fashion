'use client'

interface Size {
  label: string
  available: boolean
}

interface SizeSelectorProps {
  sizes: Size[]
  activeSize: string
  onSelect: (size: string) => void
}

export function SizeSelector({ sizes, activeSize, onSelect }: SizeSelectorProps) {
  if (sizes.length <= 1 && sizes[0]?.label === 'One Size') return null

  return (
    <div>
      <p className="label mb-3">
        Size — <span className="normal-case tracking-normal">{activeSize}</span>
      </p>
      <div className="flex flex-wrap gap-2">
        {sizes.map((s) => (
          <button
            key={s.label}
            onClick={() => s.available && onSelect(s.label)}
            disabled={!s.available}
            className={`min-h-[44px] min-w-[44px] px-5 py-2.5 text-[11px] font-sans uppercase tracking-luxury border transition-all duration-300 ${
              activeSize === s.label
                ? 'bg-navy text-white border-navy'
                : s.available
                  ? 'bg-white text-navy border-line hover:border-navy/40'
                  : 'bg-white text-navy/30 border-line cursor-not-allowed line-through'
            }`}
            style={{ letterSpacing: '0.2em' }}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}
