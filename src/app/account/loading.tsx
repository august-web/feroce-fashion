export default function AccountLoading() {
  return (
    <div className="bg-white min-h-screen text-navy font-sans antialiased">
      {/* ── Top Hero Skeleton ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pt-8 sm:pt-12 pb-10 sm:pb-14">
          <div className="h-6 w-52 rounded-full bg-gray-100 animate-pulse mb-6" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="flex items-center gap-5 sm:gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100 animate-pulse shrink-0" />
              <div className="space-y-2.5">
                <div className="h-8 sm:h-10 w-48 sm:w-64 rounded-2xl bg-gray-100 animate-pulse" />
                <div className="h-4 w-72 rounded-xl bg-gray-100/70 animate-pulse" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-9 w-28 rounded-full bg-gray-100 animate-pulse" />
              <div className="h-9 w-32 rounded-full bg-gray-100 animate-pulse" />
              <div className="h-9 w-24 rounded-full bg-gray-100 animate-pulse" />
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mt-10">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-[28px] sm:rounded-[32px] bg-[#F6F6F8] border border-gray-200/80 p-5 sm:p-6"
              >
                <div className="h-3 w-20 rounded bg-gray-200/80 animate-pulse mb-3" />
                <div className="h-8 w-24 rounded-xl bg-gray-200/80 animate-pulse mb-1" />
                <div className="h-3 w-32 rounded bg-gray-200/60 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Layout Skeleton ── */}
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-8 space-y-6">
            <div className="h-8 w-64 rounded-xl bg-gray-100 animate-pulse" />
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-[32px] bg-[#F6F6F8] border border-gray-200/80 p-6 sm:p-8 space-y-4"
              >
                <div className="flex justify-between items-center pb-4 border-b border-gray-200/70">
                  <div className="h-4 w-40 rounded bg-gray-200/80 animate-pulse" />
                  <div className="h-6 w-28 rounded-full bg-gray-200/80 animate-pulse" />
                </div>
                <div className="h-16 rounded-2xl bg-white border border-gray-200/70 animate-pulse" />
              </div>
            ))}
          </div>

          <div className="lg:col-span-4 space-y-6">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="rounded-[32px] bg-[#F6F6F8] border border-gray-200/80 p-6 sm:p-7 space-y-4"
              >
                <div className="h-4 w-32 rounded bg-gray-200/80 animate-pulse" />
                <div className="h-24 rounded-2xl bg-white border border-gray-200/70 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
