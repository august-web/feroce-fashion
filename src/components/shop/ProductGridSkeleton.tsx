function ProductCardSkeleton() {
  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden border border-line bg-white">
        <div className="absolute inset-0 animate-pulse bg-line/40" />
        <div className="absolute right-2.5 top-2.5 h-8 w-8 bg-white/90 sm:right-3 sm:top-3" />
      </div>
      <div className="mt-3 space-y-1.5 sm:mt-4">
        <div className="h-4 w-3/4 animate-pulse bg-line/60" />
        <div className="h-3 w-full animate-pulse bg-line/40" />
        <div className="mt-1 h-4 w-16 animate-pulse bg-line" />
      </div>
    </div>
  )
}

interface ProductGridSkeletonProps {
  count?: number
  className: string
}

export function ProductGridSkeleton({ count = 8, className }: ProductGridSkeletonProps) {
  return (
    <div className={className} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}
