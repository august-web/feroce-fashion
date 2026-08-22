export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/5] bg-line/50 mb-3" />
      <div className="h-3 bg-line/50 w-3/4 mb-2" />
      <div className="h-3 bg-line/50 w-1/2" />
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
      <div>
        <div className="aspect-[4/5] bg-line/50 mb-4" />
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-square bg-line/50" />
          ))}
        </div>
      </div>
      <div className="space-y-4 pt-4">
        <div className="h-4 bg-line/50 w-1/3" />
        <div className="h-8 bg-line/50 w-2/3" />
        <div className="h-6 bg-line/50 w-1/4" />
        <div className="h-4 bg-line/50 w-full" />
        <div className="h-4 bg-line/50 w-3/4" />
        <div className="h-12 bg-line/50 w-full mt-6" />
      </div>
    </div>
  )
}
