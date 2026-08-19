'use client'

interface ColorSwatch {
  color: string
  colorHex: string
  inStock: boolean
}

interface ColorSwatchesProps {
  variants: ColorSwatch[]
  activeColor: string
  onSelect: (color: string) => void
}

export function ColorSwatches({ variants, activeColor, onSelect }: ColorSwatchesProps) {
  return (
    <div>
      <p className="label mb-3">
        Color — <span className="normal-case tracking-normal">{activeColor}</span>
      </p>
      <div className="flex gap-3">
        {variants.map((v) => (
          <button
            key={v.color}
            onClick={() => onSelect(v.color)}
            disabled={!v.inStock}
            title={v.inStock ? v.color : `${v.color} (out of stock)`}
            className={`relative h-10 w-10 rounded-full border-2 transition-all duration-300 ${
              activeColor === v.color
                ? 'border-navy ring-2 ring-navy/20'
                : 'border-line hover:border-gold/50'
            } ${!v.inStock ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div
              className="absolute inset-1 rounded-full"
              style={{ backgroundColor: v.colorHex }}
            />
            {/* Out of stock slash */}
            {!v.inStock && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-px w-12 rotate-45 bg-navy/60" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
