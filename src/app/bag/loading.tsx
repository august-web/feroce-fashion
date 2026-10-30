export default function BagLoading() {
  return (
    <div className="bg-white min-h-screen text-navy antialiased">
      {/* ── Top Header (Exact layout of BagClient) ── */}
      <section className="pt-28 pb-8 sm:pt-32 sm:pb-10 border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="h-6 w-44 rounded-full bg-[#F6F6F8] border border-gray-200/80 animate-pulse mb-4" />
              <div className="h-10 sm:h-12 w-64 sm:w-80 rounded-2xl bg-gray-200/80 animate-pulse" />
            </div>
            <div className="h-9 w-32 rounded-full bg-[#F6F6F8] border border-gray-200/80 animate-pulse" />
          </div>
        </div>
      </section>

      {/* ── Main Two-Column Layout ── */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12 items-start" aria-hidden="true">
            {/* ── Left Column: Shipping Bar + Item Cards ── */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-6">
              {/* Free Shipping Progress Card */}
              <div className="rounded-[28px] sm:rounded-[32px] bg-[#F6F6F8] border border-gray-200/80 p-5 sm:p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-64 rounded-full bg-gray-200/80 animate-pulse" />
                  <div className="h-4 w-10 rounded-full bg-gray-200/60 animate-pulse" />
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-300 w-2/3 rounded-full animate-pulse" />
                </div>
              </div>

              {/* Cart Item Cards (Matches BagItem layout) */}
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-[28px] sm:rounded-[32px] bg-[#F6F6F8] border border-gray-200/80 p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 shadow-2xs"
                >
                  <div className="flex items-center gap-4 sm:gap-5 w-full sm:w-auto">
                    {/* Item Image */}
                    <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-2xl bg-gray-200/80 animate-pulse shrink-0" />
                    {/* Details */}
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="h-5 w-40 sm:w-52 rounded-xl bg-gray-200/90 animate-pulse" />
                      <div className="h-3.5 w-24 rounded-full bg-gray-200/60 animate-pulse" />
                      <div className="h-5 w-20 rounded-lg bg-gray-200/80 animate-pulse sm:hidden" />
                    </div>
                  </div>

                  {/* Quantity & Actions Cluster */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-200/60">
                    <div className="h-9 w-28 rounded-full bg-white border border-gray-200/80 animate-pulse" />
                    <div className="hidden sm:block h-6 w-20 rounded-lg bg-gray-200/90 animate-pulse" />
                    <div className="w-8 h-8 rounded-full bg-white border border-gray-200/70 animate-pulse" />
                  </div>
                </div>
              ))}

              {/* Continue Shopping Button */}
              <div className="pt-2">
                <div className="h-11 w-64 rounded-full bg-[#F6F6F8] border border-gray-200/80 animate-pulse" />
              </div>
            </div>

            {/* ── Right Column: Order Summary Card (Matches OrderSummary component) ── */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="rounded-[32px] sm:rounded-[36px] bg-[#F6F6F8] border border-gray-200/80 p-6 sm:p-8 space-y-6 shadow-2xs">
                {/* Title */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-200/70">
                  <div className="h-5 w-32 rounded-xl bg-gray-200/90 animate-pulse" />
                  <div className="h-4 w-14 rounded-full bg-gray-200/60 animate-pulse" />
                </div>

                {/* Rows: Subtotal, Shipping, Tax */}
                <div className="space-y-3.5">
                  <div className="flex justify-between">
                    <div className="h-3.5 w-20 rounded-full bg-gray-200/70 animate-pulse" />
                    <div className="h-3.5 w-16 rounded-full bg-gray-200/80 animate-pulse" />
                  </div>
                  <div className="flex justify-between">
                    <div className="h-3.5 w-24 rounded-full bg-gray-200/70 animate-pulse" />
                    <div className="h-3.5 w-20 rounded-full bg-gray-200/80 animate-pulse" />
                  </div>
                  <div className="flex justify-between">
                    <div className="h-3.5 w-28 rounded-full bg-gray-200/70 animate-pulse" />
                    <div className="h-3.5 w-14 rounded-full bg-gray-200/80 animate-pulse" />
                  </div>
                </div>

                {/* Promo Code Input */}
                <div className="pt-2">
                  <div className="h-11 w-full rounded-full bg-white border border-gray-200/80 animate-pulse" />
                </div>

                {/* Total Row */}
                <div className="pt-4 border-t border-gray-200/70 flex justify-between items-center">
                  <div className="h-5 w-16 rounded-xl bg-gray-200/90 animate-pulse" />
                  <div className="h-7 w-24 rounded-xl bg-gray-200/90 animate-pulse" />
                </div>

                {/* Checkout CTA Button */}
                <div className="h-14 w-full rounded-full bg-navy/20 animate-pulse shadow-sm" />

                {/* Trust Badges */}
                <div className="pt-2 flex justify-center gap-4">
                  <div className="h-3.5 w-40 rounded-full bg-gray-200/60 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
