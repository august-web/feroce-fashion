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
      {/* Left fade mask — wider on mobile for proper edge softening */}
      <div className="absolute inset-y-0 left-0 z-10 w-16 md:w-24 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none" />
      {/* Right fade mask — wider on mobile */}
      <div className="absolute inset-y-0 right-0 z-10 w-16 md:w-24 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none" />

      <div className="flex w-max animate-marquee will-change-transform">
        {/* Triple the items for seamless infinite loop */}
        {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
          <span
            key={i}
            className="mx-6 md:mx-8 whitespace-nowrap text-[10px] font-sans uppercase tracking-[0.3em] text-navy/40 select-none"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
