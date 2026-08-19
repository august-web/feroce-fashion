import Link from 'next/link'

export function EmptyState({ query }: { query?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-line bg-white">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-8 h-8 text-navy/30">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </div>
      <h3 className="font-serif text-xl font-semibold text-navy mb-2">
        No products found
      </h3>
      <p className="text-sm text-navy/50 max-w-sm mb-8">
        {query
          ? `We couldn't find anything matching "${query}". Try a different filter or browse all products.`
          : 'This collection is being curated. Check back soon for new arrivals.'}
      </p>
      <Link href="/shop" className="btn-primary">
        View All Products
      </Link>
    </div>
  )
}
