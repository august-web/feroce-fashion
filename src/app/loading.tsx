import { ProductGridSkeleton } from '@/components/shop/ProductGridSkeleton'

export default function RootLoading() {
  return (
    <main aria-hidden="true" className="bg-white text-navy antialiased">
      {/* ── 1. HeroSection Skeleton (Matches live Asymmetric Editorial Header & 3-card shelf) ── */}
      <section className="bg-white w-full max-w-full overflow-hidden pt-8 sm:pt-14 pb-16 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          {/* Top Section: Asymmetric Editorial Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
            {/* Left: Bold Headline + CTA Capsule */}
            <div className="lg:col-span-8 space-y-3">
              <div className="h-10 sm:h-16 w-3/4 max-w-md rounded-3xl bg-gray-200/80 animate-pulse" />
              <div className="h-10 sm:h-16 w-5/6 max-w-lg rounded-3xl bg-gray-200/80 animate-pulse" />
              <div className="flex items-center gap-4 pt-1">
                <div className="h-10 sm:h-16 w-44 rounded-3xl bg-gray-200/80 animate-pulse" />
                <div className="h-10 sm:h-12 w-40 rounded-full bg-navy/20 animate-pulse" />
              </div>
            </div>

            {/* Right: Micro Social Proof Cluster & Editorial Statement */}
            <div className="lg:col-span-4 flex flex-col justify-end lg:pl-6 pb-2 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2.5">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-200 ring-2 ring-white animate-pulse shrink-0"
                    />
                  ))}
                </div>
                <div className="h-4 w-36 rounded-full bg-gray-200/80 animate-pulse" />
              </div>
              <div className="pt-2 flex items-start gap-4">
                <div className="w-12 h-px bg-gray-300 mt-2 shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3 w-full rounded-full bg-gray-200/60 animate-pulse" />
                  <div className="h-3 w-4/5 rounded-full bg-gray-200/60 animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section: 3-Column Product Showcase Shelf with Floating Capsules */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-12 sm:mt-16">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="relative block aspect-[3/4] sm:aspect-[4/5] rounded-[28px] sm:rounded-[36px] overflow-hidden bg-[#ECECEE] border border-gray-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] animate-pulse"
              >
                <div className="absolute bottom-5 inset-x-5 sm:inset-x-6 backdrop-blur-md bg-white/80 border border-white/70 rounded-full px-5 py-3 flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                  <div className="h-4 w-20 rounded-full bg-gray-200/90" />
                  <div className="w-10 h-10 rounded-full bg-navy/20 shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. SilhouetteSelector Bar Skeleton ── */}
      <section className="border-y border-gray-100 bg-[#FAF9F6] py-5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-10 w-32 rounded-full bg-white border border-gray-200/70 animate-pulse shrink-0"
            />
          ))}
        </div>
      </section>

      {/* ── 3. DropShowcase Spotlight Skeleton ── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="rounded-[36px] sm:rounded-[48px] bg-[#0A1128] p-8 sm:p-14 lg:p-20 text-white relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 space-y-5">
                <div className="h-6 w-36 rounded-full bg-white/10 border border-white/15 animate-pulse" />
                <div className="h-10 sm:h-14 w-4/5 rounded-3xl bg-white/20 animate-pulse" />
                <div className="space-y-2 pt-2">
                  <div className="h-3.5 w-full rounded-full bg-white/15 animate-pulse" />
                  <div className="h-3.5 w-4/5 rounded-full bg-white/15 animate-pulse" />
                </div>
                <div className="pt-4 flex items-center gap-3">
                  <div className="h-12 w-44 rounded-full bg-gold/50 animate-pulse" />
                  <div className="h-12 w-32 rounded-full bg-white/15 animate-pulse" />
                </div>
              </div>
              <div className="lg:col-span-6">
                <div className="aspect-[4/5] rounded-[32px] sm:rounded-[40px] bg-white/10 border border-white/15 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. The Edit / Curated Grid Skeleton ── */}
      <section className="bg-white px-4 sm:px-6 lg:px-10 py-14 sm:py-24 border-t border-gray-100">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 sm:mb-14 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="h-6 w-36 rounded-full bg-[#F6F6F8] border border-gray-200/80 animate-pulse mb-3" />
              <div className="h-8 sm:h-11 w-64 rounded-2xl bg-gray-200/80 animate-pulse" />
            </div>
            <div className="h-5 w-32 rounded-full bg-gray-100 animate-pulse" />
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
