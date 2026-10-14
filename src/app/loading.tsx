import { ProductGridSkeleton } from '@/components/shop/ProductGridSkeleton'

export default function RootLoading() {
  return (
    <main aria-hidden="true">
      {/* Hero skeleton (HeroSection shape) */}
      <section
        className="relative flex items-end overflow-hidden bg-navy"
        style={{ minHeight: 'min(150vw, 90svh)' }}
      >
        <div className="relative z-10 w-full px-5 pb-16 sm:px-6 md:px-12 md:pb-20 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <div className="h-8 w-64 max-w-full animate-pulse bg-white/25 sm:h-12 sm:w-80" />
            <div className="mt-2 h-8 w-52 max-w-full animate-pulse bg-white/25 sm:h-12 sm:w-72" />
            <div className="mt-4 h-3 w-72 max-w-full animate-pulse bg-white/15" />
            <div className="mt-7 h-12 w-52 animate-pulse bg-white/30 sm:mt-9" />
          </div>
        </div>
      </section>

      {/* Video grid skeleton (VideoGrid shape) */}
      <section className="bg-white px-4 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-10 h-9 w-64 max-w-full animate-pulse bg-line" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            <div className="aspect-[4/5] animate-pulse bg-line/60 md:aspect-video" />
            <div className="aspect-[4/5] animate-pulse bg-line/60 md:aspect-video" />
          </div>
        </div>
      </section>

      {/* The Edit skeleton (EditSection shape) */}
      <section className="bg-white px-4 py-14 sm:px-6 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-10 h-8 w-48 max-w-full animate-pulse bg-line sm:mb-14" />
          <ProductGridSkeleton
            count={4}
            className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 md:grid-cols-4 md:gap-x-6 md:gap-y-12"
          />
        </div>
      </section>
    </main>
  )
}
