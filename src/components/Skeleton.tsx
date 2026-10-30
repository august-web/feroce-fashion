/**
 * Luxury NEST Skeleton Components for FÉROCE Fashion
 * Matches the exact organic radii, pill capsules, and elevation of the live product cards.
 */

export function ProductCardSkeleton() {
  return (
    <div
      className="relative block aspect-[3/4] sm:aspect-[4/5] rounded-[28px] sm:rounded-[36px] overflow-hidden bg-[#ECECEE] border border-gray-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] animate-pulse"
      aria-hidden="true"
    >
      {/* Top Left Badge Skeleton */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
        <div className="h-5 w-20 rounded-full bg-white/70 backdrop-blur-md shadow-xs" />
      </div>

      {/* Top Right Wishlist Circle Skeleton */}
      <div className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/70 backdrop-blur-md shadow-xs" />

      {/* Bottom Floating Frosted Glass Capsule Pill Skeleton */}
      <div className="absolute bottom-4 inset-x-4 sm:bottom-5 sm:inset-x-5 backdrop-blur-md bg-white/80 border border-white/70 rounded-full px-4 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.06)] z-10">
        <div className="min-w-0 pr-2 space-y-1.5 flex-1">
          <div className="h-4 w-16 rounded-full bg-gray-200/90" />
          <div className="h-3 w-28 max-w-[70%] rounded-full bg-gray-200/60" />
        </div>

        {/* Quick Add Button Circle Skeleton */}
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-navy/20 shrink-0" />
      </div>
    </div>
  )
}

interface ProductGridSkeletonProps {
  count?: number
  className?: string
}

export function ProductGridSkeleton({
  count = 6,
  className = 'grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8 lg:grid-cols-3',
}: ProductGridSkeletonProps) {
  return (
    <div className={className} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-12 lg:gap-14 items-start" aria-hidden="true">
      {/* ── Left Gallery Skeleton ── */}
      <div className="lg:col-span-7 xl:col-span-7 space-y-4">
        {/* Main Big Image */}
        <div className="aspect-[4/5] rounded-[32px] sm:rounded-[40px] overflow-hidden bg-[#ECECEE] border border-gray-200/50 shadow-[0_8px_30px_rgba(0,0,0,0.04)] animate-pulse relative">
          <div className="absolute top-5 left-5 h-6 w-24 rounded-full bg-white/70 backdrop-blur-md" />
          <div className="absolute top-5 right-5 h-10 w-10 rounded-full bg-white/70 backdrop-blur-md" />
        </div>
        {/* Thumbnail Strip */}
        <div className="flex gap-3 overflow-x-auto pb-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-[#ECECEE] border border-gray-200/50 shrink-0 animate-pulse"
            />
          ))}
        </div>
      </div>

      {/* ── Right Details Skeleton ── */}
      <div className="lg:col-span-5 xl:col-span-5 space-y-6 pt-2">
        {/* Badge & Rating Row */}
        <div className="flex items-center gap-3">
          <div className="h-6 w-28 rounded-full bg-gray-100 animate-pulse" />
          <div className="h-6 w-24 rounded-full bg-gray-100 animate-pulse" />
        </div>

        {/* Title & Price */}
        <div className="space-y-3">
          <div className="h-9 sm:h-11 w-4/5 rounded-2xl bg-gray-200/80 animate-pulse" />
          <div className="h-7 w-32 rounded-xl bg-gray-200/60 animate-pulse" />
        </div>

        {/* Short Editorial Description */}
        <div className="space-y-2 py-2">
          <div className="h-3.5 w-full rounded-full bg-gray-100 animate-pulse" />
          <div className="h-3.5 w-5/6 rounded-full bg-gray-100 animate-pulse" />
          <div className="h-3.5 w-2/3 rounded-full bg-gray-100 animate-pulse" />
        </div>

        {/* Swatches / Options */}
        <div className="space-y-3 pt-2">
          <div className="h-3.5 w-24 rounded-full bg-gray-100 animate-pulse" />
          <div className="flex gap-2.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 w-10 rounded-full bg-gray-100 border border-gray-200 animate-pulse" />
            ))}
          </div>
        </div>

        {/* Add to Bag CTA Button Capsule */}
        <div className="pt-4 space-y-3">
          <div className="h-14 w-full rounded-full bg-navy/20 animate-pulse shadow-sm" />
          <div className="flex items-center justify-center gap-2 pt-1">
            <div className="h-3 w-48 rounded-full bg-gray-100 animate-pulse" />
          </div>
        </div>

        {/* Luxury Trust Indicators Capsule */}
        <div className="rounded-2xl bg-[#F6F6F8] border border-gray-200/70 p-4 space-y-3 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200/80 shrink-0" />
            <div className="h-3.5 w-44 rounded-full bg-gray-200/80" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200/80 shrink-0" />
            <div className="h-3.5 w-52 rounded-full bg-gray-200/80" />
          </div>
        </div>
      </div>
    </div>
  )
}
