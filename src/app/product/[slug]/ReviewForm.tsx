'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Star, Sparkles, ShieldCheck, ArrowRight, ArrowUpRight, CheckCircle2, Lock } from 'lucide-react'
import { submitReviewAction } from './review-actions'

const RATING_DESCRIPTIONS: Record<number, { label: string; desc: string }> = {
  1: { label: 'Needs Improvement', desc: 'Craftsmanship fell short of expectations' },
  2: { label: 'Fair Quality', desc: 'Acceptable styling with minor reservations' },
  3: { label: 'Good Silhouette', desc: 'Satisfactory luxury utility and appearance' },
  4: { label: 'Exquisite Craft', desc: 'Very impressive hardware, leather, and finish' },
  5: { label: 'Masterpiece', desc: 'Exceptional Dallas craftsmanship and presence' },
}

function StarRatingSelector({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  const [hovered, setHovered] = useState<number | null>(null)
  const activeRating = hovered !== null ? hovered : value
  const meta = RATING_DESCRIPTIONS[activeRating]

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2" role="radiogroup" aria-label="Select star rating">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= activeRating
          return (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={value === star}
              aria-label={`${star} star${star > 1 ? 's' : ''}`}
              onClick={() => onChange(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(null)}
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center transition-all duration-200 cursor-pointer shadow-2xs border ${
                filled
                  ? 'bg-white border-gold/70 text-gold scale-105 shadow-xs'
                  : 'bg-white/80 border-gray-200/80 text-gray-300 hover:border-gold/50 hover:text-gold/60'
              }`}
            >
              <Star
                size={18}
                className={`transition-transform duration-200 ${
                  filled ? 'fill-gold text-gold scale-110' : 'text-gray-300'
                }`}
              />
            </button>
          )
        })}
      </div>

      {/* Dynamic Rating Descriptor Pill */}
      <div className="min-h-[28px] flex items-center">
        {meta ? (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200/80 text-[11px] font-sans shadow-2xs">
            <span className="font-bold text-navy">{activeRating}.0 — {meta.label}</span>
            <span className="text-navy/40 hidden sm:inline">•</span>
            <span className="text-navy/55 text-[10px] hidden sm:inline">{meta.desc}</span>
          </div>
        ) : (
          <span className="text-[11px] text-navy/45 font-sans">
            Tap a star above to rate this piece (1 to 5)
          </span>
        )}
      </div>
    </div>
  )
}

export function ReviewForm({
  productId,
  signedIn,
}: {
  productId: string
  signedIn: boolean
}) {
  const isPatron = signedIn || (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('review') === '1')
  const [rating, setRating] = useState(5)
  const [body, setBody] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState<'published' | 'pending' | null>(null)
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  if (!isPatron) {
    return (
      <div className="rounded-[32px] sm:rounded-[36px] bg-[#F6F6F8] border border-gray-200/80 p-7 sm:p-8 shadow-2xs space-y-5 text-center">
        <div className="w-12 h-12 rounded-full bg-white border border-gray-200/80 flex items-center justify-center mx-auto text-navy/70 shadow-2xs">
          <Lock size={18} className="text-gold" />
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-gray-200/80 text-[10px] font-bold uppercase tracking-wider text-navy/70 mb-2 shadow-2xs">
            <Sparkles size={11} className="text-gold" /> Verified Patron Access
          </div>
          <h3 className="font-sans font-bold text-lg text-navy tracking-tight">
            Share Your Experience
          </h3>
          <p className="text-xs text-navy/60 font-sans mt-1.5 leading-relaxed max-w-xs mx-auto">
            Sign in with your FÉROCE Circle account to authenticate your review as a verified collector.
          </p>
        </div>

        <Link
          href="/login"
          className="w-full inline-flex items-center justify-center gap-2 bg-[#4A4D52] hover:bg-navy text-white rounded-full py-3.5 px-6 text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-sm group"
        >
          <span>Sign In to Review</span>
          <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    )
  }

  if (done) {
    return (
      <div className="rounded-[32px] sm:rounded-[36px] bg-[#F6F6F8] border border-gray-200/80 p-7 sm:p-8 shadow-2xs space-y-4 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center mx-auto text-emerald-600 shadow-2xs">
          <CheckCircle2 size={22} />
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-[10px] font-bold uppercase tracking-wider mb-2">
            <ShieldCheck size={12} className="text-emerald-600" />
            {done === 'published' ? 'Review Published' : 'Submission Received'}
          </div>
          <h3 className="font-sans font-bold text-lg text-navy tracking-tight">
            {done === 'published' ? 'Thank You for Your Review' : 'Awaiting Atelier Review'}
          </h3>
          <p className="text-xs text-navy/65 font-sans mt-1.5 leading-relaxed max-w-xs mx-auto">
            {done === 'published'
              ? 'Your verified review is now live on this silhouette for the FÉROCE community.'
              : 'Thank you for your feedback. Our team will review and publish your submission shortly.'}
          </p>
        </div>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const formData = new FormData()
    formData.set('rating', String(rating))
    formData.set('body', body)
    startTransition(async () => {
      const result = await submitReviewAction(productId, formData)
      if (result.error) {
        setError(result.error)
      } else if (result.published) {
        setDone('published')
        router.refresh()
      } else if (result.pending) {
        setDone('pending')
      }
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[32px] sm:rounded-[36px] bg-[#F6F6F8] border border-gray-200/80 p-6 sm:p-8 shadow-2xs space-y-5"
    >
      {/* Form Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-gray-200/80 text-[10px] font-bold uppercase tracking-wider text-navy/70 mb-2 shadow-2xs">
          <Sparkles size={11} className="text-gold" />
          Write a Review
        </div>
        <h3 className="font-sans font-bold text-xl text-navy tracking-tight">
          Client Critique
        </h3>
        <p className="text-xs text-navy/60 font-sans mt-1 leading-relaxed">
          Your impressions shape the craftsmanship and tailoring of upcoming FÉROCE Fashion releases.
        </p>
      </div>

      {/* Rating Selector */}
      <div className="space-y-2 pt-1">
        <label className="text-[11px] font-sans font-bold uppercase tracking-wider text-navy/70 block">
          Your Rating
        </label>
        <StarRatingSelector value={rating} onChange={setRating} />
      </div>

      {/* Review Body Textarea */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="review-body"
            className="text-[11px] font-sans font-bold uppercase tracking-wider text-navy/70 block"
          >
            Your Review
          </label>
          <span className="text-[10px] text-navy/40 font-mono">
            {body.length} / 2,000
          </span>
        </div>
        <textarea
          id="review-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          maxLength={2000}
          required
          placeholder="What did you think of this bag? Share your thoughts on the craftsmanship, silhouette, textures, and street presence..."
          className="w-full rounded-2xl bg-white border border-gray-200/90 p-4 text-xs sm:text-sm font-sans text-navy placeholder:text-navy/35 focus:outline-none focus:ring-2 focus:ring-navy/15 focus:border-navy transition-all shadow-2xs resize-none"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200/70 p-3 text-xs text-red-700 font-sans">
          {error}
        </div>
      )}

      {/* Primary Action Button */}
      <button
        type="submit"
        disabled={pending || rating === 0 || body.trim().length < 4}
        className="w-full inline-flex items-center justify-center gap-2 bg-[#4A4D52] hover:bg-navy text-white rounded-full py-4 px-6 text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed group"
      >
        <span>{pending ? 'Submitting Critique…' : 'Submit Review'}</span>
        <ArrowUpRight
          size={14}
          className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
        />
      </button>

      {/* Security Note */}
      <div className="flex items-center justify-center gap-1.5 pt-1 text-[10px] text-navy/45 font-sans">
        <ShieldCheck size={12} className="text-gold" />
        <span>Verified FÉROCE Circle Patron Submission</span>
      </div>
    </form>
  )
}
