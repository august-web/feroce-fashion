export default function WishlistLoading() {
  return (
    <section className="bg-cream min-h-[60svh]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 md:px-8 py-10 sm:py-14 md:py-20">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <div className="h-3 w-24 animate-pulse bg-line/40 mb-3" />
          <div className="h-9 w-40 animate-pulse bg-line sm:h-10" />
          <div className="mt-4 h-px w-16 bg-gold/40" />
        </div>

        <div className="mb-6 h-3 w-20 animate-pulse bg-line/40" />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6" aria-hidden="true">
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              <div className="relative aspect-[4/5] overflow-hidden border border-line bg-white">
                <div className="absolute inset-0 animate-pulse bg-line/40" />
              </div>
              <div className="mt-3 space-y-1.5">
                <div className="h-4 w-3/4 animate-pulse bg-line/60" />
                <div className="h-3 w-1/3 animate-pulse bg-line/40" />
                <div className="flex items-center justify-between">
                  <div className="h-4 w-14 animate-pulse bg-line" />
                  <div className="h-4 w-4 animate-pulse bg-line/40" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
