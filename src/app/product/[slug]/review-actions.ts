'use server'

import { createClient } from '@/lib/supabase/server'
import { hasVerifiedPurchase } from '@/lib/review-data'
import { sendEmail } from '@/lib/email'

const ADMIN_EMAIL = 'Ferocefashionff@gmail.com'

export interface SubmitReviewResult {
  error?: string
  pending?: boolean
  published?: boolean
}

export async function submitReviewAction(
  productId: string,
  formData: FormData,
): Promise<SubmitReviewResult> {
  const rating = Number(formData.get('rating'))
  const body = String(formData.get('body') || '').trim()

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { error: 'Please choose a star rating.' }
  }
  if (body.length < 4 || body.length > 2000) {
    return { error: 'Your review needs to be between 4 and 2000 characters.' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'You need to be signed in to leave a review.' }
  }

  const verified = await hasVerifiedPurchase(user.id, productId)
  const authorName = user.user_metadata?.name || (user.email || 'Customer').split('@')[0]

  // RLS enforces user_id = auth.uid() and approved = false on insert;
  // verified purchases are approved server-side via the service role.
  const { error } = await supabase.from('product_reviews').insert({
    product_id: productId,
    user_id: user.id,
    author_name: authorName,
    rating,
    body,
    verified_purchase: verified,
    approved: false,
  } as never)

  if (error) {
    if (error.code === '23505') {
      return { error: 'You already wrote a review for this product.' }
    }
    return { error: 'Could not submit your review. Please try again.' }
  }

  if (verified) {
    // Publish verified purchases immediately (service-role update).
    const { createAdminClient } = await import('@/lib/supabase/admin')
    const admin = createAdminClient()
    await admin
      .from('product_reviews')
      .update({ approved: true })
      .eq('product_id', productId)
      .eq('user_id', user.id)
    notifyAdminReview({ productId, author: authorName, rating, body, needsApproval: false })
    return { published: true }
  }

  notifyAdminReview({ productId, author: authorName, rating, body, needsApproval: true })
  return { pending: true }
}

/** Fire-and-forget admin notification about a new review. */
function notifyAdminReview({
  productId, author, rating, body, needsApproval,
}: {
  productId: string
  author: string
  rating: number
  body: string
  needsApproval: boolean
}) {
  void (async () => {
    try {
      const { createAdminClient } = await import('@/lib/supabase/admin')
      const admin = createAdminClient()
      const { data: product } = await admin
        .from('products')
        .select('name')
        .eq('id', productId)
        .single()
      await sendEmail({
        type: 'review-submitted',
        to: ADMIN_EMAIL,
        productName: product?.name || 'a product',
        reviewAuthor: author,
        reviewRating: rating,
        reviewBody: body,
        reviewNeedsApproval: needsApproval,
      })
    } catch (err) {
      console.error('Review admin notification failed:', err)
    }
  })()
}
