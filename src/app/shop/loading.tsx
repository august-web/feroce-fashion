export default function ShopLoading() {
  return (
    <section className="bg-cream min-h-[60svh]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-10 sm:py-14 md:py-20">
        {/* Header skeleton */}
        <div className="mb-8 sm:mb-10">
          <div className="h-8 w-48 bg-line animate-pulse mb-3" />
          <div className="h-4 w-80 bg-line/60 animate-pulse mb-2" />
          <div className="h-3 w-24 bg-line/40 animate-pulse" />
        </div>

        {/* Filter pills skeleton */}
        <div className="flex gap-3 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-9 w-24 bg-line animate-pulse" />
          ))}
        </div>

        {/* Product grid skeleton */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4 md:gap-x-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i}>
              <div className="aspect-[4/5] bg-line animate-pulse mb-3" />
              <div className="h-4 w-3/4 bg-line/60 animate-pulse mb-2" />
              <div className="h-3 w-1/2 bg-line/40 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
