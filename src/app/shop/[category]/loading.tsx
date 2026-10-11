import { ProductGridSkeleton } from '@/components/shop/ProductGridSkeleton'

export default function CategoryLoading() {
  return (
    <section className="bg-cream min-h-[60svh]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-10 sm:py-14 md:py-20">
        {/* Header skeleton (ShopHeader with intro) */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <div className="h-3 w-16 animate-pulse bg-line/40 mb-3" />
          <div className="h-9 w-64 animate-pulse bg-line sm:h-11 sm:w-80" />
          <div className="mt-3 h-4 w-full max-w-lg animate-pulse bg-line/40" />
          <div className="mt-5 h-px w-16 bg-gold/40" />
        </div>

        {/* Filter pills + sort row */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2" aria-hidden="true">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 w-20 animate-pulse bg-line/60" />
            ))}
          </div>
          <div className="h-11 w-36 animate-pulse bg-line/60" />
        </div>

        <ProductGridSkeleton
          count={8}
          className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 sm:gap-y-10 md:grid-cols-4 md:gap-x-6 md:gap-y-14"
        />
      </div>
    </section>
  )
}
