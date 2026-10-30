import { ProductGridSkeleton } from '@/components/shop/ProductGridSkeleton'

export default function ShopLoading() {
  return (
    <div className="bg-white min-h-[60svh] text-navy antialiased">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 py-8 sm:py-12">
        {/* ── 1. Shop Header Skeleton ── */}
        <div className="mb-8 sm:mb-10 pb-6 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              {/* Badge Capsule */}
              <div className="h-6 w-44 rounded-full bg-gray-100 animate-pulse mb-3.5" />
              {/* Big Title */}
              <div className="h-10 sm:h-12 w-64 sm:w-80 rounded-2xl bg-gray-200/80 animate-pulse mb-3" />
              {/* Intro Line */}
              <div className="h-4 w-full max-w-xl rounded-full bg-gray-100 animate-pulse" />
            </div>
            {/* Counter pill */}
            <div className="h-8 w-28 rounded-full bg-gray-100 animate-pulse shrink-0" />
          </div>
        </div>

        {/* ── 2. Top Filter Bar & Quick Pills Skeleton ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100">
          {/* Quick Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-9 w-24 rounded-full bg-[#F6F6F8] border border-gray-200/60 animate-pulse shrink-0"
              />
            ))}
          </div>

          {/* Mobile Filter Trigger + Sort Select */}
          <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0">
            <div className="h-9 w-24 rounded-full bg-[#F6F6F8] border border-gray-200/60 animate-pulse sm:hidden" />
            <div className="h-9 w-36 rounded-full bg-[#F6F6F8] border border-gray-200/60 animate-pulse" />
          </div>
        </div>

        {/* ── 3. Main Catalog Layout: Sidebar + Product Grid ── */}
        <div className="flex items-start gap-8 lg:gap-10">
          {/* Desktop Filter Sidebar Skeleton */}
          <div className="hidden lg:block w-64 flex-shrink-0 space-y-6" aria-hidden="true">
            <div className="rounded-[28px] bg-[#F6F6F8] border border-gray-200/70 p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-200/70">
                <div className="h-4 w-20 rounded-full bg-gray-200/80 animate-pulse" />
                <div className="h-3 w-12 rounded-full bg-gray-200/60 animate-pulse" />
              </div>

              {/* Categories */}
              <div className="space-y-3">
                <div className="h-3 w-16 rounded-full bg-gray-200/70 animate-pulse" />
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-md bg-gray-200/80 animate-pulse" />
                      <div className="h-3.5 w-24 rounded-full bg-gray-200/60 animate-pulse" />
                    </div>
                    <div className="h-3 w-6 rounded-full bg-gray-200/50 animate-pulse" />
                  </div>
                ))}
              </div>

              {/* Price Range */}
              <div className="space-y-3 pt-4 border-t border-gray-200/70">
                <div className="h-3 w-20 rounded-full bg-gray-200/70 animate-pulse" />
                <div className="flex items-center gap-2">
                  <div className="h-9 flex-1 rounded-full bg-white border border-gray-200/80 animate-pulse" />
                  <span className="text-xs text-navy/30">—</span>
                  <div className="h-9 flex-1 rounded-full bg-white border border-gray-200/80 animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid Area Skeleton */}
          <div className="flex-1 min-w-0">
            <ProductGridSkeleton
              count={6}
              className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8 lg:grid-cols-3"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
