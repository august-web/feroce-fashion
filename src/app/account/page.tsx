import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { formatPrice } from '@/lib/types'
import { AccountActions } from './AccountActions'

export const metadata: Metadata = {
  title: 'My Account — FÉROCE',
  description: 'View your orders and account details.',
}

const PAID_STATUSES = ['paid', 'shipped', 'delivered']

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-700',
  paid: 'bg-green-50 text-green-700',
  shipped: 'bg-blue-50 text-blue-700',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-50 text-red-700',
  refunded: 'bg-gray-100 text-gray-600',
}

const PAYMENT_LABELS: Record<string, string> = {
  card: 'Card',
  apple_pay: 'Apple Pay',
  google_pay: 'Google Pay',
  cashapp: 'Cash App',
}

interface OrderItem {
  id: string
  product_name: string
  quantity: number
  price: number
  products?: { slug?: string; image_urls?: string[] } | null
}

interface Order {
  id: string
  total: number
  status: string
  payment_method: string
  payment_provider: string
  created_at: string
  order_items?: OrderItem[]
}

function initialsOf(name: string, email: string) {
  const source = name.trim() || email
  const parts = source.split(/[\s@._]+/).filter(Boolean)
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || 'F'
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Orders with their line items + product thumbnails for the history cards.
  const admin = createAdminClient()
  const { data: orders } = await admin
    .from('orders')
    .select('id, total, status, payment_method, payment_provider, created_at, order_items(product_name, quantity, price, products(slug, image_urls))')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false }) as { data: Order[] | null }

  const { count: reviewCount } = await admin
    .from('product_reviews')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const paidOrders = (orders || []).filter((o) => PAID_STATUSES.includes(o.status))
  const lifetimeSpend = paidOrders.reduce((sum, o) => sum + o.total, 0)

  const displayName = user.user_metadata?.name || user.email?.split('@')[0] || 'Member'
  const initials = initialsOf(user.user_metadata?.name || '', user.email || '')

  return (
    <section className="bg-cream min-h-[70svh]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 py-10 sm:py-14 md:py-16">
        {/* ── Header ── */}
        <div className="flex flex-wrap items-center gap-5 mb-10 sm:mb-12">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-navy text-cream flex items-center justify-center font-serif text-xl sm:text-2xl tracking-wider ring-2 ring-gold/60 ring-offset-2 ring-offset-cream">
            {initials}
          </div>
          <div>
            <p className="label mb-1.5 text-navy/40">Welcome back</p>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-navy">
              {displayName}
            </h1>
            <p className="text-xs text-navy/40 mt-1.5">
              Member since {formatDate(user.created_at)}
            </p>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-10 sm:mb-12">
          <div className="bg-white border border-line p-4 sm:p-6 text-center">
            <p className="font-serif text-2xl sm:text-3xl text-navy">{orders?.length || 0}</p>
            <p className="label mt-1.5 text-navy/40">Orders</p>
          </div>
          <div className="bg-white border border-line p-4 sm:p-6 text-center">
            <p className="font-serif text-2xl sm:text-3xl text-navy">{formatPrice(lifetimeSpend)}</p>
            <p className="label mt-1.5 text-navy/40">Lifetime Spend</p>
          </div>
          <div className="bg-white border border-line p-4 sm:p-6 text-center">
            <p className="font-serif text-2xl sm:text-3xl text-navy">{reviewCount || 0}</p>
            <p className="label mt-1.5 text-navy/40">Reviews</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:gap-12">
          {/* ── Order history ── */}
          <div>
            <h2 className="label mb-4">Order History</h2>

            {!orders || orders.length === 0 ? (
              <div className="bg-white border border-line text-center py-14 px-6">
                <p className="font-serif text-xl text-navy mb-2">No orders yet.</p>
                <p className="text-sm text-navy/50 mb-6">Your first FÉROCE piece is waiting.</p>
                <Link href="/shop" className="btn-primary inline-block">Start Shopping</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white border border-line p-5 sm:p-6">
                    <div className="flex flex-wrap justify-between gap-3 mb-4">
                      <div>
                        <p className="text-sm font-medium text-navy">
                          Order #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="text-[10px] text-navy/40 mt-0.5">{formatDate(order.created_at)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-navy">{formatPrice(order.total)}</p>
                        <span className={`inline-block mt-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 ${
                          STATUS_STYLES[order.status] || STATUS_STYLES.pending
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>

                    {/* Line items with thumbnails */}
                    {order.order_items && order.order_items.length > 0 && (
                      <div className="border-t border-line pt-4 space-y-3">
                        {order.order_items.map((item) => {
                          const image = item.products?.image_urls?.[0]
                          const slug = item.products?.slug
                          return (
                            <div key={item.id} className="flex items-center gap-3">
                              {image ? (
                                <Link href={`/product/${slug}`} className="shrink-0">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={image}
                                    alt={item.product_name}
                                    className="w-12 h-14 object-cover border border-line"
                                    loading="lazy"
                                  />
                                </Link>
                              ) : (
                                <div className="w-12 h-14 bg-cream border border-line shrink-0" />
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium text-navy truncate">{item.product_name}</p>
                                <p className="text-[10px] text-navy/40">Qty {item.quantity}</p>
                              </div>
                              <p className="text-xs text-navy/70">{formatPrice(item.price * item.quantity)}</p>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    <p className="text-[10px] text-navy/40 mt-4">
                      {PAYMENT_LABELS[order.payment_method] || 'Bank Transfer'}{' '}
                      {' • '}{order.payment_provider}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-4">
            <div className="bg-white border border-line p-6">
              <h2 className="label mb-4">Account Details</h2>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-navy/50">Email</span>
                  <span className="text-navy truncate">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-navy/50">Member since</span>
                  <span className="text-navy">{formatDate(user.created_at)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-line p-6">
              <h2 className="label mb-4">Quick Links</h2>
              <div className="space-y-1">
                <Link href="/wishlist" className="flex items-center justify-between py-2 text-sm text-navy/70 hover:text-navy transition-colors">
                  Wishlist
                  <span className="text-navy/30">→</span>
                </Link>
                <Link href="/shop" className="flex items-center justify-between py-2 text-sm text-navy/70 hover:text-navy transition-colors">
                  Shop the Collection
                  <span className="text-navy/30">→</span>
                </Link>
                <Link href="/contact" className="flex items-center justify-between py-2 text-sm text-navy/70 hover:text-navy transition-colors">
                  Contact Support
                  <span className="text-navy/30">→</span>
                </Link>
              </div>
            </div>

            <div className="bg-white border border-line p-6">
              <h2 className="label mb-4">Session</h2>
              <AccountActions />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
