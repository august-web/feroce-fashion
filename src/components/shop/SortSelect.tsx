'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'
import { ChevronDown } from 'lucide-react'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest Releases' },
  { value: 'price-low', label: 'Price: Low → High' },
  { value: 'price-high', label: 'Price: High → Low' },
]

interface SortSelectProps {
  currentSort: string
}

export function SortSelect({ currentSort }: SortSelectProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'newest') {
      params.delete('sort')
    } else {
      params.set('sort', value)
    }
    startTransition(() => {
      router.push(`/shop?${params.toString()}`, { scroll: false })
    })
  }

  return (
    <div className="relative inline-flex items-center">
      <select
        value={currentSort}
        onChange={(e) => handleChange(e.target.value)}
        disabled={isPending}
        className="appearance-none bg-white border border-gray-200 hover:border-gray-300 rounded-full pl-5 pr-10 py-2.5 sm:py-3 text-xs font-semibold text-navy focus:outline-none focus:ring-2 focus:ring-navy/5 focus:border-navy cursor-pointer transition-all duration-200 shadow-sm disabled:opacity-50"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="w-3.5 h-3.5 text-navy/60 pointer-events-none absolute right-4" />
    </div>
  )
}
