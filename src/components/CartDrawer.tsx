import { Minus, Plus, ShoppingBag, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatMoney } from '../data/products'
import { ButtonLink } from './ui/Button'

export function CartDrawer() {
  const cart = useCart()
  if (!cart.isOpen) return null
  return <div className="fixed inset-0 z-[90]" role="dialog" aria-modal="true" aria-label="Shopping bag">
    <button className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" onClick={cart.close} aria-label="Close shopping bag"/>
    <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-ivory shadow-2xl animate-reveal">
      <div className="flex items-center justify-between border-b border-black/10 px-5 py-5 sm:px-7">
        <div className="flex items-center gap-3"><ShoppingBag size={19} strokeWidth={1.4}/><span className="text-xs font-medium uppercase tracking-luxury">Your Bag ({cart.count})</span></div>
        <button onClick={cart.close} className="p-1" aria-label="Close"><X size={21}/></button>
      </div>
      {cart.lines.length === 0 ? <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <ShoppingBag size={34} strokeWidth={1}/><h2 className="mt-6 font-display text-3xl">Your bag is waiting.</h2><p className="mt-3 max-w-xs text-sm leading-6 text-black/55">Discover the new designer bags — made to be worn every day.</p><ButtonLink to="/shop" className="mt-8" children="Explore the collection"/>
      </div> : <>
        <div className="flex-1 overflow-y-auto px-5 sm:px-7">{cart.lines.map(line => { const key = cart.lineKey(line); return <div key={key} className="grid grid-cols-[98px_1fr] gap-4 border-b border-black/10 py-6">
          <Link to={`/product/${line.product.slug}`} onClick={cart.close}><img src={line.product.image} alt={line.product.name} className="aspect-square w-full object-cover"/></Link>
          <div className="flex min-w-0 flex-col"><div className="flex justify-between gap-2"><div><p className="text-[9px] uppercase tracking-[.18em] text-black/45">{line.product.category}</p><h3 className="mt-1 font-display text-xl leading-tight">{line.product.name}</h3></div><button className="self-start text-black/45 hover:text-black" onClick={() => cart.remove(key)} aria-label={`Remove ${line.product.name}`}><X size={16}/></button></div>
          <p className="mt-2 text-xs text-black/55">{line.color} · {line.variant}</p><div className="mt-auto flex items-end justify-between pt-3"><div className="flex items-center border border-black/15"><button onClick={() => cart.update(key, line.quantity - 1)} className="p-2" aria-label="Decrease"><Minus size={12}/></button><span className="w-7 text-center text-xs">{line.quantity}</span><button onClick={() => cart.update(key, line.quantity + 1)} className="p-2" aria-label="Increase"><Plus size={12}/></button></div><div className="text-right"><p className="text-sm">{formatMoney(line.product.price * line.quantity)}</p></div></div></div>
        </div>})}</div>
        <div className="border-t border-black/10 bg-bone px-5 py-6 sm:px-7"><div className="flex justify-between font-display text-2xl"><span>Subtotal</span><span>{formatMoney(cart.subtotal)}</span></div><p className="mt-2 text-[10px] leading-4 text-black/50">Shipping and taxes are calculated at checkout.</p>{/* Primary/secondary: checkout is the conversion action (dark primary); continue shopping keeps browsing (text secondary). */}<ButtonLink to="/checkout" onClick={cart.close} className="mt-5 w-full">Proceed to checkout</ButtonLink><button className="mt-4 w-full text-center text-[10px] uppercase tracking-luxury underline underline-offset-4" onClick={cart.close}>Continue shopping</button></div>
      </>}
    </aside>
  </div>
}
