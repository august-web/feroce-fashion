export default function BagLoading() {
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
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12 items-start" aria-hidden="true">
            {/* Left Items Skeleton */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-4">
              <div className="h-20 w-full rounded-[28px] bg-[#F6F6F8] animate-pulse" />
              {[1, 2].map((i) => (
                <div key={i} className="h-36 w-full rounded-[32px] bg-[#F6F6F8] animate-pulse" />
              ))}
            </div>

            {/* Right Summary Skeleton */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="h-96 w-full rounded-[36px] bg-[#F6F6F8] animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
