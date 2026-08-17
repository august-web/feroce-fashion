import { useEffect, useState } from 'react'
import { ChevronDown, Heart, Menu, Search, ShoppingBag, UserRound, X } from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useCatalog } from '../context/CatalogContext'
import { useWishlist } from '../context/WishlistContext'
import { SearchOverlay } from './SearchOverlay'

/** Mega-menu groups derived from the live catalog so the header always reflects
 *  the real product types and collections (De Ville, Naji — see src/data/collections.ts). */
const rightNav = [['About', '/about'], ['Contact', '/contact']]

export function Header() {
  const [menu, setMenu] = useState(false)
  const [menuOpen, setMenuOpen] = useState<string | null>(null)
  const [search, setSearch] = useState(false)
  const [open, setOpen] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const cart = useCart()
  const wishlist = useWishlist()
  const { products } = useCatalog()
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))].sort()
  const collections = [...new Set(products.map(p => p.collection).filter(Boolean))].sort()

  useEffect(() => { setMenu(false); setMenuOpen(null); setOpen(null); window.scrollTo({ top: 0, behavior: 'smooth' }) }, [location.pathname])
  useEffect(() => { const on = () => setScrolled(window.scrollY > 30); on(); addEventListener('scroll', on, { passive: true }); return () => removeEventListener('scroll', on) }, [])

  const Dropdown = ({ id, label }: { id: string; label: string }) => (
    <button
      aria-haspopup="true"
      aria-expanded={open === id}
      onClick={() => setOpen(open === id ? null : id)}
      onMouseEnter={() => setOpen(id)}
      className="relative flex items-center gap-1.5 py-2 text-[10px] uppercase tracking-[.16em]"
    >
      {label}<ChevronDown size={11} strokeWidth={1.6} className={`transition-transform ${open === id ? 'rotate-180' : ''}`} />
    </button>
  )

  const activeLink = ({ isActive }: { isActive: boolean }) =>
    `relative py-2 text-[10px] uppercase tracking-[.16em] after:absolute after:bottom-0 after:left-0 after:h-px after:bg-black after:transition-all ${isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full'}`

  return <>
    <header className={`sticky top-0 z-50 border-b transition-all duration-300 ${scrolled ? 'border-black/10 bg-ivory/95 shadow-[0_1px_12px_rgba(0,0,0,.03)] backdrop-blur-md' : 'border-black/10 bg-ivory'}`}>
      <div className={`mx-auto flex max-w-[1500px] items-center justify-between px-4 transition-all sm:px-7 ${scrolled ? 'h-16' : 'h-[76px]'}`}>
        <button className="p-2 lg:hidden" onClick={() => setMenu(true)} aria-label="Open menu"><Menu size={21} strokeWidth={1.3}/></button>

        {/* Left: primary navigation with mega-menus */}
        <nav className="hidden flex-1 items-center gap-5 lg:flex xl:gap-7" aria-label="Primary navigation" onMouseLeave={() => setOpen(null)}>
          <Dropdown id="handbags" label="Handbags" />
          <Dropdown id="collections" label="Collections" />
          <NavLink to="/women" className={activeLink}>Women</NavLink>
          <NavLink to="/men" className={activeLink}>Men</NavLink>
        </nav>

        <Link to="/" className="absolute left-1/2 -translate-x-1/2 text-center" aria-label="Féroce home"><span className="block font-display text-[22px] tracking-[.16em] sm:text-[25px]">FÉROCE</span></Link>

        {/* Right: secondary navigation + icons */}
        <nav className="hidden flex-1 items-center justify-end gap-5 lg:flex xl:gap-7" aria-label="Secondary navigation">{rightNav.map(([label,path]) => <NavLink key={path} to={path} className={activeLink}>{label}</NavLink>)}</nav>
        <div className="flex items-center gap-1 lg:ml-5"><button onClick={() => setSearch(true)} className="p-2" aria-label="Search"><Search size={18} strokeWidth={1.4}/></button><Link to="/account" className="hidden p-2 sm:block" aria-label="Account"><UserRound size={18} strokeWidth={1.4}/></Link><Link to="/account?tab=wishlist" className="relative hidden p-2 md:block" aria-label={`Wishlist with ${wishlist.ids.length} products`}><Heart size={18} strokeWidth={1.4}/>{wishlist.ids.length > 0 && <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-oxblood px-1 text-[8px] text-white">{wishlist.ids.length}</span>}</Link><button onClick={cart.open} className="relative p-2" aria-label={`Shopping bag with ${cart.count} items`}><ShoppingBag size={18} strokeWidth={1.4}/>{cart.count > 0 && <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-oxblood px-1 text-[8px] text-white">{cart.count}</span>}</button></div>
      </div>

      {/* Mega panels */}
      {open === 'handbags' && (
        <div className="absolute inset-x-0 top-full hidden border-b border-black/10 bg-ivory shadow-[0_24px_48px_rgba(20,18,16,.08)] lg:block" onMouseLeave={() => setOpen(null)}>
          <div className="mx-auto grid max-w-[1500px] grid-cols-[1.2fr_1fr_1.4fr] gap-10 px-7 py-10">
            <div>
              <p className="text-[9px] uppercase tracking-luxury text-black/40">Shop by type</p>
              <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2.5">
                {categories.map(c => <li key={c}><Link to={`/shop?category=${encodeURIComponent(c)}`} onClick={() => setOpen(null)} className="text-sm text-black/75 transition hover:text-black">{c}</Link></li>)}
              </ul>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-luxury text-black/40">Shop by wear</p>
              <ul className="mt-5 space-y-2.5">
                <li><Link to="/women" onClick={() => setOpen(null)} className="text-sm text-black/75 transition hover:text-black">For her</Link></li>
                <li><Link to="/men" onClick={() => setOpen(null)} className="text-sm text-black/75 transition hover:text-black">For him</Link></li>
                <li><Link to="/shop" onClick={() => setOpen(null)} className="text-sm text-black/75 transition hover:text-black">All pieces</Link></li>
              </ul>
            </div>
            <Link to="/collections/de-ville" onClick={() => setOpen(null)} className="group flex items-center gap-5">
              <img src="/images/product-noir.jpg" alt="De Ville structured bag" className="h-28 w-28 object-cover" />
              <div><p className="text-[9px] uppercase tracking-luxury text-black/40">The signature collection</p><p className="mt-2 font-display text-2xl">De Ville</p><p className="mt-1 text-xs text-black/50">Denim-textured canvas, all-over gold monogram.</p><p className="mt-3 text-[9px] uppercase tracking-luxury underline underline-offset-4">Shop the collection</p></div>
            </Link>
          </div>
        </div>
      )}
      {open === 'collections' && (
        <div className="absolute inset-x-0 top-full hidden border-b border-black/10 bg-ivory shadow-[0_24px_48px_rgba(20,18,16,.08)] lg:block" onMouseLeave={() => setOpen(null)}>
          <div className="mx-auto grid max-w-[1500px] grid-cols-[1fr_1fr_1fr] gap-10 px-7 py-10">
            {collections.length > 0 ? collections.map(name => (
              <Link key={name} to={`/collections/${name.toLowerCase().replace(/\s+/g, '-')}`} onClick={() => setOpen(null)} className="group flex items-center gap-5">
                <img src={name === 'Naji' ? '/images/naji-campaign.jpg' : '/images/women-campaign.jpg'} alt={`${name} collection`} className="h-28 w-28 object-cover" />
                <div><p className="font-display text-2xl">{name}</p><p className="mt-1 text-xs text-black/50">{name === 'Naji' ? 'Statement fur handbags — red maroon & golden.' : 'Structured flap bags — denim canvas, gold monogram.'}</p><p className="mt-3 text-[9px] uppercase tracking-luxury underline underline-offset-4">View collection</p></div>
              </Link>
            )) : (
              <>
                <Link to="/collections/de-ville" onClick={() => setOpen(null)} className="group flex items-center gap-5">
                  <img src="/images/women-campaign.jpg" alt="De Ville collection" className="h-28 w-28 object-cover" />
                  <div><p className="font-display text-2xl">De Ville</p><p className="mt-1 text-xs text-black/50">Structured flap bags — denim canvas, gold monogram.</p></div>
                </Link>
                <Link to="/collections/naji" onClick={() => setOpen(null)} className="group flex items-center gap-5">
                  <img src="/images/naji-campaign.jpg" alt="Naji collection" className="h-28 w-28 object-cover" />
                  <div><p className="font-display text-2xl">Naji</p><p className="mt-1 text-xs text-black/50">Statement fur handbags — red maroon & golden.</p></div>
                </Link>
              </>
            )}
            <div className="flex flex-col justify-center gap-2">
              <Link to="/collections" onClick={() => setOpen(null)} className="text-sm text-black/75 transition hover:text-black">All collections</Link>
              <Link to="/shop" onClick={() => setOpen(null)} className="text-sm text-black/75 transition hover:text-black">Shop all pieces</Link>
            </div>
          </div>
        </div>
      )}
    </header>

    {/* Mobile menu: accordion navigation */}
    {menu && <div className="fixed inset-0 z-[70] bg-ivory animate-reveal lg:hidden"><div className="flex h-[76px] items-center justify-between border-b border-black/10 px-5"><span className="font-display text-xl tracking-[.14em]">FÉROCE</span><button onClick={() => setMenu(false)} className="p-2" aria-label="Close menu"><X size={22}/></button></div><nav className="flex h-[calc(100%-76px)] flex-col overflow-auto px-6 py-6">
      <MobileGroup title="Handbags" open={menuOpen === 'handbags'} onToggle={() => setMenuOpen(menuOpen === 'handbags' ? null : 'handbags')}>
        <ul className="space-y-3">{categories.map(c => <li key={c}><Link to={`/shop?category=${encodeURIComponent(c)}`} onClick={() => setMenu(false)} className="text-sm text-black/70">{c}</Link></li>)}<li><Link to="/shop" onClick={() => setMenu(false)} className="text-sm text-black/70">All pieces</Link></li></ul>
      </MobileGroup>
      <MobileGroup title="Collections" open={menuOpen === 'collections'} onToggle={() => setMenuOpen(menuOpen === 'collections' ? null : 'collections')}>
        <ul className="space-y-3">{(collections.length ? collections : ['De Ville', 'Naji']).map(name => <li key={name}><Link to={`/collections/${name.toLowerCase().replace(/\s+/g, '-')}`} onClick={() => setMenu(false)} className="text-sm text-black/70">{name}</Link></li>)}<li><Link to="/collections" onClick={() => setMenu(false)} className="text-sm text-black/70">All collections</Link></li></ul>
      </MobileGroup>
      {nav.map(([label, path], i) => <Link key={path} to={path} onClick={() => setMenu(false)} className="group flex items-baseline justify-between border-b border-black/10 py-5"><span className="font-display text-4xl">{label}</span><span className="text-[9px] tracking-luxury text-black/40">0{i + 1}</span></Link>)}
      <div className="mt-auto flex gap-6 pt-10 text-[10px] uppercase tracking-luxury"><Link to="/account" onClick={() => setMenu(false)}>Account</Link><Link to="/account?tab=wishlist" onClick={() => setMenu(false)}>Wishlist ({wishlist.ids.length})</Link></div>
    </nav></div>}
    <SearchOverlay open={search} onClose={() => setSearch(false)}/>
  </>
}

const nav = [['Women', '/women'], ['Men', '/men'], ['About', '/about'], ['Contact', '/contact']]

function MobileGroup({ title, open, onToggle, children }: { title: string; open: boolean; onToggle: () => void; children: React.ReactNode }) {
  return <div className="border-b border-black/10">
    <button onClick={onToggle} aria-expanded={open} className="flex w-full items-center justify-between py-5"><span className="font-display text-4xl">{title}</span><ChevronDown size={18} strokeWidth={1.3} className={`transition-transform ${open ? 'rotate-180' : ''}`}/></button>
    {open && <div className="pb-5">{children}</div>}
  </div>
}
