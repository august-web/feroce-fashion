export type Gender = 'Women' | 'Men' | 'Unisex'
export type Availability = 'In stock' | 'Low stock' | 'Pre-order' | 'Made to order'

export interface Product {
  id: string
  slug: string
  name: string
  subtitle: string
  price: number
  priceIsPlaceholder: boolean
  category: string
  gender: Gender
  collection: string
  image: string
  alternateImage?: string
  colors: { name: string; hex: string }[]
  badge?: 'NEW' | 'BEST SELLER' | 'PRE-ORDER' | 'LIMITED'
  availability: Availability
  inventory: number
  description: string
  materials: string
  dimensions: string
  variants: string[]
  preorderEstimate?: string
  keywords: string[]
}

export interface CartLine {
  product: Product
  quantity: number
  color: string
  variant: string
}

/** Site-wide storefront settings (single row in the `site_settings` table, editable from the
 *  admin panel). The utility bar renders these; the client updates them without code changes. */
export interface SiteSettings {
  currencyCode: string
  /** Free-shipping threshold in minor units (e.g. GH₵2,000 → 200000). */
  freeShippingOverMinor: number
  returnsDays: number
  source: 'static' | 'live'
  loading: boolean
}

export interface OrderRow {
  id: string
  customer: string
  email: string
  total: number
  status: 'Pending' | 'Paid' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Refunded'
  date: string
  items: number
}
