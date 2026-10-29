export default function WishlistLoading() {
  return (
    <div className="bg-white min-h-screen text-navy antialiased">
      {/* ── Top Header Skeleton ── */}
      <section className="pt-28 pb-8 sm:pt-32 sm:pb-10 border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="h-6 w-36 rounded-full bg-[#F6F6F8] animate-pulse mb-4" />
              <div className="h-12 w-64 rounded-2xl bg-[#F6F6F8] animate-pulse" />
            </div>
            <div className="h-10 w-32 rounded-full bg-[#F6F6F8] animate-pulse" />
          </div>
        </div>
      </section>

      {/* ── Grid Skeleton ── */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8" aria-hidden="true">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="relative aspect-[3/4] sm:aspect-[4/5] rounded-[28px] sm:rounded-[36px] overflow-hidden bg-[#F6F6F8] animate-pulse"
              >
                <div className="absolute top-4 left-4 h-6 w-16 rounded-full bg-white/60" />
                <div className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white/60" />
                <div className="absolute bottom-4 inset-x-4 sm:bottom-5 sm:inset-x-5 h-14 rounded-full bg-white/70" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
