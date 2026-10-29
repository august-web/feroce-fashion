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
    <div className="p-5 sm:p-8 lg:p-12 space-y-10 max-w-[1440px] mx-auto font-sans">
      {/* ── Page Header ── */}
      <div className="pb-8 sm:pb-10 border-b border-gray-100 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="max-w-3xl">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 bg-[#F6F6F8] border border-gray-200/80 text-[11px] font-semibold tracking-wider uppercase text-navy/70 mb-4 sm:mb-5 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
            Clientele Registry · Dallas, TX
          </div>

          {/* Large display heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-sans font-bold text-navy tracking-[-0.035em] leading-[1.05]">
            The FÉROCE Circle Directory
          </h1>

          <p className="mt-4 text-sm sm:text-base text-navy/60 max-w-2xl leading-relaxed font-normal">
            Verified client dossiers, role verifications, and lifetime order tallies.
          </p>
        </div>

        {/* Right side stats pill */}
        <div className="flex items-center lg:flex-col lg:items-end gap-3 pt-2 lg:pt-0">
          <div className="backdrop-blur-md bg-[#F6F6F8] border border-gray-200/80 rounded-full px-5 py-2.5 shadow-xs inline-flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-navy tracking-tight">
              {customers.length} Verified Accounts
            </span>
          </div>
        </div>
      </div>

      {/* ── Metrics Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="rounded-[28px] sm:rounded-[32px] bg-[#F6F6F8] border border-gray-200/80 p-6 sm:p-7 shadow-xs">
          <div className="flex items-center justify-between text-navy/50 mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Members</span>
            <div className="w-10 h-10 rounded-2xl bg-white border border-gray-200/70 flex items-center justify-center text-navy shadow-2xs">
              <Users size={18} />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-bold text-navy tracking-tight">{customers.length}</div>
          <div className="text-xs text-navy/50 mt-1">Registered atelier accounts</div>
        </div>

        <div className="rounded-[28px] sm:rounded-[32px] bg-gold/10 border border-gold/30 p-6 sm:p-7 shadow-xs">
          <div className="flex items-center justify-between text-gold-dark mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Atelier Directors</span>
            <div className="w-10 h-10 rounded-2xl bg-white border border-gold/40 flex items-center justify-center text-gold shadow-2xs">
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-bold text-navy tracking-tight">{adminCount}</div>
          <div className="text-xs text-gold-dark mt-1 font-semibold">Full control permissions</div>
        </div>

        <div className="rounded-[28px] sm:rounded-[32px] bg-emerald-50/70 border border-emerald-200/80 p-6 sm:p-7 shadow-xs">
          <div className="flex items-center justify-between text-emerald-800 mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Active Collectors</span>
            <div className="w-10 h-10 rounded-2xl bg-white border border-emerald-200/60 flex items-center justify-center text-emerald-600 shadow-2xs">
              <ShoppingBag size={18} />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-bold text-emerald-950 tracking-tight">{activeBuyers}</div>
          <div className="text-xs text-emerald-800/70 mt-1">With placed acquisitions</div>
        </div>
      </div>

      {/* ── Table Card ── */}
      <div className="rounded-[32px] sm:rounded-[40px] bg-white border border-gray-200/80 p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.02)] space-y-6">
        <div className="flex items-center justify-between pb-5 border-b border-gray-100">
          <div>
            <h2 className="font-sans font-bold text-xl text-navy tracking-tight">Member Registry</h2>
            <p className="text-xs text-navy/50 font-sans mt-0.5">{customers.length} verified accounts</p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-[24px] border border-gray-200/80">
          <table className="w-full text-left text-sm font-sans">
            <thead>
              <tr className="bg-[#F6F6F8] border-b border-gray-200/80 text-[10px] font-bold uppercase tracking-[0.14em] text-navy/55">
                <th className="px-5 py-4">Client Profile</th>
                <th className="px-5 py-4">Privilege Tier</th>
                <th className="px-5 py-4">Orders Placed</th>
                <th className="px-5 py-4 text-right">Member Since</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-navy/40 text-xs">
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
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-navy text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-2xs font-sans">
                            {initial}
                          </div>
                          <div>
                            <div className="font-bold text-xs sm:text-sm text-navy">
                              {customer.email}
                            </div>
                            <div className="text-[10px] font-mono text-navy/40 truncate max-w-[200px] mt-0.5">
                              ID: {customer.id.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isAdmin
                              ? 'bg-gold/15 text-gold-dark border border-gold/30 shadow-2xs'
                              : 'bg-[#F6F6F8] text-navy/70 border border-gray-200/70'
                          }`}
                        >
                          {isAdmin && <ShieldCheck size={12} className="text-gold" />}
                          <span>{isAdmin ? 'Atelier Director' : 'Circle Member'}</span>
                        </span>
                      </td>

                      {/* Orders */}
                      <td className="px-5 py-4">
                        <span className="font-bold text-xs text-navy bg-[#F6F6F8] px-3.5 py-1 rounded-full border border-gray-200/60 shadow-2xs">
                          {customer.orderCount} {customer.orderCount === 1 ? 'Acquisition' : 'Acquisitions'}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 text-right text-[11px] text-navy/50 whitespace-nowrap">
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
