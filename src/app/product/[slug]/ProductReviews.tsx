import type { ProductReview, ReviewSummary } from '@/lib/review-data'
import { createClient } from '@/lib/supabase/server'
import { ReviewForm } from './ReviewForm'

function Stars({ rating, className = '' }: { rating: number; className?: string }) {
  const rounded = Math.round(rating)
  return (
    <span className={'text-gold tracking-wide ' + className} aria-hidden="true">
      {'★'.repeat(rounded)}
      <span className="text-line">{'★'.repeat(5 - rounded)}</span>
    </span>
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
    <section id="reviews" className="mt-16 sm:mt-20 border-t border-line pt-14 sm:pt-16">
      <div className="mb-8 sm:mb-10">
        <p className="label mb-3">Customer Reviews</p>
        {summary.count > 0 ? (
          <div className="flex flex-wrap items-center gap-3">
            <Stars rating={summary.average} className="text-lg" />
            <span className="font-serif text-navy text-lg">{summary.average.toFixed(1)}</span>
            <span className="text-sm text-navy/50">
              Based on {summary.count} review{summary.count === 1 ? '' : 's'}
            </span>
          </div>
        ) : (
          <p className="text-sm text-navy/50">Be the first to review this bag.</p>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:gap-12">
        {/* Review list */}
        <div className="space-y-4">
          {reviews.map((review) => (
            <article key={review.id} className="border border-line bg-white p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-sans text-sm font-medium text-navy">{review.author_name}</span>
                  {review.verified_purchase && (
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-green-50 text-green-700 px-2 py-0.5">
                      Verified Purchase
                    </span>
                  )}
                </div>
                <Stars rating={review.rating} className="text-sm" />
              </div>
              <p className="text-sm text-navy/80 leading-relaxed">{review.body}</p>
              <p className="text-[10px] text-navy/40 mt-3">{formatDate(review.created_at)}</p>
            </article>
          ))}
          {reviews.length === 0 && (
            <div className="border border-line bg-white p-8 text-center">
              <p className="text-sm text-navy/50">No reviews yet — your feedback helps other customers.</p>
            </div>
          )}
        </div>

        {/* Write a review */}
        <div>
          <div className="lg:sticky lg:top-24">
            <ReviewForm productId={productId} signedIn={!!user} />
          </div>
        </div>
      </div>
    </section>
  )
}
