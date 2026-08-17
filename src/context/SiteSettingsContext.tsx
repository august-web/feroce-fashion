import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import type { SiteSettings } from '../types'

/**
 * Site-wide storefront settings — the single source of truth for the utility bar
 * (currency, free-shipping threshold, returns window). Values live in the
 * single-row `site_settings` table so the client can edit them from the admin
 * Settings module without code changes. The values below are the static
 * fallback used while Supabase is unconfigured or the query is pending.
 */
const FALLBACK: Pick<SiteSettings, 'currencyCode' | 'freeShippingOverMinor' | 'returnsDays'> = {
  currencyCode: 'GHS',
  freeShippingOverMinor: 200000, // GH₵2,000 in minor units
  returnsDays: 30,
}

const SiteSettingsContext = createContext<SiteSettings | null>(null)

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [value, setValue] = useState<SiteSettings>(() => ({ ...FALLBACK, source: 'static', loading: true }))

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        if (!supabase) throw new Error('Supabase unconfigured')
        const { data, error } = await supabase
          .from('site_settings')
          .select('currency_code,free_shipping_over_minor,returns_days')
          .eq('id', 1)
          .maybeSingle()
        if (error || !data) throw new Error(error?.message ?? 'settings row missing')
        if (cancelled) return
        setValue({
          currencyCode: data.currency_code,
          freeShippingOverMinor: data.free_shipping_over_minor,
          returnsDays: data.returns_days,
          source: 'live',
          loading: false,
        })
      } catch {
        // Unconfigured or query failed — keep the static fallback.
        if (!cancelled) setValue(v => ({ ...v, loading: false }))
      }
    })()
    return () => { cancelled = true }
  }, [])

  const memo = useMemo(() => value, [value])
  return <SiteSettingsContext.Provider value={memo}>{children}</SiteSettingsContext.Provider>
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext)
  if (!context) throw new Error('useSiteSettings must be used within SiteSettingsProvider')
  return context
}
