export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'cancelled'

export interface Product {
  id: string
  category_id: string
  collection?: string
  name: string
  slug: string
  description: string
  price: number
  compare_at_price?: number
  preorder?: boolean
  image_urls: string[]
  model_image_urls?: string[]
  color: string
  stock: number
  active: boolean
  is_new: boolean
  created_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  sort_order: number
}

export interface CartItem {
  productId: string
  name: string
  slug: string
  price: number
  image: string
  color: string
  quantity: number
  stripe_checkout_url?: string
}

export interface Order {
  id: string
  user_id: string | null
  stripe_session_id: string | null
  payment_method: PaymentMethod
  payment_provider: PaymentProvider
  total: number
  status: OrderStatus
  shipping_address: Record<string, string>
  created_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  name: string
  price: number
  quantity: number
}

export type PaymentMethod = 'card' | 'apple_pay' | 'google_pay' | 'cashapp' | 'bank_transfer' | 'paypal'
export type PaymentProvider = 'stripe' | 'paypal'

export function formatPrice(amount: number): string {
  return '$' + amount.toFixed(2)
}
