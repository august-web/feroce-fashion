import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'
import { Users, ShieldCheck, Sparkles, ShoppingBag } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Clientele — FÉROCE Admin',
  description: 'View and manage registered FÉROCE Circle clientele.',
}

async function getCustomers() {
  const supabase = createAdminClient()

  const { data: profiles } = (await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })) as {
    data: Array<{
      id: string
      email: string
      role: string
      created_at: string
    }> | null
  }

  if (!profiles?.length) return []

  const customers = await Promise.all(
    profiles.map(
      async (profile: { id: string; email: string; role: string; created_at: string }) => {
        const { count } = await supabase
          .from('orders')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', profile.id)

        return {
          ...profile,
          orderCount: count || 0,
        }
      }
    )
  )

  return customers
}

export default async function AdminCustomersPage() {
  const customers = await getCustomers()

  const adminCount = customers.filter((c) => c.role === 'admin').length
  const activeBuyers = customers.filter((c) => c.orderCount > 0).length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 text-gold-dark text-[10px] font-mono uppercase tracking-[0.2em] font-semibold mb-2">
          <Sparkles className="w-3 h-3 text-gold" />
          <span>Clientele & Circle Members</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-navy tracking-tight">
          The FÉROCE Circle Directory
        </h1>
        <p className="text-xs sm:text-sm text-navy/60 mt-1 max-w-xl">
          Registered client dossiers, role verifications, and lifetime order tallies.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-[28px] p-5 border border-gray-200/80 shadow-sm">
          <div className="flex items-center justify-between text-navy/50 mb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider">Total Members</span>
            <Users className="w-4 h-4 text-navy/40" />
          </div>
          <div className="text-2xl font-serif font-bold text-navy">{customers.length}</div>
          <div className="text-[10px] font-mono text-navy/40 mt-1">Registered atelier accounts</div>
        </div>

        <div className="bg-white rounded-[28px] p-5 border border-gray-200/80 shadow-sm">
          <div className="flex items-center justify-between text-gold mb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider">
              Atelier Directors
            </span>
            <ShieldCheck className="w-4 h-4 text-gold" />
          </div>
          <div className="text-2xl font-serif font-bold text-navy">{adminCount}</div>
          <div className="text-[10px] font-mono text-gold-dark mt-1">Full control permissions</div>
        </div>

        <div className="bg-white rounded-[28px] p-5 border border-gray-200/80 shadow-sm">
          <div className="flex items-center justify-between text-emerald-600 mb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider">Active Collectors</span>
            <ShoppingBag className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-serif font-bold text-navy">{activeBuyers}</div>
          <div className="text-[10px] font-mono text-emerald-600 mt-1">With placed acquisitions</div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-[32px] sm:rounded-[40px] border border-gray-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="font-serif text-lg font-semibold text-navy">Member Directory</h2>
            <p className="text-xs text-navy/50 mt-0.5">{customers.length} verified accounts</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] font-mono uppercase tracking-[0.16em] text-navy/40">
                <th className="pb-3 px-3">Client Profile</th>
                <th className="pb-3 px-3">Privilege Tier</th>
                <th className="pb-3 px-3">Orders</th>
                <th className="pb-3 px-3 text-right">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center text-navy/40 font-mono text-xs">
                    No registered clientele yet.
                  </td>
                </tr>
              ) : (
                customers.map((customer) => {
                  const initial = (customer.email[0] || 'C').toUpperCase()
                  const isAdmin = customer.role === 'admin'

                  return (
                    <tr key={customer.id} className="hover:bg-[#FBFBFC] transition-colors">
                      {/* Avatar & Email */}
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-navy text-white font-serif font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                            {initial}
                          </div>
                          <div>
                            <div className="font-medium text-navy text-xs sm:text-sm">
                              {customer.email}
                            </div>
                            <div className="text-[10px] font-mono text-navy/40 truncate max-w-[200px]">
                              ID: {customer.id.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-4 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold ${
                            isAdmin
                              ? 'bg-gold/15 text-gold-dark border border-gold/30'
                              : 'bg-gray-100 text-navy/70 border border-gray-200/60'
                          }`}
                        >
                          {isAdmin && <ShieldCheck className="w-3 h-3 text-gold" />}
                          <span>{isAdmin ? 'Atelier Director' : 'Circle Member'}</span>
                        </span>
                      </td>

                      {/* Orders */}
                      <td className="py-4 px-3">
                        <span className="font-mono text-xs font-semibold text-navy bg-[#F6F6F8] px-3 py-1 rounded-full border border-gray-200/60">
                          {customer.orderCount} {customer.orderCount === 1 ? 'order' : 'orders'}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-3 text-right font-mono text-[11px] text-navy/40 whitespace-nowrap">
                        {new Date(customer.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
