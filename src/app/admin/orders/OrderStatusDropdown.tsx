'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, Loader2 } from 'lucide-react'

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
        router.refresh()
      }
    } catch {
      // Silently fail
    } finally {
      setSaving(false)
    }
  }

  const statusStyles: Record<string, string> = {
    paid: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    shipped: 'bg-blue-50 text-blue-700 border-blue-200/80',
    cancelled: 'bg-rose-50 text-rose-700 border-rose-200/80',
    pending: 'bg-amber-50 text-amber-700 border-amber-200/80',
  }

  const currentStyle = statusStyles[status] || 'bg-gray-50 text-gray-700 border-gray-200'

  return (
    <div className="relative inline-flex items-center">
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value)}
        disabled={saving}
        aria-label="Order status"
        className={`appearance-none rounded-full border px-3 py-1.5 pr-7 text-[10px] font-mono uppercase tracking-[0.15em] font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold/30 disabled:opacity-60 transition-all ${currentStyle}`}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s} className="bg-white text-navy font-normal">
            {s.toUpperCase()}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-2.5 flex items-center">
        {saving ? (
          <Loader2 className="w-3 h-3 animate-spin text-navy/40" />
        ) : (
          <ChevronDown className="w-3 h-3 opacity-60" />
        )}
      </div>
    </div>
  )
}
