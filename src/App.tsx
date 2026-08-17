import { lazy, Suspense, useLayoutEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { CartDrawer } from './components/CartDrawer'
import { Footer } from './components/Footer'
import { UtilityBar } from './components/UtilityBar'
import { Header } from './components/Header'
import { HomePage } from './pages/HomePage'

/** Keep `--chrome` (sticky header + utility bar) in sync with the real layout so
 *  first-viewport sections can fill exactly the visible area with
 *  calc(100svh - var(--chrome)). Re-measures on resize and on DOM changes — the
 *  utility bar is dismissible, which shrinks the chrome from ~103px to ~77px. */
function useChromeHeight() {
  useLayoutEffect(() => {
    const measure = () => {
      const main = document.querySelector('main')
      if (!main) return
      const chrome = Math.max(0, Math.round(main.getBoundingClientRect().top + window.scrollY))
      document.documentElement.style.setProperty('--chrome', `${chrome}px`)
    }
    measure()
    let raf = 0
    const reschedule = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(measure) }
    window.addEventListener('resize', reschedule)
    const observer = new MutationObserver(reschedule)
    const rootEl = document.getElementById('root')
    if (rootEl) observer.observe(rootEl, { childList: true, subtree: true })
    return () => { window.removeEventListener('resize', reschedule); observer.disconnect() }
  }, [])
}

const ShopPage=lazy(()=>import('./pages/ShopPage').then(m=>({default:m.ShopPage})))
const ProductPage=lazy(()=>import('./pages/ProductPage').then(m=>({default:m.ProductPage})))
const CheckoutPage=lazy(()=>import('./pages/CheckoutPage').then(m=>({default:m.CheckoutPage})))
const OrderConfirmationPage=lazy(()=>import('./pages/OrderConfirmationPage').then(m=>({default:m.OrderConfirmationPage})))
const AccountPage=lazy(()=>import('./pages/AccountPage').then(m=>({default:m.AccountPage})))
const AboutPage=lazy(()=>import('./pages/AboutPage').then(m=>({default:m.AboutPage})))
const ContactPage=lazy(()=>import('./pages/ContactPage').then(m=>({default:m.ContactPage})))
const CollectionsPage=lazy(()=>import('./pages/CollectionsPage').then(m=>({default:m.CollectionsPage})))
const AdminPage=lazy(()=>import('./pages/AdminPage').then(m=>({default:m.AdminPage})))
const InfoPage=lazy(()=>import('./pages/InfoPage').then(m=>({default:m.InfoPage})))
const NotFoundPage=lazy(()=>import('./pages/NotFoundPage').then(m=>({default:m.NotFoundPage})))

export default function App(){
 useChromeHeight()
 const {pathname}=useLocation();const admin=pathname.startsWith('/admin')
 return <div className="min-h-screen">{!admin&&<><Header/><UtilityBar/></>}<Suspense fallback={<div className="grid min-h-[70svh] place-items-center bg-ivory"><span className="text-[9px] uppercase tracking-luxury animate-pulse">Entering FÉROCE…</span></div>}><Routes><Route path="/" element={<HomePage/>}/><Route path="/shop" element={<ShopPage/>}/><Route path="/women" element={<ShopPage forcedGender="Women" title="For her" intro="De Ville and Naji — designed for her, made to be seen."/>}/><Route path="/men" element={<ShopPage forcedGender="Men" title="For him" intro="The men's De Ville picks — never forgotten, made to be worn."/>}/><Route path="/collections" element={<CollectionsPage/>}/><Route path="/collections/:slug" element={<CollectionsPage/>}/><Route path="/product/:slug" element={<ProductPage/>}/><Route path="/checkout" element={<CheckoutPage/>}/><Route path="/order-confirmation" element={<OrderConfirmationPage/>}/><Route path="/account" element={<AccountPage/>}/><Route path="/about" element={<AboutPage/>}/><Route path="/contact" element={<ContactPage/>}/><Route path="/care-guide" element={<InfoPage/>}/><Route path="/shipping-returns" element={<InfoPage/>}/><Route path="/privacy" element={<InfoPage/>}/><Route path="/terms" element={<InfoPage/>}/><Route path="/journal" element={<InfoPage/>}/><Route path="/accessibility" element={<InfoPage/>}/><Route path="/cookies" element={<InfoPage/>}/><Route path="/admin" element={<AdminPage/>}/><Route path="*" element={<NotFoundPage/>}/></Routes></Suspense>{!admin&&<><Footer/><CartDrawer/></>}</div>
}
