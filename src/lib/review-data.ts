import { createAdminClient } from '@/lib/supabase/admin'

export interface ProductReview {
  id: string
  author_name: string
  rating: number
  body: string
  verified_purchase: boolean
  created_at: string
}

export interface ReviewSummary {
  average: number
  count: number
}

export async function fetchProductReviews(productId: string): Promise<ProductReview[]> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('product_reviews')
    .select('id, author_name, rating, body, verified_purchase, created_at')
    .eq('product_id', productId)
    .eq('approved', true)
    .order('created_at', { ascending: false })
    .limit(50)
  return (data as ProductReview[]) || []
}

export async function fetchReviewSummary(productId: string): Promise<ReviewSummary> {
  const reviews = await fetchProductReviews(productId)
  if (!reviews.length) return { average: 0, count: 0 }
  const average = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
  return { average: Math.round(average * 10) / 10, count: reviews.length }
}

/**
 * True when the signed-in user has a paid order containing this product —
 * those reviewers get "Verified Purchase" and instant approval.
 */
export async function hasVerifiedPurchase(userId: string, productId: string): Promise<boolean> {
  const supabase = createAdminClient()
  const { data: items } = await supabase
    .from('order_items')
    .select('order_id, orders!inner(user_id, status)')
    .eq('product_id', productId)
    .eq('orders.user_id', userId)
    .in('orders.status', ['paid', 'shipped', 'delivered'])
  return (items || []).length > 0
}
