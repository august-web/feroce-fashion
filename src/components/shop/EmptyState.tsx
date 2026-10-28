import Link from 'next/link'
import { Sparkles, ArrowUpRight } from 'lucide-react'

export function EmptyState({ query }: { query?: string }) {
  return (
    <div className="rounded-[32px] sm:rounded-[44px] bg-[#F6F6F8] border border-gray-100 p-10 sm:p-16 text-center max-w-2xl mx-auto my-12">
      <div className="mb-6 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white border border-gray-200/80 shadow-sm">
        <Sparkles className="w-6 h-6 text-gold" />
      </div>
      <h3 className="text-2xl sm:text-3xl font-sans font-bold text-navy tracking-tight mb-3">
        No Pieces Found
      </h3>
      <p className="text-sm text-navy/60 max-w-md mx-auto mb-8 leading-relaxed font-normal">
        {query
          ? `We couldn't find any creations matching "${query}". Adjust your filters to explore our full Dallas atelier collection.`
          : 'Our atelier is curating new releases. Reset filters or explore our complete catalog.'}
      </p>
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 bg-[#4A4D52] hover:bg-navy text-white text-xs font-semibold px-8 py-4 rounded-full transition-all duration-300 tracking-wider uppercase shadow-sm group"
      >
        View All Creations
        <ArrowUpRight className="w-3.5 h-3.5 text-white/80 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>
    </div>
  )
}
