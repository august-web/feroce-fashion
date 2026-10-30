import { ProductDetailSkeleton, ProductGridSkeleton } from '@/components/Skeleton'

export default function ProductLoading() {
  return (
    <div className="bg-white min-h-screen text-navy antialiased">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 py-6 sm:py-10">
        {/* ── Breadcrumb Navigation Skeleton ── */}
        <div className="mb-6 sm:mb-8 flex items-center gap-2" aria-hidden="true">
          <div className="h-3 w-12 rounded-full bg-gray-200/70 animate-pulse" />
          <span className="text-gray-300 text-xs">/</span>
          <div className="h-3 w-10 rounded-full bg-gray-200/70 animate-pulse" />
          <span className="text-gray-300 text-xs">/</span>
          <div className="h-3 w-16 rounded-full bg-gray-200/70 animate-pulse" />
          <span className="text-gray-300 text-xs">/</span>
          <div className="h-3 w-28 rounded-full bg-gray-200/90 animate-pulse" />
        </div>

        {/* ── Product Detail Hero (Gallery + Info) ── */}
        <ProductDetailSkeleton />

        {/* ── Related Creations Skeleton ── */}
        <div className="mt-16 sm:mt-24 border-t border-gray-100 pt-12 sm:pt-16" aria-hidden="true">
          <div className="mb-8 sm:mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="h-6 w-36 rounded-full bg-gray-100 animate-pulse mb-3" />
              <div className="h-8 sm:h-10 w-64 rounded-2xl bg-gray-200/80 animate-pulse" />
            </div>
            <div className="h-4 w-32 rounded-full bg-gray-100 animate-pulse" />
          </div>

          <ProductGridSkeleton
            count={4}
            className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8 md:grid-cols-3 lg:grid-cols-4"
          />
        </div>
      </div>
    </div>
  )
}
