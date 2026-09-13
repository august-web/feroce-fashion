'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { submitReviewAction } from './review-actions'

function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Star rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={star + ' star' + (star > 1 ? 's' : '')}
          onClick={() => onChange(star)}
          className={`text-xl leading-none transition-colors ${star <= value ? 'text-gold' : 'text-line hover:text-gold/50'}`}
        >
          ★
        </button>
      ))}
    </div>
  )
}

export function ReviewForm({ productId, signedIn }: { productId: string; signedIn: boolean }) {
  const [rating, setRating] = useState(0)
  const [body, setBody] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState<'published' | 'pending' | null>(null)
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  if (!signedIn) {
    return (
      <div className="border border-line bg-white p-6 text-center">
        <p className="font-serif text-navy text-lg mb-1">Share your experience</p>
        <p className="text-sm text-navy/50 mb-4">Sign in to write a review for this bag.</p>
        <Link href="/login" className="btn-primary inline-block">Sign In</Link>
      </div>
    )
  }

  if (done) {
    return (
      <div className="border border-line bg-white p-6 text-center">
        <p className="font-serif text-navy text-lg mb-1">
          {done === 'published' ? 'Thank you for your review! ⭐' : 'Thank you — your review is awaiting approval.'}
        </p>
        <p className="text-sm text-navy/50">
          {done === 'published'
            ? 'Your review is now live on this page.'
            : 'We\'ll publish it once our team has a quick look.'}
        </p>
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
    <form onSubmit={handleSubmit} className="border border-line bg-white p-6">
      <p className="font-serif text-navy text-lg mb-4">Write a review</p>
      <div className="mb-4">
        <p className="label mb-2">Your rating</p>
        <StarInput value={rating} onChange={setRating} />
      </div>
      <div className="mb-4">
        <label htmlFor="review-body" className="label mb-2 block">Your review</label>
        <textarea
          id="review-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          maxLength={2000}
          required
          placeholder="What did you think of this bag?"
          className="w-full border border-line bg-cream px-3 py-2 text-sm font-sans text-navy placeholder:text-navy/30 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 transition-colors"
        />
      </div>
      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
      <button
        type="submit"
        disabled={pending || rating === 0}
        className="btn-primary w-full disabled:opacity-50"
      >
        {pending ? 'Submitting…' : 'Submit Review'}
      </button>
    </form>
  )
}
