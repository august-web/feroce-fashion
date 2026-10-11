import { ProductGridSkeleton } from '@/components/shop/ProductGridSkeleton'

export default function RootLoading() {
  return (
    <main aria-hidden="true">
      {/* Hero skeleton (HeroSection shape) */}
      <section
        className="relative flex items-end overflow-hidden bg-[#3d3024]"
        style={{ minHeight: 'min(177vw, 90svh)' }}
      >
        <div className="relative z-10 w-full px-5 pb-24 pt-12 sm:px-6 sm:pb-28 md:px-12 md:pb-24 lg:px-16">
          <div className="mb-4 h-3 w-40 animate-pulse bg-white/30" />
          <div className="h-10 w-72 max-w-full animate-pulse bg-white/40 sm:h-14 sm:w-96" />
          <div className="mt-3 h-10 w-56 max-w-full animate-pulse bg-white/40 sm:h-14 sm:w-80" />
          <div className="mt-8 h-12 w-52 animate-pulse bg-white/50" />
        </div>
      </section>

      {/* Featured products skeleton */}
      <section className="bg-cream px-4 py-16 sm:px-6 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-3 h-3 w-24 animate-pulse bg-line/40" />
          <div className="mx-auto mb-10 h-9 w-64 max-w-full animate-pulse bg-line sm:h-11" />
          <ProductGridSkeleton
            count={4}
            className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-14"
          />
        </div>
      </section>
    </main>
  )
}
