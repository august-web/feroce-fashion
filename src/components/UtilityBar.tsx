import { Coins, RotateCcw, Truck, X } from 'lucide-react'
import { useState } from 'react'
import { useSiteSettings } from '../context/SiteSettingsContext'
import { formatMoney } from '../data/products'
import { readStorage, writeStorage } from '../lib/storage'

// Dismiss behavior stays a local preference (not a storefront policy). The
// displayed values come from the single `site_settings` source (useSiteSettings),
// editable by the client from the admin Settings module — no code changes.
const DISMISSIBLE = true
const STORAGE_KEY = 'feroce-utility-bar-dismissed'

export function UtilityBar() {
  const [show, setShow] = useState(() => !readStorage(STORAGE_KEY, false))
  const { currencyCode, freeShippingOverMinor, returnsDays } = useSiteSettings()
  if (!show) return null
  return <div className="relative border-b border-black/10 bg-bone px-9 py-1.5">
    <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-center gap-x-6 gap-y-1 text-[9px] uppercase tracking-[.15em] text-ink/80">
      <span className="flex items-center gap-1.5"><Coins size={12} strokeWidth={1.5}/>{currencyCode}</span>
      <span className="flex items-center gap-1.5"><Truck size={12} strokeWidth={1.5}/>Free shipping over {formatMoney(freeShippingOverMinor / 100, currencyCode)}</span>
      <span className="flex items-center gap-1.5"><RotateCcw size={12} strokeWidth={1.5}/>{returnsDays}-day returns</span>
    </div>
    {DISMISSIBLE && <button onClick={() => { setShow(false); writeStorage(STORAGE_KEY, true) }} className="absolute right-3 top-1/2 -translate-y-1/2 p-1" aria-label="Dismiss utility bar"><X size={13}/></button>}
  </div>
}
