export default function ProductLoading() {
  return (
    <section className="bg-cream min-h-[60svh]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16">
        {/* Breadcrumb row */}
        <div className="mb-6 flex items-center gap-2 sm:mb-8" aria-hidden="true">
          <div className="h-3 w-10 animate-pulse bg-line/40" />
          <span className="text-[10px] text-navy/30">/</span>
          <div className="h-3 w-10 animate-pulse bg-line/40" />
          <span className="text-[10px] text-navy/30">/</span>
          <div className="h-3 w-20 animate-pulse bg-line/60" />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-14">
          {/* Gallery skeleton (ImageGallery shape) */}
          <div>
            <div className="relative aspect-[4/5] overflow-hidden border border-line bg-white">
              <div className="absolute inset-0 animate-pulse bg-line/40" />
            </div>
            <div className="mt-2 flex gap-2" aria-hidden="true">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 w-16 flex-shrink-0 animate-pulse bg-line/60 sm:h-20 sm:w-20" />
              ))}
            </div>
          </div>

          {/* Details skeleton */}
          <div className="space-y-5 sm:space-y-6">
            <div className="flex gap-2" aria-hidden="true">
              <div className="h-7 w-14 animate-pulse bg-line/60" />
              <div className="h-7 w-16 animate-pulse bg-line/60" />
            </div>
            <div className="h-8 w-3/4 animate-pulse bg-line sm:h-10" />
            <div className="flex items-center gap-3">
              <div className="h-6 w-20 animate-pulse bg-line" />
              <div className="h-5 w-16 animate-pulse bg-line/40" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full animate-pulse bg-line/40" />
              <div className="h-3 w-full animate-pulse bg-line/40" />
              <div className="h-3 w-2/3 animate-pulse bg-line/40" />
            </div>
            {/* Color swatches */}
            <div>
              <div className="mb-3 h-3 w-12 animate-pulse bg-line/40" />
              <div className="flex gap-2" aria-hidden="true">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-9 w-9 animate-pulse bg-line/60" />
                ))}
              </div>
            </div>
            {/* CTA + reassurance lines */}
            <div className="space-y-3">
              <div className="h-14 w-full animate-pulse bg-navy/30" />
              <div className="h-3 w-48 animate-pulse bg-line/40" />
              <div className="h-3 w-64 animate-pulse bg-line/40" />
            </div>
            {/* Accordions */}
            <div className="space-y-4 border-t border-line pt-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="h-4 w-28 animate-pulse bg-line/60" />
                  <div className="h-4 w-4 animate-pulse bg-line/40" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
