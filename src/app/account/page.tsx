import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { AccountClient, type OrderData } from './AccountClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Client Atelier Dashboard — FÉROCE',
  description: 'Manage your Dallas atelier acquisitions, pre-order allocations, and private Circle privileges.',
}

const PAID_STATUSES = ['paid', 'shipped', 'delivered']

export default async function AccountPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const admin = createAdminClient()

  // Fetch full customer profile row
  const { data: profile } = (await admin
    .from('profiles')
    .select('id, full_name, avatar_url, role, created_at')
    .eq('id', user.id)
    .single()) as {
    data: {
      id: string
      full_name?: string | null
      avatar_url?: string | null
      role?: string | null
      created_at: string
    } | null
  }

  // Fetch orders with order_items and joined products
  const { data: rawOrders } = (await admin
    .from('orders')
    .select(`
      id, total, status, payment_method, payment_provider, tracking_number, notes, shipping_address, created_at,
      order_items (
        id, name, product_name, price, quantity, color,
        products (slug, image_urls, name)
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })) as { data: OrderData[] | null }

  const orders = rawOrders || []

  // Count product reviews authored by this patron
  const { count: reviewCount } = await admin
    .from('product_reviews')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const paidOrders = orders.filter((o) => PAID_STATUSES.includes(o.status))
  const lifetimeSpend = paidOrders.reduce((sum, o) => sum + Number(o.total || 0), 0)

  return (
    <AccountClient
      user={{
        id: user.id,
        email: user.email || '',
        created_at: user.created_at,
      }}
      profile={profile}
      orders={orders}
      lifetimeSpend={lifetimeSpend}
      reviewCount={reviewCount || 0}
    />
  )
}
