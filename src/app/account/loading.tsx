export default function AccountLoading() {
  return (
    <section className="bg-cream min-h-[70svh]">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 md:px-8 py-10 sm:py-14 md:py-20">
        <div className="mb-8 sm:mb-10">
          <div className="h-3 w-24 bg-line/40 animate-pulse mb-3" />
          <div className="h-10 w-48 bg-line animate-pulse mb-4" />
          <div className="h-px w-16 bg-gold/40" />
        </div>
        <div className="bg-white border border-line p-6 mb-8">
          <div className="h-4 w-32 bg-line/60 animate-pulse mb-4" />
          <div className="space-y-3">
            <div className="flex justify-between"><div className="h-4 w-12 bg-line/40 animate-pulse" /><div className="h-4 w-40 bg-line/40 animate-pulse" /></div>
            <div className="flex justify-between"><div className="h-4 w-20 bg-line/40 animate-pulse" /><div className="h-4 w-28 bg-line/40 animate-pulse" /></div>
          </div>
        </div>
        <div className="bg-white border border-line p-6">
          <div className="h-4 w-28 bg-line/60 animate-pulse mb-4" />
          {[1,2].map((i) => (
            <div key={i} className="border border-line p-4 mb-3">
              <div className="flex justify-between mb-2"><div className="h-4 w-24 bg-line/60 animate-pulse" /><div className="h-4 w-16 bg-line/40 animate-pulse" /></div>
              <div className="h-3 w-32 bg-line/40 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
