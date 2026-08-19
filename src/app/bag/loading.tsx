export default function BagLoading() {
  return (
    <section className="bg-cream min-h-[60svh]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-10 sm:py-14 md:py-20">
        {/* Header skeleton */}
        <div className="mb-8 sm:mb-10">
          <div className="h-8 w-40 bg-line animate-pulse mb-3" />
          <div className="h-4 w-16 bg-line/60 animate-pulse" />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10">
          {/* Item cards skeleton */}
          <div className="lg:col-span-2 space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-4 p-4 bg-white border border-line">
                <div className="h-28 w-24 bg-line animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 w-40 bg-line/60 animate-pulse" />
                  <div className="h-3 w-20 bg-line/40 animate-pulse" />
                  <div className="h-8 w-24 bg-line animate-pulse" />
                </div>
                <div className="h-4 w-16 bg-line animate-pulse self-start" />
              </div>
            ))}
          </div>

          {/* Order summary skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-cream border border-line p-6 space-y-4">
              <div className="h-5 w-32 bg-line/60 animate-pulse" />
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 w-20 bg-line/40 animate-pulse" />
                  <div className="h-4 w-16 bg-line/40 animate-pulse" />
                </div>
                <div className="flex justify-between">
                  <div className="h-4 w-16 bg-line/40 animate-pulse" />
                  <div className="h-4 w-12 bg-line/40 animate-pulse" />
                </div>
                <div className="h-px bg-line" />
                <div className="flex justify-between">
                  <div className="h-5 w-12 bg-line animate-pulse" />
                  <div className="h-5 w-20 bg-line animate-pulse" />
                </div>
              </div>
              <div className="h-14 w-full bg-navy/20 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
