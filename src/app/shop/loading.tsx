import { ProductGridSkeleton } from '@/components/shop/ProductGridSkeleton'

export default function ShopLoading() {
  return (
    <section className="bg-cream min-h-[60svh]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-10 sm:py-14 md:py-20">
        {/* Header skeleton (ShopHeader shape) */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <div className="h-3 w-16 animate-pulse bg-line/40 mb-3" />
          <div className="h-9 w-52 animate-pulse bg-line sm:h-11 sm:w-64" />
          <div className="mt-5 h-px w-16 bg-gold/40" />
        </div>

        {/* Mobile filter toggle + sort row */}
        <div className="mb-6 flex items-center justify-between gap-4 lg:mb-8">
          <div className="h-11 w-24 animate-pulse bg-line/60 lg:hidden" />
          <div className="flex-1" />
          <div className="h-11 w-36 animate-pulse bg-line/60" />
        </div>

        {/* Sidebar + grid */}
        <div className="flex gap-8">
          <div className="hidden w-56 flex-shrink-0 lg:block" aria-hidden="true">
            <div className="mb-6 h-4 w-16 animate-pulse bg-line/60" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="h-4 w-4 animate-pulse bg-line/60" />
                  <div className="h-3 w-24 animate-pulse bg-line/40" />
                </div>
              ))}
            </div>
            <div className="mt-8 space-y-2">
              <div className="h-3 w-20 animate-pulse bg-line/40" />
              <div className="flex gap-2">
                <div className="h-12 flex-1 animate-pulse bg-line/60" />
                <div className="h-12 flex-1 animate-pulse bg-line/60" />
              </div>
            </div>
            <div className="mt-6 h-12 w-full animate-pulse bg-line" />
          </div>

          <div className="flex-1 min-w-0">
            <ProductGridSkeleton
              count={6}
              className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-14"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
