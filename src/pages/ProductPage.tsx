import { useMemo, useState } from 'react'
import { Heart, Minus, Plus, Share2, ShieldCheck, Truck } from 'lucide-react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Accordion } from '../components/Accordion'
import { ProductCard } from '../components/ProductCard'
import { Button } from '../components/ui/Button'
import { useCart } from '../context/CartContext'
import { useCatalog } from '../context/CatalogContext'
import { useToast } from '../context/ToastContext'
import { useWishlist } from '../context/WishlistContext'
import { formatMoney } from '../data/products'
import { useSeo } from '../lib/seo'

export function ProductPage() {
  const { slug } = useParams(); const { products } = useCatalog()
  const product = useMemo(() => products.find(p=>p.slug===slug), [products, slug])
  if (!product) return <Navigate to="/shop" replace/>
  return <ProductExperience product={product}/>
}

function ProductExperience({product}:{product:import('../types').Product}) {
  // Per-product social cards: the product's own image becomes the og:image.
  useSeo(product.name, `${product.name} — ${product.subtitle}. Explore this FÉROCE ${product.category.toLowerCase()}.`, { image: product.image })
  const cart=useCart(); const wishlist=useWishlist(); const {notify}=useToast(); const navigate=useNavigate()
  const { products }=useCatalog()
  const [color,setColor]=useState(product.colors[0].name); const [variant,setVariant]=useState(product.variants[0]); const [quantity,setQuantity]=useState(1)
  const saved=wishlist.has(product.slug)
  const related=useMemo(()=>products.filter(p=>p.id!==product.id && (p.gender===product.gender || p.collection===product.collection)).slice(0,3),[products,product])
  function add(){cart.add(product,quantity,color,variant);notify(`${product.name} added to your bag.`)}
  function buy(){cart.add(product,quantity,color,variant);cart.close();navigate('/checkout')}
  return <main className="bg-ivory">
    <div className="mx-auto grid max-w-[1500px] lg:grid-cols-[minmax(0,1.3fr)_minmax(400px,.7fr)]">
      <section className="grid gap-px bg-black/10 sm:grid-cols-2 lg:self-start" aria-label="Product gallery">
        <div className="relative aspect-[4/5] bg-[#eee8de] sm:col-span-2"><img src={product.image} alt={`${product.name} product view`} className="h-full w-full object-cover"/><span className="absolute bottom-4 left-4 bg-ivory/85 px-3 py-2 text-[8px] uppercase tracking-luxury backdrop-blur">View 01 / Product</span></div>
        <div className="aspect-[4/5] bg-[#eee8de]"><img src={product.alternateImage||product.image} alt={`${product.name} editorial view`} className="h-full w-full object-cover"/></div>
        <div className="aspect-[4/5] overflow-hidden bg-[#e7dfd4]"><img src={product.image} alt={`${product.name} leather and hardware detail`} className="h-full w-full scale-[1.75] object-cover"/></div>
      </section>
      <section className="px-5 py-10 sm:px-10 lg:sticky lg:top-16 lg:h-[calc(100svh-64px)] lg:overflow-y-auto lg:px-12 lg:py-14 xl:px-16">
        <div className="mx-auto max-w-xl"><div className="flex items-center justify-between"><p className="text-[9px] uppercase tracking-luxury text-black/45">{product.collection} · {product.category}</p><button onClick={()=>{navigator.clipboard?.writeText(location.href);notify('Product link copied.')}} aria-label="Share product"><Share2 size={16} strokeWidth={1.3}/></button></div>
          <h1 className="mt-5 font-display text-5xl leading-none sm:text-6xl">{product.name}</h1><p className="mt-3 text-sm text-black/50">{product.subtitle}</p>
          <div className="mt-7 border-b border-black/10 pb-6"><p className="text-xl">{formatMoney(product.price)}</p><p className="mt-2 text-[10px] text-black/45">Duties and taxes are confirmed at checkout.</p></div>
          {product.availability==='Pre-order'&&<div className="mt-6 border border-oxblood bg-oxblood px-5 py-4 text-white"><p className="text-[10px] font-medium uppercase tracking-luxury">Pre-order</p><p className="mt-2 text-xs leading-5 text-white/75">{product.preorderEstimate} Payment confirmation and the delivery window must be approved before launch.</p></div>}
          <div className="mt-7"><div className="flex justify-between"><p className="text-[9px] font-medium uppercase tracking-luxury">Color</p><span className="text-[10px] text-black/50">{color}</span></div><div className="mt-3 flex gap-3">{product.colors.map(c=><button key={c.name} onClick={()=>setColor(c.name)} aria-label={c.name} className={`grid h-8 w-8 place-items-center rounded-full border transition ${color===c.name?'border-black':'border-transparent'}`}><span className="h-5 w-5 rounded-full border border-black/10" style={{backgroundColor:c.hex}}/></button>)}</div></div>
          {product.variants.length>1&&<div className="mt-7"><p className="text-[9px] font-medium uppercase tracking-luxury">Size / Variant</p><div className="mt-3 flex gap-2">{product.variants.map(v=><button key={v} onClick={()=>setVariant(v)} className={`min-w-24 border px-4 py-3 text-[9px] uppercase tracking-[.14em] ${variant===v?'border-ink bg-ink text-white':'border-black/20'}`}>{v}</button>)}</div></div>}
          {/* Primary/secondary: add to bag is the standard cart path (dark); buy now is the expedited checkout shortcut (outline). */}
          <div className="mt-7 flex gap-3"><div className="flex w-28 items-center justify-between border border-black/20 px-3"><button onClick={()=>setQuantity(q=>Math.max(1,q-1))} aria-label="Decrease quantity"><Minus size={13}/></button><span className="text-xs">{quantity}</span><button onClick={()=>setQuantity(q=>Math.min(10,q+1))} aria-label="Increase quantity"><Plus size={13}/></button></div><Button onClick={add} className="flex-1">Add to bag</Button><button onClick={()=>{wishlist.toggle(product);notify(saved?'Removed from wishlist.':'Saved to wishlist.')}} className="grid w-12 place-items-center border border-black/20" aria-label={saved?'Remove from wishlist':'Add to wishlist'}><Heart size={17} fill={saved?'currentColor':'none'}/></button></div>
          <Button onClick={buy} variant="outline" className="mt-3 w-full">Buy now</Button>
          <div className="mt-7 grid grid-cols-2 gap-4 border-y border-black/10 py-5"><div className="flex items-center gap-3"><Truck size={18} strokeWidth={1.2}/><div><p className="text-[9px] uppercase tracking-widest">Delivery</p><p className="mt-1 text-[9px] text-black/45">Policy to be supplied</p></div></div><div className="flex items-center gap-3"><ShieldCheck size={18} strokeWidth={1.2}/><div><p className="text-[9px] uppercase tracking-widest">Secure payment</p><p className="mt-1 text-[9px] text-black/45">Provider integration ready</p></div></div></div>
          <div className="mt-7"><Accordion title="Description" defaultOpen>{product.description}</Accordion><Accordion title="Materials">{product.materials}</Accordion><Accordion title="Dimensions">{product.dimensions}</Accordion><Accordion title="Shipping">Shipping markets, rates and timeframes have not been supplied. Configure these in the admin settings before taking orders.</Accordion><Accordion title="Returns">The approved FÉROCE return policy has not yet been supplied. Do not publish a placeholder policy at launch.</Accordion></div>
        </div>
      </section>
    </div>
    <section className="bg-bone px-5 py-20 sm:px-8 md:py-28"><div className="mx-auto max-w-7xl"><p className="text-center text-[9px] uppercase tracking-luxury text-black/45">Consider next</p><h2 className="mt-4 text-center font-display text-5xl">In the same spirit.</h2><div className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-4 md:grid-cols-3 md:gap-7">{related.map(p=><ProductCard key={p.id} product={p}/>)}</div></div></section>
  </main>
}
