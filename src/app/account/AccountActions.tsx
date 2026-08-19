'use client'

import { logoutAction } from '@/lib/auth-actions'

export function AccountActions() {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => logoutAction()}
        className="px-6 py-3 text-[11px] font-sans uppercase tracking-luxury text-navy border border-line hover:bg-navy hover:text-white transition-all min-h-[44px]"
      >
        Sign Out
      </button>
      <a
        href="/"
        className="px-6 py-3 text-[11px] font-sans uppercase tracking-luxury text-navy/50 hover:text-navy transition-colors min-h-[44px] flex items-center"
      >
        Back to Shop
      </a>
    </div>
  )
}
