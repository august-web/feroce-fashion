import type { ProductReview, ReviewSummary } from '@/lib/review-data'
import { createClient } from '@/lib/supabase/server'
import { ReviewForm } from './ReviewForm'
import { Star, ShieldCheck } from 'lucide-react'

function Stars({ rating, className = '' }: { rating: number; className?: string }) {
  const rounded = Math.round(rating)
  return (
    <div className={'flex items-center gap-1 ' + className} aria-label={`${rating} out of 5 stars`}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i < rounded ? 'fill-gold text-gold' : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
    </div>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export async function ProductReviews({
  productId,
  reviews,
  summary,
}: {
  productId: string
  reviews: ProductReview[]
  summary: ReviewSummary
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <section id="reviews" className="mt-16 sm:mt-24 border-t border-gray-100 pt-12 sm:pt-16">
      <div className="mb-8 sm:mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F6F6F8] border border-gray-200/80 text-[11px] font-semibold tracking-wider uppercase text-navy/70 mb-3">
            Social Proof & Verification
          </div>
          <h2 className="text-2xl sm:text-4xl font-sans font-bold text-navy tracking-tight">
            Client Impressions
          </h2>
        </div>

        {summary.count > 0 ? (
          <div className="flex items-center gap-3 backdrop-blur-md bg-[#F6F6F8] border border-gray-200/80 rounded-full px-5 py-2.5 shadow-sm">
            <Stars rating={summary.average} />
            <span className="text-xs font-bold text-navy">{summary.average.toFixed(1)} / 5.0</span>
            <span className="text-[11px] text-navy/50">
              ({summary.count} {summary.count === 1 ? 'review' : 'reviews'})
            </span>
          </div>
        ) : (
          <p className="text-xs text-navy/50 font-medium">Be the first to review this atelier silhouette.</p>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:gap-12">
        {/* Review list */}
        <div className="space-y-4">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="rounded-[28px] border border-gray-100 bg-[#F6F6F8] p-6 sm:p-7 space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold text-navy tracking-tight">{review.author_name}</span>
                  {review.verified_purchase && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Verified Owner
                    </span>
                  )}
                </div>
                <Stars rating={review.rating} />
              </div>
              <p className="text-xs sm:text-sm text-navy/70 leading-relaxed font-normal">{review.body}</p>
              <p className="text-[10px] text-navy/40 font-medium">{formatDate(review.created_at)}</p>
            </article>
          ))}
          {reviews.length === 0 && (
            <div className="rounded-[28px] border border-gray-100 bg-[#F6F6F8] p-10 text-center">
              <p className="text-xs sm:text-sm text-navy/60 font-medium">
                No reviews yet — your feedback shapes future handcrafted releases.
              </p>
            </div>
          )}
        </div>

        {/* Write a review */}
        <div>
          <div className="lg:sticky lg:top-24 rounded-[32px] border border-gray-100 bg-[#F6F6F8] p-6 sm:p-8">
            <ReviewForm productId={productId} signedIn={!!user} />
          </div>
        </div>
      </div>
    </section>
  )
}
