import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { ButtonLink } from '../components/ui/Button'
import { getInfoPage } from '../data/info'
import { useSeo } from '../lib/seo'

export function InfoPage() {
  const { pathname } = useLocation()
  const slug = pathname.split('/').filter(Boolean)[0] ?? ''
  const page = getInfoPage(slug)
  useSeo(page ? page.title : 'Page not found', page?.intro ?? 'This page does not exist at FÉROCE.')
  if (!page) {
    return <main className="grid min-h-[60svh] place-items-center bg-ivory px-5 text-center"><div><p className="text-[9px] uppercase tracking-luxury text-black/45">Out of the house</p><h1 className="mt-5 font-display text-6xl">Not found.</h1><ButtonLink to="/" variant="outline" className="mt-8"><ArrowLeft size={14} className="mr-2"/> Return home</ButtonLink></div></main>
  }
  return <main className="bg-ivory">
    <section className="border-b border-black/10 px-5 pb-14 pt-16 text-center sm:px-8 md:pb-20 md:pt-24">
      <p className="text-[9px] uppercase tracking-luxury text-black/45">{page.eyebrow}</p>
      <h1 className="mx-auto mt-5 max-w-3xl font-display text-6xl leading-none sm:text-7xl md:text-8xl">{page.title}</h1>
      <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-black/55">{page.intro}</p>
    </section>
    <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8 md:py-20">
      <div className="space-y-10">{page.sections.map(s => <div key={s.title}><h2 className="font-display text-3xl">{s.title}</h2><p className="mt-4 text-sm leading-7 text-black/60">{s.body}</p></div>)}</div>
      {page.note && <p className="mt-12 border-t border-black/10 pt-6 text-[10px] leading-5 text-black/40">{page.note}</p>}
      <div className="mt-12 flex flex-wrap gap-3"><ButtonLink to="/contact">Speak with the house</ButtonLink><ButtonLink to="/collections" variant="outline">Browse the collections <ArrowRight size={14} className="ml-2"/></ButtonLink></div>
      <p className="mt-8"><Link to="/" className="inline-flex items-center gap-2 text-[9px] uppercase tracking-luxury text-black/50 transition hover:text-black"><ArrowLeft size={14}/> Back to the storefront</Link></p>
    </section>
  </main>
}
