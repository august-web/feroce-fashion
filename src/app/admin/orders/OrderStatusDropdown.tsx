'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const STATUSES = ['pending', 'paid', 'shipped', 'cancelled'] as const

interface OrderStatusDropdownProps {
  orderId: string
  currentStatus: string
}

export function OrderStatusDropdown({ orderId, currentStatus }: OrderStatusDropdownProps) {
  const [status, setStatus] = useState(currentStatus)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  const handleChange = async (newStatus: string) => {
    setStatus(newStatus)
    setSaving(true)

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        // Re-render server components (dashboard "Ready to Pack" lists, etc.)
        router.refresh()
      }
    } catch {
      // Silently fail — in production, show error toast
    } finally {
      setSaving(false)
    }
  }

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value)}
      disabled={saving}
      className={`appearance-none bg-white border px-2 py-1 text-[10px] font-sans uppercase tracking-wider font-medium cursor-pointer min-h-[32px] focus:outline-none focus:border-navy/30 disabled:opacity-50 ${
        status === 'paid' ? 'border-green-200 text-green-700' :
        status === 'shipped' ? 'border-blue-200 text-blue-700' :
        status === 'cancelled' ? 'border-red-200 text-red-700' :
        'border-yellow-200 text-yellow-700'
      }`}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 6px center',
        paddingRight: '20px',
      }}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  )
}
