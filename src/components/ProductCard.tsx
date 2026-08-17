import { Eye, Heart, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Product } from '../types'
import { formatMoney } from '../data/products'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useToast } from '../context/ToastContext'

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const cart = useCart(); const wishlist = useWishlist(); const { notify } = useToast()
  const saved = wishlist.has(product.slug)
  return <article className="group relative min-w-0">
    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#f2efe9] ring-1 ring-black/[.06] transition duration-300 group-hover:shadow-[0_18px_40px_-18px_rgba(20,18,16,.28)]">
      <Link to={`/product/${product.slug}`} aria-label={`View ${product.name}`}>
        <img src={product.image} alt={`${product.name} in ${product.colors[0].name}`} loading={priority ? 'eager' : 'lazy'} className={`h-full w-full object-cover transition duration-300 ease-out ${product.alternateImage ? 'group-hover:opacity-0' : 'group-hover:scale-[1.03]'}`}/>
        {product.alternateImage && <img src={product.alternateImage} alt={`${product.name} editorial view`} loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-300 ease-out group-hover:opacity-100"/>}
      </Link>
      {product.badge && <span className={`absolute left-3 top-3 rounded-full px-3 py-1.5 text-[8px] font-semibold tracking-[.17em] ${product.badge === 'PRE-ORDER' ? 'bg-oxblood text-white' : 'bg-white/95 text-ink'}`}>{product.badge}</span>}
      <button onClick={() => { wishlist.toggle(product); notify(saved ? 'Removed from your wishlist.' : 'Saved to your wishlist.') }} className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/95 shadow-sm transition hover:bg-white" aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name}`}><Heart size={16} fill={saved ? 'currentColor' : 'none'} strokeWidth={1.3}/></button>
      <div className="absolute bottom-0 left-0 right-0 translate-y-full transition duration-300 group-hover:translate-y-0"><button onClick={() => { cart.add(product); notify(`${product.name} added to your bag.`) }} className="flex w-full items-center justify-center gap-2 rounded-b-2xl bg-ink/95 px-4 py-4 font-display text-[9px] font-semibold uppercase tracking-luxury text-white backdrop-blur transition hover:bg-oxblood"><Plus size={13}/> Add to bag</button></div>
      <Link to={`/product/${product.slug}`} className="absolute bottom-14 right-3 hidden h-9 w-9 place-items-center rounded-full bg-white/95 shadow-sm md:grid" aria-label={`Quick view ${product.name}`}><Eye size={15} strokeWidth={1.3}/></Link>
    </div>
    <div className="pt-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-[8px] font-medium uppercase tracking-[.18em] text-black/45">{product.gender} · {product.category}</p><Link to={`/product/${product.slug}`}><h3 className="mt-1 truncate font-display text-base font-semibold uppercase leading-tight tracking-wide transition hover:text-oxblood">{product.name}</h3></Link><p className="mt-1 text-xs text-black/50">{product.subtitle}</p></div><div className="shrink-0 text-right"><p className="font-display text-sm font-semibold">{formatMoney(product.price)}</p></div></div>
      <div className="mt-3 flex items-center justify-between"><div className="flex gap-1.5" aria-label="Available colors">{product.colors.map(c => <span key={c.name} title={c.name} className="h-3 w-3 rounded-full border border-black/20" style={{backgroundColor:c.hex}}/>)}</div><span className="text-[8px] font-medium uppercase tracking-[.12em] text-black/45">{product.availability}</span></div>
      <button onClick={() => { cart.add(product); notify(`${product.name} added to your bag.`) }} className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-black/15 py-3 font-display text-[9px] font-semibold uppercase tracking-[.16em] transition hover:bg-ink hover:text-white md:hidden"><Plus size={12}/> Add to bag</button>
    </div>
  </article>
}
