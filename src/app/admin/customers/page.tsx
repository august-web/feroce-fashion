import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Customers — FÉROCE Admin',
  description: 'View your Féroce customer accounts.',
}

async function getCustomers() {
  const supabase = createAdminClient()

  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false }) as { data: Array<{
      id: string
      email: string
      role: string
      created_at: string
    }> | null }

  if (!profiles?.length) return []

  // Get order counts for each customer
  const customers = await Promise.all(
    profiles.map(async (profile: { id: string; email: string; role: string; created_at: string }) => {
      const { count } = await supabase
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', profile.id)

      return {
        ...profile,
        orderCount: count || 0,
      }
    })
  )

  return customers
}

export default async function AdminCustomersPage() {
  const customers = await getCustomers()

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-semibold text-navy">Customers</h1>
        <p className="text-sm text-navy/50 mt-1">{customers.length} registered customers</p>
      </div>

      <div className="bg-white border border-line overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line">
              <th className="px-5 py-3 text-left text-[10px] font-sans uppercase tracking-luxury text-navy/50 font-medium">Email</th>
              <th className="px-5 py-3 text-left text-[10px] font-sans uppercase tracking-luxury text-navy/50 font-medium">Role</th>
              <th className="px-5 py-3 text-left text-[10px] font-sans uppercase tracking-luxury text-navy/50 font-medium">Orders</th>
              <th className="px-5 py-3 text-left text-[10px] font-sans uppercase tracking-luxury text-navy/50 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-16 text-center text-sm text-navy/40">
                  No customers yet.
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.id} className="border-b border-line/50 last:border-0 hover:bg-cream/50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="text-navy">{customer.email}</p>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 ${
                      customer.role === 'admin' ? 'bg-navy/10 text-navy' : 'bg-cream text-navy/60'
                    }`}>
                      {customer.role}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-navy/60">{customer.orderCount}</td>
                  <td className="px-5 py-3 text-navy/40 text-xs">
                    {new Date(customer.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
