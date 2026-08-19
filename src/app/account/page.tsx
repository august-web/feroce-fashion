import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/types'
import { AccountActions } from './AccountActions'

export const metadata: Metadata = {
  title: 'My Account — FÉROCE',
  description: 'View your orders and account details.',
}

export default async function AccountPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch user's orders
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false }) as { data: Array<{
      id: string
      total: number
      status: string
      payment_method: string
      payment_provider: string
      created_at: string
    }> | null }

  const displayName = user.user_metadata?.name || user.email?.split('@')[0] || 'Member'

  return (
    <section className="bg-cream min-h-[70svh]">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 md:px-8 py-10 sm:py-14 md:py-20">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <p className="label mb-2 text-navy/40">Welcome back</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-navy">
            {displayName}
          </h1>
          <div className="mt-4 h-px w-16 bg-gold/40" />
        </div>

        {/* Account info */}
        <div className="bg-white border border-line p-6 mb-8">
          <h2 className="label mb-4">Account Details</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-navy/50">Email</span>
              <span className="text-navy">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-navy/50">Member since</span>
              <span className="text-navy">
                {new Date(user.created_at).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Order history */}
        <div className="bg-white border border-line p-6 mb-8">
          <h2 className="label mb-4">Order History</h2>

          {!orders || orders.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-sm text-navy/40 mb-4">No orders yet.</p>
              <a href="/shop" className="btn-primary inline-block">Start Shopping</a>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border border-line p-4">
                  <div className="flex flex-wrap justify-between gap-2 mb-2">
                    <div>
                      <p className="text-xs font-medium text-navy">
                        Order #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-[10px] text-navy/40 mt-0.5">
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-navy">{formatPrice(order.total)}</p>
                      <span className={`inline-block mt-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 ${
                        order.status === 'paid' ? 'bg-green-50 text-green-700' :
                        order.status === 'shipped' ? 'bg-blue-50 text-blue-700' :
                        order.status === 'cancelled' ? 'bg-red-50 text-red-700' :
                        'bg-yellow-50 text-yellow-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-[10px] text-navy/40">
                    {order.payment_method === 'paypal' ? 'PayPal' : 
                     order.payment_method === 'card' ? 'Card' :
                     order.payment_method === 'apple_pay' ? 'Apple Pay' :
                     order.payment_method === 'google_pay' ? 'Google Pay' :
                     order.payment_method === 'cashapp' ? 'Cash App' :
                     'Bank Transfer'}
                    {' • '}{order.payment_provider}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Logout */}
        <AccountActions />
      </div>
    </section>
  )
}
