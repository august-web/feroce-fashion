'use client'

const TICKER_ITEMS = [
  '✦ Designed in Dallas',
  '✦ Handcrafted Leather',
  '✦ The Attitude is Féroce',
  '✦ Structured Utility',
  '✦ Lifetime Craftsmanship',
  '✦ Bold By Design',
  '✦ Fierce Elegance',
]

export function Marquee() {
  return (
    <div className="relative overflow-hidden border-y border-line bg-white py-4">
      {/* Edge fade masks — prevent text clipping at viewport edges */}
      <div className="absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none" />

      <div className="flex w-max animate-marquee">
        {/* Duplicate for seamless loop */}
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
          <span
            key={i}
            className="mx-8 whitespace-nowrap text-[10px] font-sans uppercase tracking-[0.3em] text-navy/40"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
