export default function CheckoutLoading() {
  return (
    <div className="bg-white min-h-screen text-navy antialiased">
      {/* ── Top Atelier Subheader / Header (Matches CheckoutClient) ── */}
      <section className="pt-28 pb-8 sm:pt-32 sm:pb-10 border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="h-6 w-48 rounded-full bg-[#F6F6F8] border border-gray-200/80 animate-pulse mb-3" />
              <div className="h-10 sm:h-12 w-72 sm:w-96 rounded-2xl bg-gray-200/80 animate-pulse" />
            </div>

            <div className="flex items-center gap-4">
              <div className="h-9 w-40 rounded-full bg-emerald-50 border border-emerald-200/70 animate-pulse hidden sm:block" />
              <div className="h-9 w-28 rounded-full bg-[#F6F6F8] border border-gray-200/80 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Checkout Form & Summary Grid ── */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12 items-start" aria-hidden="true">
            {/* ── Left Column: Express Bar + Form Sections ── */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-8">
              {/* Express Checkout Indicator Bar */}
              <div className="rounded-[28px] bg-[#F6F6F8] border border-gray-200/80 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
                <div className="h-4 w-44 rounded-full bg-gray-200/80 animate-pulse" />
                <div className="flex items-center gap-2">
                  <div className="h-7 w-20 rounded-full bg-white border border-gray-200 animate-pulse" />
                  <div className="h-7 w-20 rounded-full bg-white border border-gray-200 animate-pulse" />
                  <div className="h-7 w-16 rounded-full bg-white border border-gray-200 animate-pulse" />
                </div>
              </div>

              {/* Form Section 1: Contact Information Card */}
              <div className="rounded-[32px] sm:rounded-[36px] bg-[#F6F6F8] border border-gray-200/80 p-6 sm:p-8 space-y-6 shadow-2xs">
                <div className="flex items-center justify-between pb-4 border-b border-gray-200/70">
                  <div className="h-5 w-48 rounded-xl bg-gray-200/90 animate-pulse" />
                  <div className="h-4 w-28 rounded-full bg-gray-200/60 animate-pulse" />
                </div>
                <div className="space-y-4">
                  <div className="h-12 w-full rounded-2xl bg-white border border-gray-200/80 animate-pulse" />
                  <div className="h-12 w-full rounded-2xl bg-white border border-gray-200/80 animate-pulse" />
                </div>
              </div>

              {/* Form Section 2: Shipping Destination Card */}
              <div className="rounded-[32px] sm:rounded-[36px] bg-[#F6F6F8] border border-gray-200/80 p-6 sm:p-8 space-y-6 shadow-2xs">
                <div className="flex items-center justify-between pb-4 border-b border-gray-200/70">
                  <div className="h-5 w-40 rounded-xl bg-gray-200/90 animate-pulse" />
                  <div className="h-4 w-20 rounded-full bg-gray-200/60 animate-pulse" />
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="h-12 rounded-2xl bg-white border border-gray-200/80 animate-pulse" />
                    <div className="h-12 rounded-2xl bg-white border border-gray-200/80 animate-pulse" />
                  </div>
                  <div className="h-12 w-full rounded-2xl bg-white border border-gray-200/80 animate-pulse" />
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-12 rounded-2xl bg-white border border-gray-200/80 animate-pulse" />
                    <div className="h-12 rounded-2xl bg-white border border-gray-200/80 animate-pulse" />
                    <div className="h-12 rounded-2xl bg-white border border-gray-200/80 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Form Section 3: Delivery Method */}
              <div className="rounded-[32px] sm:rounded-[36px] bg-[#F6F6F8] border border-gray-200/80 p-6 sm:p-8 space-y-4 shadow-2xs">
                <div className="h-5 w-36 rounded-xl bg-gray-200/90 animate-pulse mb-4" />
                <div className="h-16 w-full rounded-2xl bg-white border border-gray-200/80 animate-pulse" />
                <div className="h-16 w-full rounded-2xl bg-white border border-gray-200/80 animate-pulse" />
              </div>
            </div>

            {/* ── Right Column: Order Review & Pricing Summary Card ── */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="rounded-[32px] sm:rounded-[36px] bg-[#F6F6F8] border border-gray-200/80 p-6 sm:p-8 space-y-6 shadow-2xs">
                <div className="flex items-center justify-between pb-4 border-b border-gray-200/70">
                  <div className="h-5 w-36 rounded-xl bg-gray-200/90 animate-pulse" />
                  <div className="h-4 w-16 rounded-full bg-gray-200/60 animate-pulse" />
                </div>

                {/* Mini Item Rows */}
                <div className="space-y-4 pb-4 border-b border-gray-200/70">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-14 h-16 rounded-xl bg-gray-200/80 animate-pulse shrink-0" />
                      <div className="flex-1 space-y-1.5 min-w-0">
                        <div className="h-4 w-32 rounded-full bg-gray-200/80 animate-pulse" />
                        <div className="h-3 w-16 rounded-full bg-gray-200/60 animate-pulse" />
                      </div>
                      <div className="h-4 w-14 rounded-full bg-gray-200/80 animate-pulse" />
                    </div>
                  ))}
                </div>

                {/* Subtotals & Fees */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <div className="h-3.5 w-16 rounded-full bg-gray-200/70 animate-pulse" />
                    <div className="h-3.5 w-16 rounded-full bg-gray-200/80 animate-pulse" />
                  </div>
                  <div className="flex justify-between">
                    <div className="h-3.5 w-20 rounded-full bg-gray-200/70 animate-pulse" />
                    <div className="h-3.5 w-14 rounded-full bg-gray-200/80 animate-pulse" />
                  </div>
                  <div className="flex justify-between">
                    <div className="h-3.5 w-24 rounded-full bg-gray-200/70 animate-pulse" />
                    <div className="h-3.5 w-16 rounded-full bg-gray-200/80 animate-pulse" />
                  </div>
                </div>

                {/* Promo Code Input */}
                <div className="h-11 w-full rounded-full bg-white border border-gray-200/80 animate-pulse" />

                {/* Total */}
                <div className="pt-4 border-t border-gray-200/70 flex justify-between items-center">
                  <div className="h-5 w-24 rounded-xl bg-gray-200/90 animate-pulse" />
                  <div className="h-7 w-28 rounded-xl bg-gray-200/90 animate-pulse" />
                </div>

                {/* CTA Button */}
                <div className="h-14 w-full rounded-full bg-navy/20 animate-pulse shadow-sm" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
