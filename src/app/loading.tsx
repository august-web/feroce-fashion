import { ProductGridSkeleton } from '@/components/shop/ProductGridSkeleton'

export default function RootLoading() {
  return (
    <main aria-hidden="true" className="bg-white text-navy antialiased">
      {/* ── 1. Hero Section Skeleton ── */}
      <section
        className="relative flex items-end overflow-hidden bg-gradient-to-b from-[#0A1128] via-[#0D1738] to-[#0A1128]"
        style={{ minHeight: 'min(150vw, 90svh)' }}
      >
        <div className="relative z-10 w-full px-5 pb-16 sm:px-6 md:px-12 md:pb-20 lg:px-16">
          <div className="mx-auto max-w-7xl space-y-4">
            {/* Studio Badge Capsule */}
            <div className="h-6 w-48 rounded-full bg-white/10 backdrop-blur-md border border-white/15 animate-pulse" />
            
            {/* Display Headline */}
            <div className="h-10 sm:h-16 w-3/4 max-w-xl rounded-3xl bg-white/20 animate-pulse" />
            <div className="h-10 sm:h-16 w-1/2 max-w-md rounded-3xl bg-white/20 animate-pulse" />

            {/* Subtitle */}
            <div className="pt-2 h-4 w-full max-w-lg rounded-full bg-white/15 animate-pulse" />

            {/* CTA Button Capsule */}
            <div className="pt-4">
              <div className="h-12 sm:h-14 w-44 rounded-full bg-white/25 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Editorial Showcase Skeleton ── */}
      <section className="bg-white px-5 sm:px-8 lg:px-12 py-16 sm:py-24 border-b border-gray-100">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-10 text-center max-w-xl mx-auto space-y-3">
            <div className="h-6 w-36 rounded-full bg-gray-100 animate-pulse mx-auto" />
            <div className="h-8 sm:h-10 w-64 rounded-2xl bg-gray-200/80 animate-pulse mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="aspect-[4/5] md:aspect-video rounded-[32px] sm:rounded-[40px] bg-[#ECECEE] border border-gray-200/50 animate-pulse" />
            <div className="aspect-[4/5] md:aspect-video rounded-[32px] sm:rounded-[40px] bg-[#ECECEE] border border-gray-200/50 animate-pulse" />
          </div>
        </div>
      </section>

      {/* ── 3. The Edit / Curated Grid Skeleton ── */}
      <section className="bg-white px-5 sm:px-8 lg:px-12 py-14 sm:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-10 sm:mb-14 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="h-6 w-36 rounded-full bg-gray-100 animate-pulse mb-3" />
              <div className="h-8 sm:h-11 w-64 rounded-2xl bg-gray-200/80 animate-pulse" />
            </div>
            <div className="h-4 w-32 rounded-full bg-gray-100 animate-pulse" />
          </div>

          <ProductGridSkeleton
            count={4}
            className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8 md:grid-cols-4"
          />
        </div>
      </section>
    </main>
  )
}
