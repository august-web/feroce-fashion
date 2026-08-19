import Link from 'next/link'

export function EmptyBag() {
  return (
    <div className="flex flex-col items-center justify-center py-20 sm:py-28 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-line bg-white">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-10 h-10 text-navy/30">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
      </div>
      <h2 className="font-serif text-2xl font-semibold text-navy mb-2">
        Your bag is empty
      </h2>
      <p className="text-sm text-navy/50 max-w-sm mb-8">
        Looks like you haven&apos;t added anything yet. Explore our collection of handcrafted bags.
      </p>
      <Link href="/shop" className="btn-primary min-h-[48px]">
        Start Shopping
      </Link>
    </div>
  )
}
