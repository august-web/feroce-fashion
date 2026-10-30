import { ProductGridSkeleton } from '@/components/shop/ProductGridSkeleton'

export default function CategoryLoading() {
  return (
    <div className="bg-white min-h-[60svh] text-navy antialiased">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 py-8 sm:py-12">
        {/* ── 1. Category Header Skeleton ── */}
        <div className="mb-8 sm:mb-10 pb-6 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="h-6 w-36 rounded-full bg-gray-100 animate-pulse mb-3.5" />
              <div className="h-10 sm:h-12 w-64 sm:w-80 rounded-2xl bg-gray-200/80 animate-pulse mb-3" />
              <div className="h-4 w-full max-w-xl rounded-full bg-gray-100 animate-pulse" />
            </div>
            <div className="h-8 w-28 rounded-full bg-gray-100 animate-pulse shrink-0" />
          </div>
        </div>

        {/* ── 2. Filter Pills + Sort Row ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-9 w-24 rounded-full bg-[#F6F6F8] border border-gray-200/60 animate-pulse shrink-0"
              />
            ))}
          </div>
          <div className="h-9 w-36 rounded-full bg-[#F6F6F8] border border-gray-200/60 animate-pulse shrink-0" />
        </div>

        {/* ── 3. Product Grid Skeleton ── */}
        <ProductGridSkeleton
          count={8}
          className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8 md:grid-cols-3 lg:grid-cols-4"
        />
      </div>
    </div>
  )
}
