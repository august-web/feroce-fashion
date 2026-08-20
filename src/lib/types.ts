// ── Supabase Row Types ──

export type UserRole = 'customer' | 'admin'

export interface Profile {
  id: string
  email: string
  role: UserRole
  created_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  sort_order: number
}

export type PaymentMethod =
  | 'card'
  | 'apple_pay'
  | 'google_pay'
  | 'cashapp'
  | 'bank_transfer'

export type PaymentProvider = 'stripe'

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'cancelled'

export interface Product {
  id: string
  category_id: string
  name: string
  slug: string
  description: string
  /** Price in cents */
  price: number
  image_urls: string[]
  /** Lifestyle/model shots — shown on hover in product grid */
  model_image_urls?: string[]
  color: string
  stock: number
  active: boolean
  is_new: boolean
  created_at: string
}

export interface Order {
  id: string
  user_id: string | null
  stripe_session_id: string | null
  payment_method: PaymentMethod
  payment_provider: PaymentProvider
  /** Total in cents */
  total: number
  status: OrderStatus
  shipping_address: Record<string, unknown>
  created_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  name: string
  /** Price in cents */
  price: number
  quantity: number
}

// ── Cart Types (client-side) ──

export interface CartItem {
  productId: string
  name: string
  slug: string
  price: number // cents
  image: string
  color: string
  quantity: number
}

// ── Helpers ──

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100)
}
