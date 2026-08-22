export default function HomeLoading() {
  return (
    <div className="bg-cream">
      {/* Hero skeleton */}
      <div className="relative h-[70vh] md:h-[82vh] bg-line animate-pulse" />

      {/* Category icons skeleton */}
      <section className="bg-cream py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="h-4 w-32 bg-line/40 animate-pulse mx-auto mb-3" />
          <div className="h-7 w-64 bg-line animate-pulse mx-auto mb-14" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            {[1,2,3,4].map((i) => (
              <div key={i} className="text-center">
                <div className="w-28 h-28 md:w-36 md:h-36 mx-auto rounded-full bg-line animate-pulse mb-4" />
                <div className="h-4 w-20 bg-line/60 animate-pulse mx-auto mb-1" />
                <div className="h-3 w-16 bg-line/40 animate-pulse mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product grid skeleton */}
      <section className="bg-cream py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="h-4 w-24 bg-line/40 animate-pulse mx-auto mb-3" />
          <div className="h-7 w-56 bg-line animate-pulse mx-auto mb-14" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-8 md:gap-x-6">
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
    </div>
  )
}
