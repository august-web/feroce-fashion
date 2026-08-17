import { Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import { formatMoney } from '../../data/products'
import { supabase } from '../../lib/supabase'
import { PageHead } from './AdminOrders'

/**
 * Site settings editor — writes the single `site_settings` row (admin RLS only).
 * The storefront utility bar reads the same row with the anon key, so saving here
 * updates the live bar immediately without a code change or redeploy.
 */
export function AdminSettings() {
  const [currency, setCurrency] = useState('GHS')
  const [shippingOver, setShippingOver] = useState(2000) // whole units in the form; minor units in the DB
  const [returnsDays, setReturnsDays] = useState(30)
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState('')

  useEffect(() => {
    if (!supabase) return
    supabase
      .from('site_settings')
      .select('currency_code,free_shipping_over_minor,returns_days')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) return setNote('Could not load settings — is the site_settings migration applied?')
        setCurrency(data.currency_code.trim())
        setShippingOver(data.free_shipping_over_minor / 100)
        setReturnsDays(data.returns_days)
      })
  }, [])

  async function save() {
    if (!supabase) return setNote('Supabase is not configured in this environment.')
    const code = currency.trim().toUpperCase()
    if (!/^[A-Z]{3}$/.test(code)) return setNote('Currency must be a 3-letter ISO code (e.g. GHS, USD, GBP).')
    const minor = Math.round(Number(shippingOver) * 100)
    if (!Number.isFinite(minor) || minor < 0) return setNote('Free-shipping threshold must be a valid amount.')
    if (!Number.isInteger(returnsDays) || returnsDays < 1 || returnsDays > 365) return setNote('Returns window must be a whole number of days (1–365).')
    setBusy(true)
    const { error } = await supabase
      .from('site_settings')
      .update({ currency_code: code, free_shipping_over_minor: minor, returns_days: returnsDays })
      .eq('id', 1)
    setBusy(false)
    if (error) return setNote(`Save failed: ${error.message}`)
    setNote('Saved — the storefront utility bar now shows these values.')
  }

  return <div><PageHead title="Site settings" copy="Currency, free-shipping threshold and returns policy for the storefront utility bar — updated live, no code changes." />
    <div className="max-w-xl border border-black/10 bg-white p-6 sm:p-8">
      <div className="space-y-5">
        <label className="block"><span className="mb-2 block text-[8px] uppercase tracking-widest text-black/45">Currency (ISO 4217 code)</span>
          <input value={currency} onChange={e => setCurrency(e.target.value)} maxLength={3} placeholder="GHS"
            className="w-full border border-black/15 bg-white p-3 text-sm uppercase outline-none focus:border-black" /></label>
        <label className="block"><span className="mb-2 block text-[8px] uppercase tracking-widest text-black/45">Free shipping over ({currency.trim() || 'GH₵'})</span>
          <input type="number" min={0} step={1} value={shippingOver} onChange={e => setShippingOver(Number(e.target.value))}
            className="w-full border border-black/15 bg-white p-3 text-sm outline-none focus:border-black" /></label>
        <label className="block"><span className="mb-2 block text-[8px] uppercase tracking-widest text-black/45">Returns window (days)</span>
          <input type="number" min={1} max={365} step={1} value={returnsDays} onChange={e => setReturnsDays(Number(e.target.value))}
            className="w-full border border-black/15 bg-white p-3 text-sm outline-none focus:border-black" /></label>
      </div>
      <div className="mt-6 border-t border-black/10 pt-5">
        <p className="text-[8px] uppercase tracking-widest text-black/40">Bar preview</p>
        <p className="mt-2 text-[10px] uppercase tracking-[.15em] text-ink/80">{currency.trim() || 'GHS'} · Free shipping over {formatMoney(Number(shippingOver) || 0, currency.trim() || 'GHS')} · {returnsDays || 0}-day returns</p>
      </div>
      <div className="mt-6 flex items-center gap-3 border-t border-black/10 pt-5">
        <button disabled={busy} onClick={save} className="flex items-center gap-2 bg-ink px-5 py-3 text-[8px] uppercase tracking-widest text-white disabled:opacity-50"><Save size={13} /> {busy ? 'Saving…' : 'Save settings'}</button>
        {note && <span className={`text-[9px] leading-4 ${note.startsWith('Saved') ? 'text-moss' : 'text-oxblood'}`}>{note}</span>}
      </div>
    </div>
    <p className="mt-4 text-[9px] leading-4 text-black/45">Writes the single <code>site_settings</code> row (admin RLS). The storefront reads it with the anonymous key, so changes appear immediately; the static fallback values in <code>src/context/SiteSettingsContext.tsx</code> only apply when Supabase is unconfigured.</p>
  </div>
}
