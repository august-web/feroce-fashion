import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard'
import { ButtonLink } from '../components/ui/Button'
import { useCatalog } from '../context/CatalogContext'
import { collections, getCollection } from '../data/collections'
import { useSeo } from '../lib/seo'

/** Index + detail for the real house collections (De Ville, Naji). The piece
 *  counts and lists come from the current catalog — sample records for now,
 *  live SKUs once the client uploads them. */
export function CollectionsPage() {
  const { slug } = useParams()
  if (slug) return <CollectionDetail slug={slug} />
  return <CollectionsIndex />
}

function CollectionsIndex() {
  useSeo('Collections', 'Explore the FÉROCE collections — the gold-monogram De Ville structured bags and the soft-fur Naji handbags, in their real materials and colorways.')
  const { products } = useCatalog()
  return <main className="bg-ivory text-ink">
    <section className="px-5 pb-16 pt-20 text-center sm:px-8 md:pb-24 md:pt-28">
      <p className="text-[9px] uppercase tracking-luxury text-black/45">The house codes</p>
      <h1 className="mt-5 font-display text-6xl font-semibold sm:text-8xl md:text-9xl">Collections.</h1>
      <p className="mx-auto mt-6 max-w-md text-sm leading-6 text-black/55">Two collections define the house today: the gold-monogram <em className="text-black/80 not-italic">De Ville</em> and the soft-fur <em className="text-black/80 not-italic">Naji</em>. Materials and colorways are the brand's own — pieces shown are placeholders until real SKUs are uploaded.</p>
    </section>
    <section className="mx-auto max-w-[1500px] px-4 pb-24 sm:px-7">
      <div className="grid gap-4 md:grid-cols-2">
        {collections.map((c, i) => {
          const count = products.filter(p => p.collection === c.name).length
          return <Link key={c.slug} to={`/collections/${c.slug}`} className={`group relative overflow-hidden ${i % 2 === 0 ? 'md:aspect-[16/11]' : 'md:aspect-[4/5]'} aspect-[4/5]`}>
            <img src={c.image} alt={`${c.name} collection`} className="h-full w-full object-cover transition duration-1000 group-hover:scale-[1.025]"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent"/>
            <span className="absolute right-5 top-5 text-[9px] tracking-luxury text-white/60">{String(i + 1).padStart(2, '0')}</span>
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <p className="text-[9px] uppercase tracking-luxury text-white/55">{c.eyebrow}</p>
              <p className="mt-3 font-display text-5xl sm:text-6xl">{c.name}</p>
              <p className="mt-3 max-w-md text-xs leading-6 text-white/70">{c.line}</p>
              <div className="mt-4 flex items-center gap-2">{c.colorways.slice(0, 5).map(cw => <span key={cw.name} title={cw.name} style={{ backgroundColor: cw.hex }} className="h-3.5 w-3.5 rounded-full ring-1 ring-white/30"/>)}</div>
              <div className="mt-5 flex items-center justify-between">
                <p className="text-[9px] uppercase tracking-luxury text-white/45">{count > 0 ? `${count} ${count === 1 ? 'piece' : 'pieces'}` : 'Pieces arriving'}</p>
                <span className="grid h-11 w-11 place-items-center border border-white/50 transition group-hover:bg-white group-hover:text-black"><ArrowRight size={17}/></span>
              </div>
            </div>
          </Link>
        })}
      </div>
      <div className="mt-16 border-y border-black/10 py-12 text-center">
        <p className="text-[9px] uppercase tracking-luxury text-black/45">What's next</p>
        <h2 className="mt-4 font-display text-4xl font-semibold">New pieces are on the way.</h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-black/55">The house is young and moving fast — new drops and the Naji line are being finished with the founder. Follow the journey at @ferocefashion_ff.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3"><ButtonLink to="/shop">Browse the collection</ButtonLink><ButtonLink to="/contact" variant="outline">Speak with the house</ButtonLink></div>
      </div>
    </section>
  </main>
}

function CollectionDetail({ slug }: { slug: string }) {
  const collection = getCollection(slug)
  const { products } = useCatalog()
  // SEO is a hook — always call it exactly once, before any conditional return.
  useSeo(collection ? `${collection.name} — FÉROCE` : 'Collection not found', collection?.story ?? 'This collection does not exist at FÉROCE.')
  if (!collection) {
    return <main className="grid min-h-[60svh] place-items-center bg-ivory px-5 text-center text-ink"><div><p className="text-[9px] uppercase tracking-luxury text-black/45">Out of collection</p><h1 className="mt-5 font-display text-6xl">Not found.</h1><ButtonLink to="/collections" className="mt-8"><ArrowLeft size={14} className="mr-2"/> All collections</ButtonLink></div></main>
  }
  const pieces = products.filter(p => p.collection === collection.name)
  return <main className="bg-ivory">
    <section className="relative min-h-[62svh] overflow-hidden text-white">
      <img src={collection.image} alt={`${collection.name} collection campaign`} className="absolute inset-0 h-full w-full object-cover"/>
      <div className="absolute inset-0 bg-black/45"/>
      <div className="absolute inset-x-0 bottom-0 h-[420px] bg-gradient-to-t from-black/75 to-transparent"/>
      <div className="relative mx-auto flex min-h-[62svh] max-w-7xl items-end px-5 pb-12 sm:px-8 md:pb-16">
        <div>
          <p className="text-[9px] uppercase tracking-luxury text-white/60">{collection.eyebrow}</p>
          <h1 className="mt-4 font-display text-7xl leading-none sm:text-8xl md:text-9xl">{collection.name}</h1>
          <p className="mt-5 max-w-xl text-sm leading-6 text-white/75">{collection.line}</p>
          <Link to="/collections" className="mt-7 inline-flex items-center gap-2 text-[9px] uppercase tracking-luxury text-white/70 transition hover:text-white"><ArrowLeft size={14}/> All collections</Link>
        </div>
      </div>
    </section>

    <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1.2fr_1fr] md:py-24">
      <div>
        <p className="text-[9px] uppercase tracking-luxury text-black/45">The collection</p>
        <h2 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">In the house's own words.</h2>
        <p className="mt-6 max-w-xl text-sm leading-7 text-black/60">{collection.story}</p>
        <p className="mt-6 text-[10px] leading-5 text-black/35">Collection story written from the brand's feed (@ferocefashion_ff) — confirm with the founder before launch.</p>
        <div className="mt-10">
          <p className="text-[9px] uppercase tracking-luxury text-black/45">Actual materials</p>
          <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">{collection.materials.map(m => <li key={m} className="flex items-start gap-3 border-b border-black/10 pb-3 text-xs text-black/70"><Check size={14} strokeWidth={1.6} className="mt-0.5 shrink-0 text-moss"/>{m}</li>)}</ul>
        </div>
      </div>
      <div>
        <div className="relative aspect-[4/5] overflow-hidden"><img src={collection.secondaryImage} alt={`${collection.name} — another colorway or product detail`} className="h-full w-full object-cover"/><div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"/><p className="absolute bottom-4 left-4 text-[8px] uppercase tracking-luxury text-white/70">{collection.name} · as photographed on the feed</p></div>
        <div className="mt-8">
          <p className="text-[9px] uppercase tracking-luxury text-black/45">Colorways</p>
          <div className="mt-4 flex flex-wrap gap-3">{collection.colorways.map(cw => <span key={cw.name} className="flex items-center gap-2 border border-black/15 px-3 py-2 text-[9px] uppercase tracking-[.12em]"><span style={{ backgroundColor: cw.hex }} className="h-3 w-3 rounded-full ring-1 ring-black/15"/>{cw.name}</span>)}</div>
          <p className="mt-4 text-[10px] leading-5 text-black/35">Colorways and materials taken from the brand's posts.</p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink to={`/shop?collection=${encodeURIComponent(collection.name)}`} className="flex-1 sm:flex-none">Shop the collection</ButtonLink>
          <ButtonLink to="/shop" variant="outline" className="flex-1 sm:flex-none">All pieces</ButtonLink>
        </div>
      </div>
    </section>

    <section className="bg-bone px-5 py-16 sm:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between">
          <div><p className="text-[9px] uppercase tracking-luxury text-black/45">In this collection</p><h2 className="mt-4 font-display text-4xl sm:text-5xl">{pieces.length ? `${collection.name} pieces.` : `${collection.name} — pieces arriving.`}</h2></div>
          <Link to={`/shop?collection=${encodeURIComponent(collection.name)}`} className="group hidden items-center gap-2 text-[9px] uppercase tracking-luxury md:flex">View all <ArrowRight size={14} className="transition group-hover:translate-x-1"/></Link>
        </div>
        {pieces.length ? <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 xl:grid-cols-4 xl:gap-x-7">{pieces.map(p => <ProductCard key={p.id} product={p}/>)}</div>
          : <div className="mt-10 border border-black/10 bg-ivory p-8 text-center sm:p-14">
              <p className="font-display text-3xl">{collection.name} pieces are on their way.</p>
              <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-black/55">{collection.note ?? 'Real SKUs, materials and pricing are being confirmed with the founder.'}</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3"><ButtonLink to="/shop">Browse all pieces</ButtonLink><ButtonLink to="/contact" variant="outline">Speak with the house</ButtonLink></div>
            </div>}
      </div>
    </section>
  </main>
}
