export default function ProductLoading() {
  return (
    <section className="bg-cream min-h-[60svh]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
        {/* Breadcrumb skeleton */}
        <div className="flex gap-2 mb-6 sm:mb-8">
          <div className="h-3 w-12 bg-line/40 animate-pulse" />
          <div className="h-3 w-4 bg-line/40 animate-pulse" />
          <div className="h-3 w-16 bg-line/40 animate-pulse" />
          <div className="h-3 w-4 bg-line/40 animate-pulse" />
          <div className="h-3 w-32 bg-line/40 animate-pulse" />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-14">
          {/* Gallery skeleton */}
          <div>
            <div className="aspect-[4/5] bg-line animate-pulse mb-4" />
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-line/60 animate-pulse" />
              ))}
            </div>
          </div>

          {/* Details skeleton */}
          <div className="space-y-6">
            <div className="h-6 w-20 bg-gold/30 animate-pulse" />
            <div className="h-8 w-64 bg-line animate-pulse" />
            <div className="h-4 w-32 bg-line/60 animate-pulse" />
            <div className="h-6 w-24 bg-line animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-line/40 animate-pulse" />
              <div className="h-4 w-3/4 bg-line/40 animate-pulse" />
            </div>
            <div className="flex gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 w-10 bg-line animate-pulse" />
              ))}
            </div>
            <div className="h-14 w-full bg-navy/20 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  )
}
