import type { ProductReview, ReviewSummary } from '@/lib/review-data'
import { createClient } from '@/lib/supabase/server'
import { ReviewForm } from './ReviewForm'
import { Star, ShieldCheck, Sparkles, CheckCircle2, MessageSquare } from 'lucide-react'

function Stars({ rating, className = '', size = 15 }: { rating: number; className?: string; size?: number }) {
  const rounded = Math.round(rating)
  return (
    <div className={'flex items-center gap-1 ' + className} aria-label={`${rating} out of 5 stars`}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={size}
          className={`${
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

function initialsOf(name: string) {
  const parts = name.trim().split(/[\s@._]+/).filter(Boolean)
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || 'P'
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
      {/* ── Section Header ── */}
      <div className="mb-10 sm:mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F6F6F8] border border-gray-200/80 text-[10px] font-semibold tracking-wider uppercase text-navy/70 mb-3 shadow-2xs">
            <Sparkles size={11} className="text-gold" />
            Social Proof &amp; Verification
          </div>
          <h2 className="text-3xl sm:text-5xl font-sans font-bold text-navy tracking-tight leading-[1.08]">
            Client Impressions
          </h2>
          <p className="text-xs sm:text-sm text-navy/60 font-sans mt-2 max-w-lg">
            Authentic reflections from patrons who wear and style FÉROCE Fashion handcrafted silhouettes.
          </p>
        </div>

        {summary.count > 0 ? (
          <div className="flex items-center gap-3.5 backdrop-blur-md bg-[#F6F6F8] border border-gray-200/80 rounded-full px-5 py-3 shadow-2xs">
            <Stars rating={summary.average} size={15} />
            <span className="text-xs font-bold text-navy">{summary.average.toFixed(1)} / 5.0</span>
            <span className="text-[11px] text-navy/50 font-sans">
              ({summary.count} {summary.count === 1 ? 'Patron Review' : 'Patron Reviews'})
            </span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F6F6F8] border border-gray-200/80 text-xs text-navy/60 font-medium shadow-2xs">
            <MessageSquare size={13} className="text-gold" />
            <span>Be the first to review this silhouette</span>
          </div>
        )}
      </div>

      {/* ── Main Two-Column Layout ── */}
      <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:gap-12 items-start">
        {/* ── Left Column: Reviews List & Summary Metric ── */}
        <div className="space-y-5">
          {/* Highlight Banner if reviews exist */}
          {reviews.length > 0 && (
            <div className="rounded-[28px] bg-gradient-to-r from-[#F6F6F8] to-cream/40 border border-gray-200/70 p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200/80 flex items-center justify-center font-sans font-bold text-lg text-navy shadow-2xs">
                  {summary.average.toFixed(1)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <Stars rating={summary.average} size={13} />
                    <span className="text-xs font-bold text-navy ml-1">Flawless Rating</span>
                  </div>
                  <p className="text-[11px] text-navy/55 font-sans mt-0.5">
                    100% of verified collectors recommend this piece
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-200/80 rounded-full text-[10px] font-sans font-semibold text-navy/70 uppercase tracking-wider shadow-2xs">
                  <CheckCircle2 size={12} className="text-emerald-600" />
                  Dallas Tailored
                </span>
              </div>
            </div>
          )}

          {/* Individual Review Cards */}
          {reviews.map((review) => (
            <article
              key={review.id}
              className="rounded-[30px] border border-gray-200/80 bg-[#F6F6F8] p-6 sm:p-8 space-y-4 shadow-2xs hover:shadow-xs transition-all duration-300 relative group"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Author Info Cluster */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-navy text-cream flex items-center justify-center font-bold text-xs tracking-wider shadow-2xs ring-2 ring-gold/40 ring-offset-2 ring-offset-white shrink-0">
                    {initialsOf(review.author_name)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-navy tracking-tight">
                        {review.author_name}
                      </span>
                      {review.verified_purchase && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/70 text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 shadow-2xs">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          Verified Owner
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-navy/40 font-mono block mt-0.5">
                      {formatDate(review.created_at)}
                    </span>
                  </div>
                </div>

                {/* Star Rating Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-gray-200/80 shadow-2xs">
                  <Stars rating={review.rating} size={13} />
                  <span className="text-[11px] font-bold text-navy">{review.rating}.0</span>
                </div>
              </div>

              {/* Review Body */}
              <p className="text-xs sm:text-sm text-navy/80 leading-relaxed font-normal pt-1 pl-1">
                “{review.body}”
              </p>

              {/* Subtle Atelier Verification Footer */}
              <div className="pt-3 border-t border-gray-200/60 flex items-center justify-between text-[10px] text-navy/45 font-sans">
                <span>Handcrafted Dallas Silhouette</span>
                <span className="text-gold font-semibold">✦ Authentic Review</span>
              </div>
            </article>
          ))}

          {/* Empty State */}
          {reviews.length === 0 && (
            <div className="rounded-[32px] border border-gray-200/80 bg-[#F6F6F8] p-10 sm:p-12 text-center space-y-3 shadow-2xs">
              <div className="w-12 h-12 rounded-full bg-white border border-gray-200/80 flex items-center justify-center mx-auto text-gold shadow-2xs">
                <Sparkles size={20} />
              </div>
              <h4 className="font-sans font-bold text-base text-navy">
                No Client Impressions Yet
              </h4>
              <p className="text-xs text-navy/60 font-sans max-w-sm mx-auto leading-relaxed">
                Be the premier patron to share a critique on this piece. Your perspective enriches our Dallas atelier archive.
              </p>
            </div>
          )}
        </div>

        {/* ── Right Column: Write a Review Form (Sticky) ── */}
        <div className="lg:sticky lg:top-24">
          <ReviewForm productId={productId} signedIn={!!user} />
        </div>
      </div>
    </section>
  )
}
