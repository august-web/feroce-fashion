import { ProductGridSkeleton } from '@/components/shop/ProductGridSkeleton'

export default function WishlistLoading() {
  return (
    <div className="bg-white min-h-screen text-navy antialiased">
      {/* ── Top Atelier Subheader / Breadcrumb (Exact layout of WishlistClient) ── */}
      <section className="pt-28 pb-8 sm:pt-32 sm:pb-10 border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="h-6 w-44 rounded-full bg-[#F6F6F8] border border-gray-200/80 animate-pulse mb-4" />
              <div className="h-10 sm:h-12 w-64 sm:w-80 rounded-2xl bg-gray-200/80 animate-pulse" />
            </div>

            <div className="flex items-center gap-3">
              <div className="h-9 w-32 rounded-full bg-[#F6F6F8] border border-gray-200/80 animate-pulse" />
              <div className="h-9 w-36 rounded-full bg-navy/20 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Content Section: Saved Creations Grid ── */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ProductGridSkeleton
            count={4}
            className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8 md:grid-cols-3 lg:grid-cols-4"
          />
        </div>
      </section>
    </div>
  )
}
