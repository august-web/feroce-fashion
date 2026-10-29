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
      <p className="text-[11px] font-bold uppercase tracking-wider text-navy/60 mb-2.5">
        Silhouette Size — <span className="text-navy font-semibold">{activeSize}</span>
      </p>
      <div className="flex flex-wrap gap-2">
        {sizes.map((s) => (
          <button
            key={s.label}
            onClick={() => s.available && onSelect(s.label)}
            disabled={!s.available}
            className={`rounded-full px-5 py-2.5 text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
              activeSize === s.label
                ? 'bg-navy text-white shadow-sm'
                : s.available
                  ? 'bg-[#F6F6F8] text-navy/70 border border-gray-200/60 hover:border-gray-300 hover:text-navy'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed line-through'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}
