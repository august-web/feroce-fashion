import Link from 'next/link'
import { ShoppingBag, ArrowRight, Heart } from 'lucide-react'

export function EmptyBag() {
  return (
    <div className="rounded-[32px] sm:rounded-[44px] bg-[#F6F6F8] border border-gray-200/80 p-10 sm:p-20 text-center max-w-3xl mx-auto shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white border border-gray-200/80 flex items-center justify-center shadow-xs">
        <ShoppingBag className="w-9 h-9 text-gold" strokeWidth={1.5} />
      </div>

      <h2 className="font-sans font-bold text-2xl sm:text-3xl text-navy tracking-[-0.03em] mb-3">
        Your Bag is Currently Empty
      </h2>
      <p className="text-sm sm:text-base text-navy/60 max-w-md mx-auto mb-8 font-sans leading-relaxed">
        You haven&apos;t added any bespoke leathercraft pieces yet. Explore our handcrafted silhouettes, limited edition drops, and signature collections.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/shop"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#4A4D52] hover:bg-navy text-white rounded-full px-8 py-4 text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-sm"
        >
          <span>Explore The Archive</span>
          <ArrowRight size={14} />
        </Link>
        <Link
          href="/wishlist"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-xs font-semibold uppercase tracking-wider text-navy bg-white border border-gray-200 hover:border-navy transition-all duration-300"
        >
          <Heart size={14} className="text-gold" />
          <span>Saved Creations</span>
        </Link>
      </div>

      {/* Recommended Quick Navigation */}
      <div className="mt-12 pt-10 border-t border-gray-200/70">
        <p className="text-xs uppercase tracking-widest font-semibold text-navy/40 mb-4">
          Signature Silhouettes
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Link
            href="/product/naji-gold-fur-xl"
            className="rounded-full px-4 py-2 bg-white border border-gray-200 text-xs font-medium text-navy/80 hover:text-navy hover:border-navy transition-colors"
          >
            Naji Gold Fur Bag · $443.00
          </Link>
          <Link
            href="/product/feroce-satchel-bag"
            className="rounded-full px-4 py-2 bg-white border border-gray-200 text-xs font-medium text-navy/80 hover:text-navy hover:border-navy transition-colors"
          >
            FÉROCE Satchel Bag · $300.00
          </Link>
          <Link
            href="/shop/womens"
            className="rounded-full px-4 py-2 bg-white border border-gray-200 text-xs font-medium text-navy/80 hover:text-navy hover:border-navy transition-colors"
          >
            Denim De Ville Archive
          </Link>
        </div>
      </div>
    </div>
  )
}
