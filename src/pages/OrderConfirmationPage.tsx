import { useEffect, useState } from 'react'
import { Check, PackageCheck } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { ButtonLink } from '../components/ui/Button'
import { useCatalog } from '../context/CatalogContext'
import { formatMoney, products as staticProducts } from '../data/products'
import { useSeo } from '../lib/seo'

interface VerifiedOrder {
  status: 'paid'
  orderNumber: string
  email: string
  totalMinor: number
  currency: string
  items: { productName: string; quantity: number; unitPriceMinor: number }[]
}

export function OrderConfirmationPage() {
  useSeo('Order confirmation', 'Order status and delivery details for your FÉROCE purchase.')
  const [params] = useSearchParams()
  const preview = params.get('preview') === 'true'
  const sessionId = params.get('session_id') || ''
  const { products } = useCatalog()
  const [order, setOrder] = useState<VerifiedOrder | null>(null)
  const [state, setState] = useState<'loading' | 'notfound' | 'pending' | 'paid' | 'error'>('loading')

  useEffect(() => {
    if (preview) return
    if (!sessionId) return setState('notfound')
    let cancelled = false
    fetch(`/api/checkout/status?session_id=${encodeURIComponent(sessionId)}`)
      .then(async r => {
        const data = await r.json().catch(() => null)
        if (cancelled) return
        if (r.ok && data?.status === 'paid') { setOrder(data as VerifiedOrder); setState('paid') }
        else setState(data?.status === 'pending' ? 'pending' : 'notfound')
      })
      .catch(() => { if (!cancelled) setState('error') })
    return () => { cancelled = true }
  }, [preview, sessionId])

  if (!preview && !sessionId) return <StateGate state="notfound" />
  if (!preview && state === 'loading') return <main className="grid min-h-[70svh] place-items-center bg-ivory"><span className="text-[9px] uppercase tracking-luxury animate-pulse">Verifying payment…</span></main>
  if (!preview && state === 'pending') return <StateGate state="pending" />
  if (!preview && state === 'error') return <StateGate state="notfound" />
  if (!preview && state === 'notfound') return <StateGate state="notfound" />

  // Preview layout or a fully verified live order.
  if (preview) {
    const item = products[0] ?? staticProducts[0]
    return <main className="min-h-screen bg-bone px-5 py-16 sm:px-8 md:py-24"><div className="mx-auto max-w-3xl bg-ivory p-6 shadow-[0_20px_80px_rgba(20,18,16,.08)] sm:p-12 md:p-16"><div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-moss text-moss"><Check size={23} /></div><div className="text-center"><p className="mt-7 text-[9px] uppercase tracking-luxury text-oxblood">Order preview</p><h1 className="mt-4 font-display text-5xl leading-none sm:text-6xl">Thank you for<br />choosing FÉROCE.</h1><p className="mx-auto mt-5 max-w-md text-sm leading-6 text-black/50">This preview shows your confirmation once checkout is live. Your order appears here after payment is verified.</p></div><div className="mt-10 border-y border-black/10 py-7"><div className="grid grid-cols-2 gap-6 text-xs sm:grid-cols-4"><Data label="Order number" value="Preview" /><Data label="Payment" value="Not charged" /><Data label="Status" value="Preview" /><Data label="Delivery" value="To be confirmed" /></div></div><div className="mt-8"><p className="text-[9px] uppercase tracking-luxury text-black/45">Items</p><div className="mt-4 grid grid-cols-[86px_1fr_auto] items-center gap-4"><img src={item.image} alt={item.name} className="aspect-square object-cover" /><div><h2 className="font-display text-xl">{item.name}</h2><p className="mt-1 text-[9px] text-black/50">Noir · Classic · Qty 1</p></div><div className="text-right text-xs"><p>{formatMoney(item.price)}</p></div></div></div><div className="mt-8 flex justify-between border-t border-black/10 pt-6 font-display text-2xl"><span>Total</span><span>{formatMoney(item.price)}</span></div>{/* Primary/secondary: view the order is the task action (dark); continue shopping returns to the store (outline). */}<div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row"><ButtonLink to="/account">View order</ButtonLink><ButtonLink to="/shop" variant="outline">Continue shopping</ButtonLink></div></div></main>
  }

  // Live verified order.
  return <main className="min-h-screen bg-bone px-5 py-16 sm:px-8 md:py-24"><div className="mx-auto max-w-3xl bg-ivory p-6 shadow-[0_20px_80px_rgba(20,18,16,.08)] sm:p-12 md:p-16"><div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-moss text-moss"><Check size={23} /></div><div className="text-center"><p className="mt-7 text-[9px] uppercase tracking-luxury text-moss">Payment verified</p><h1 className="mt-4 font-display text-5xl leading-none sm:text-6xl">Thank you for<br />choosing FÉROCE.</h1><p className="mx-auto mt-5 max-w-md text-sm leading-6 text-black/50">A confirmation was sent to {order?.email}. Order status updates are reflected in your account.</p></div><div className="mt-10 border-y border-black/10 py-7"><div className="grid grid-cols-2 gap-6 text-xs sm:grid-cols-4"><Data label="Order number" value={order?.orderNumber ?? '—'} /><Data label="Payment" value="Paid" /><Data label="Status" value="Confirmed" /><Data label="Currency" value={order?.currency ?? 'GHS'} /></div></div><div className="mt-8"><p className="text-[9px] uppercase tracking-luxury text-black/45">Items</p><div className="mt-4 space-y-3">{order?.items.map(i => <div key={i.productName} className="flex items-center justify-between border-b border-black/10 pb-3 text-xs"><div><p className="font-display text-lg">{i.productName}</p><p className="mt-1 text-[9px] text-black/50">Qty {i.quantity}</p></div><p>{formatMoney(i.unitPriceMinor * i.quantity / 100)}</p></div>)}</div></div><div className="mt-8 flex justify-between border-t border-black/10 pt-6 font-display text-2xl"><span>Total paid</span><span>{formatMoney((order?.totalMinor ?? 0) / 100)}</span></div>{/* Primary/secondary: view the order is the task action (dark); continue shopping returns to the store (outline). */}<div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row"><ButtonLink to="/account">View order</ButtonLink><ButtonLink to="/shop" variant="outline">Continue shopping</ButtonLink></div></div></main>
}

function StateGate({ state }: { state: 'notfound' | 'pending' }) {
  return <main className="grid min-h-[70svh] place-items-center bg-ivory px-5 text-center"><div className="max-w-lg"><PackageCheck className="mx-auto" size={38} strokeWidth={1} /><h1 className="mt-6 font-display text-5xl">{state === 'pending' ? 'Payment pending.' : 'No verified order found.'}</h1><p className="mt-4 text-sm leading-6 text-black/55">{state === 'pending' ? 'Your payment is still being verified. Refresh this page in a moment, or check your account orders.' : 'A confirmation appears only after the server verifies a successful payment webhook. If you have completed a live payment, sign in to view your order status.'}</p>{/* Primary/secondary: view the order is the task action (dark); continue shopping returns to the store (outline). */}<div className="mt-8 flex justify-center gap-3"><ButtonLink to="/account">View orders</ButtonLink><ButtonLink to="/shop" variant="outline">Continue shopping</ButtonLink></div></div></main>
}

function Data({ label, value }: { label: string; value: string }) {
  return <div><p className="text-[8px] uppercase tracking-[.14em] text-black/40">{label}</p><p className="mt-2">{value}</p></div>
}
