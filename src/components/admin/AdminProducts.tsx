import { Edit3, ImagePlus, Plus, Search, Trash2, Upload, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { formatMoney } from '../../data/products'
import { productImageUrl } from '../../lib/images'
import { supabase } from '../../lib/supabase'
import { PageHead } from './AdminOrders'

interface DbVariant { id: string; name: string; color_name: string; color_hex: string; price_minor: number; inventory: number; active: boolean }
interface DbProduct {
  id: string; slug: string; name: string; subtitle: string; description: string; gender: string; status: string
  base_price_minor: number; currency: string; materials: string; dimensions: string
  featured: boolean; best_seller: boolean; new_arrival: boolean; preorder: boolean
  search_keywords: string[] | null
  categories: { id: string; name: string } | null
  product_collections: { collections: { id: string; name: string } | null }[]
  product_variants: DbVariant[]
  product_images: { storage_path: string; is_primary: boolean }[]
}

const genders = ['Women', 'Men', 'Unisex']
const statuses = ['active', 'draft', 'archived']

interface VariantForm { name: string; color_name: string; color_hex: string; price: string; inventory: string }
interface ProductForm {
  name: string; slug: string; subtitle: string; description: string; gender: string; status: string
  price: string; categoryId: string; collectionId: string; materials: string; dimensions: string
  featured: boolean; best_seller: boolean; new_arrival: boolean; preorder: boolean; keywords: string
  variants: VariantForm[]
}
const blankVariant = (): VariantForm => ({ name: 'Classic', color_name: 'Noir', color_hex: '#151515', price: '', inventory: '0' })
const blankForm = (): ProductForm => ({
  name: '', slug: '', subtitle: '', description: '', gender: 'Women', status: 'active', price: '',
  categoryId: '', collectionId: '', materials: '', dimensions: '',
  featured: false, best_seller: false, new_arrival: false, preorder: false, keywords: '',
  variants: [blankVariant()],
})

export function AdminProducts() {
  const [items, setItems] = useState<DbProduct[]>([])
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [collections, setCollections] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [edit, setEdit] = useState<DbProduct | null>(null)
  const [creating, setCreating] = useState(false)
  const [busy, setBusy] = useState(false)

  async function load() {
    if (!supabase) return setLoading(false)
    const [productsRes, categoriesRes, collectionsRes] = await Promise.all([
      supabase.from('products').select('*,categories(id,name),product_collections(collections(id,name)),product_variants(*),product_images(storage_path,is_primary)').order('created_at', { ascending: false }),
      supabase.from('categories').select('id,name').order('name'),
      supabase.from('collections').select('id,name').order('name'),
    ])
    setItems((productsRes.data as unknown as DbProduct[]) ?? [])
    setCategories((categoriesRes.data as { id: string; name: string }[]) ?? [])
    setCollections((collectionsRes.data as { id: string; name: string }[]) ?? [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const found = items.filter(p => `${p.name} ${p.categories?.name ?? ''} ${p.product_collections?.[0]?.collections?.name ?? ''} ${p.slug}`.toLowerCase().includes(q.toLowerCase()))

  async function remove(id: string) {
    if (!supabase) return
    if (!confirm('Delete this product and its variants from the live catalog?')) return
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (!error) setItems(x => x.filter(p => p.id !== id))
  }

  function openEdit(p: DbProduct) {
    setEdit(p)
    setCreating(false)
  }
  function openCreate() {
    setEdit(null)
    setCreating(true)
  }
  function close() { setEdit(null); setCreating(false) }

  return <div><PageHead title="Product management" copy="Create, edit, merchandise and monitor your live catalog." action={<button onClick={openCreate} className="flex items-center gap-2 bg-ink px-4 py-3 text-[8px] uppercase tracking-luxury text-white"><Plus size={13} /> Add product</button>} />
    <div className="border border-black/10 bg-white"><div className="border-b border-black/10 p-4"><div className="flex max-w-sm items-center border border-black/15 px-3"><Search size={14} /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search products" className="w-full px-3 py-2.5 text-xs outline-none" /></div></div>
      {loading ? <p className="px-5 py-12 text-xs text-black/45">Loading catalog…</p> :
        <div className="overflow-x-auto"><table className="w-full min-w-[800px] text-left"><thead className="text-[8px] uppercase tracking-luxury text-black/40"><tr><th className="px-5 py-4">Product</th><th>Category</th><th>Collection</th><th>Price</th><th>Stock</th><th>Status</th><th></th></tr></thead><tbody>{found.map(p => <tr key={p.id} className="border-t border-black/10 text-xs"><td className="px-5 py-3"><div className="flex items-center gap-3"><img src={productImageUrl(p.product_images?.find(i => i.is_primary)?.storage_path ?? p.product_images?.[0]?.storage_path)} alt="" className="h-12 w-12 object-cover" /><div><p className="font-medium">{p.name}</p><p className="mt-1 text-[8px] text-black/40">{p.slug}</p></div></div></td><td>{p.categories?.name ?? '—'}</td><td>{p.product_collections?.[0]?.collections?.name ?? '—'}</td><td><p>{formatMoney(p.base_price_minor / 100)}</p><p className="mt-1 text-[7px] uppercase text-oxblood">{(p.product_variants ?? []).length} variants</p></td><td>{(p.product_variants ?? []).reduce((n, v) => n + v.inventory, 0)}</td><td><span className={`text-[8px] uppercase tracking-widest ${p.status === 'active' ? 'text-moss' : 'text-black/45'}`}>{p.status}</span></td><td><div className="flex justify-end gap-1 px-4"><button onClick={() => openEdit(p)} className="p-2" aria-label={`Edit ${p.name}`}><Edit3 size={14} /></button><button onClick={() => remove(p.id)} className="p-2 text-oxblood" aria-label={`Delete ${p.name}`}><Trash2 size={14} /></button></div></td></tr>)}</tbody></table></div>}
    </div>
    {(creating || edit) && <ProductEditor product={edit} categories={categories} collections={collections} onSave={async () => { await load(); close() }} onClose={close} busy={busy} setBusy={setBusy} />}
  </div>
}

function ProductEditor({ product, categories, collections, onSave, onClose, busy, setBusy }: {
  product: DbProduct | null
  categories: { id: string; name: string }[]
  collections: { id: string; name: string }[]
  onSave: () => void; onClose: () => void; busy: boolean; setBusy: (b: boolean) => void
}) {
  const [form, setForm] = useState<ProductForm>(() => product ? {
    name: product.name, slug: product.slug, subtitle: product.subtitle ?? '', description: product.description ?? '',
    gender: product.gender, status: product.status, price: `${product.base_price_minor / 100}`,
    categoryId: product.categories?.id ?? '', collectionId: product.product_collections?.[0]?.collections?.id ?? '',
    materials: product.materials ?? '', dimensions: product.dimensions ?? '',
    featured: product.featured, best_seller: product.best_seller, new_arrival: product.new_arrival, preorder: product.preorder,
    keywords: (product.search_keywords ?? []).join(', '),
    variants: (product.product_variants ?? []).map(v => ({ name: v.name, color_name: v.color_name ?? '', color_hex: v.color_hex ?? '#151515', price: `${v.price_minor / 100}`, inventory: `${v.inventory}` })),
  } : blankForm())
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>(product ? productImageUrl(product.product_images?.find(i => i.is_primary)?.storage_path ?? product.product_images?.[0]?.storage_path) : '')
  const fileRef = useRef<HTMLInputElement>(null)
  const set = (patch: Partial<ProductForm>) => setForm(f => ({ ...f, ...patch }))
  const setVariant = (i: number, patch: Partial<VariantForm>) => setForm(f => ({ ...f, variants: f.variants.map((v, n) => n === i ? { ...v, ...patch } : v) }))

  function pickImage(file: File | undefined) {
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!supabase) return
    setBusy(true)
    try {
      const slug = form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
      const base: Record<string, unknown> = {
        slug, name: form.name, subtitle: form.subtitle || null, description: form.description || null,
        gender: form.gender, status: form.status,
        base_price_minor: Math.round(Number(form.price || 0) * 100), currency: 'GHS',
        materials: form.materials || null, dimensions: form.dimensions || null,
        featured: form.featured, best_seller: form.best_seller, new_arrival: form.new_arrival, preorder: form.preorder,
        search_keywords: form.keywords.split(',').map(k => k.trim()).filter(Boolean),
        category_id: form.categoryId || null,
      }

      let productId = product?.id ?? ''
      if (productId) {
        const { error } = await supabase.from('products').update(base).eq('id', productId)
        if (error) throw new Error(error.message)
      } else {
        const { error, data } = await supabase.from('products').insert(base).select('id').single()
        if (error) throw new Error(error.message)
        productId = data.id as string
      }

      // Replace variants.
      const { error: vErr } = await supabase.from('product_variants').delete().eq('product_id', productId)
      if (vErr) throw new Error(vErr.message)
      const variantRows = form.variants
        .filter(v => v.name.trim())
        .map((v, i) => ({
          product_id: productId,
          sku: `${slug}-${v.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${i}`.slice(0, 60),
          name: v.name.trim(), color_name: v.color_name || null, color_hex: v.color_hex || null,
          price_minor: Math.round(Number(v.price || 0) * 100), inventory: Math.max(0, Math.round(Number(v.inventory || 0))), active: true,
        }))
      if (variantRows.length) {
        const { error } = await supabase.from('product_variants').insert(variantRows)
        if (error) throw new Error(error.message)
      }

      // Replace images: upload the new file first, keep existing rows otherwise.
      const { error: iErr } = await supabase.from('product_images').delete().eq('product_id', productId)
      if (iErr) throw new Error(iErr.message)
      let storagePath = product?.product_images?.find(i => i.is_primary)?.storage_path ?? product?.product_images?.[0]?.storage_path ?? null
      if (imageFile) {
        const path = `${slug}/${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`
        const { error: upErr } = await supabase.storage.from('products').upload(path, imageFile, { upsert: true })
        if (upErr) throw new Error(`Image upload failed: ${upErr.message}`)
        storagePath = path
      }
      if (storagePath) {
        const { error } = await supabase.from('product_images').insert({ product_id: productId, storage_path: storagePath, alt_text: `${form.name} — FÉROCE FASHION_FF`, sort_order: 0, is_primary: true })
        if (error) throw new Error(error.message)
      }

      // Replace collection link.
      const { error: cErr } = await supabase.from('product_collections').delete().eq('product_id', productId)
      if (cErr) throw new Error(cErr.message)
      if (form.collectionId) {
        const { error } = await supabase.from('product_collections').insert({ product_id: productId, collection_id: form.collectionId, sort_order: 0 })
        if (error) throw new Error(error.message)
      }
      onSave()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Save failed.')
    } finally { setBusy(false) }
  }

  return <div className="fixed inset-0 z-50 flex justify-end bg-black/45"><button className="absolute inset-0" onClick={onClose} aria-label="Close editor" />
    <aside className="relative h-full w-full max-w-2xl overflow-y-auto bg-[#f8f6f2] p-6 sm:p-9">
      <button onClick={onClose} className="absolute right-5 top-5"><X /></button>
      <p className="text-[8px] uppercase tracking-luxury text-black/40">Live catalog editor</p>
      <h2 className="mt-4 font-display text-4xl">{product ? 'Edit product' : 'New product'}</h2>
      <form onSubmit={save} className="mt-8 grid gap-4 sm:grid-cols-2">
        <EditorField label="Product name" value={form.name} onChange={v => set({ name: v })} />
        <EditorField label="Slug" value={form.slug} onChange={v => set({ slug: v })} />
        <EditorField label="Subtitle" value={form.subtitle} onChange={v => set({ subtitle: v })} />
        <EditorField label="Price (GHS)" type="number" min={0} value={form.price} onChange={v => set({ price: v })} />
        <label><span className="mb-2 block text-[8px] uppercase tracking-widest">Category</span><select value={form.categoryId} onChange={e => set({ categoryId: e.target.value })} className="w-full border border-black/15 bg-white p-3 text-xs"><option value="">— None —</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
        <label><span className="mb-2 block text-[8px] uppercase tracking-widest">Collection</span><select value={form.collectionId} onChange={e => set({ collectionId: e.target.value })} className="w-full border border-black/15 bg-white p-3 text-xs"><option value="">— None —</option>{collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
        <label><span className="mb-2 block text-[8px] uppercase tracking-widest">Gender</span><select value={form.gender} onChange={e => set({ gender: e.target.value })} className="w-full border border-black/15 bg-white p-3 text-xs">{genders.map(g => <option key={g}>{g}</option>)}</select></label>
        <label><span className="mb-2 block text-[8px] uppercase tracking-widest">Status</span><select value={form.status} onChange={e => set({ status: e.target.value })} className="w-full border border-black/15 bg-white p-3 text-xs">{statuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}</select></label>
        <div className="sm:col-span-2"><span className="mb-2 block text-[8px] uppercase tracking-widest">Product image</span><div className="flex items-center gap-4"><img src={imagePreview} alt="Product preview" className="h-20 w-20 object-cover" /><div className="flex flex-col gap-2"><button type="button" onClick={() => fileRef.current?.click()} className="flex items-center justify-center gap-2 border border-dashed border-black/30 bg-white p-3 text-[9px] uppercase tracking-widest"><ImagePlus size={16} /> Choose image</button>{imageFile && <button type="button" onClick={() => { setImageFile(null); setImagePreview(product ? productImageUrl(product.product_images?.find(i => i.is_primary)?.storage_path ?? product.product_images?.[0]?.storage_path) : '') }} className="flex items-center gap-1 text-[8px] uppercase tracking-widest text-oxblood"><Trash2 size={12} /> Remove upload</button>}<span className="text-[8px] text-black/45">Uploads go to the public <code>products</code> storage bucket (max 10 MB, JPG/PNG/WebP/AVIF).</span></div><input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="hidden" onChange={e => pickImage(e.target.files?.[0])} /></div></div>
        <label className="sm:col-span-2"><span className="mb-2 block text-[8px] uppercase tracking-widest">Keywords (comma separated)</span><input value={form.keywords} onChange={e => set({ keywords: e.target.value })} className="w-full border border-black/15 bg-white p-3 text-xs outline-none" /></label>
        <div className="sm:col-span-2"><span className="mb-2 block text-[8px] uppercase tracking-widest">Merchandising flags</span><div className="flex flex-wrap gap-4">{([['featured', 'Featured'], ['best_seller', 'Best seller'], ['new_arrival', 'New arrival'], ['preorder', 'Pre-order']] as const).map(([key, label]) => <label key={key} className="flex items-center gap-2 text-[9px] uppercase tracking-widest"><input type="checkbox" checked={form[key]} onChange={e => set({ [key]: e.target.checked })} className="h-4 w-4" />{label}</label>)}</div></div>
        <div className="sm:col-span-2"><div className="flex items-center justify-between"><span className="mb-2 block text-[8px] uppercase tracking-widest">Variants (color · size · stock)</span><button type="button" onClick={() => setForm(f => ({ ...f, variants: [...f.variants, blankVariant()] }))} className="flex items-center gap-1 text-[8px] uppercase tracking-widest text-oxblood"><Plus size={12} /> Add variant</button></div>
          <div className="space-y-3">{form.variants.map((v, i) => <div key={i} className="grid grid-cols-2 gap-2 border border-black/10 bg-white p-3 sm:grid-cols-[1fr_1fr_auto_70px_70px_auto] sm:items-center">
            <input value={v.name} onChange={e => setVariant(i, { name: e.target.value })} placeholder="Variant" className="border border-black/15 p-2.5 text-xs outline-none" />
            <input value={v.color_name} onChange={e => setVariant(i, { color_name: e.target.value })} placeholder="Color" className="border border-black/15 p-2.5 text-xs outline-none" />
            <input type="color" value={v.color_hex} onChange={e => setVariant(i, { color_hex: e.target.value })} className="h-10 w-12 cursor-pointer border border-black/15 p-1" aria-label="Color hex" />
            <input type="number" min={0} value={v.price} onChange={e => setVariant(i, { price: e.target.value })} placeholder="GHS" className="border border-black/15 p-2.5 text-xs outline-none" title="Price (GHS)" />
            <input type="number" min={0} value={v.inventory} onChange={e => setVariant(i, { inventory: e.target.value })} placeholder="Stock" className="border border-black/15 p-2.5 text-xs outline-none" title="Inventory" />
            <button type="button" onClick={() => setForm(f => ({ ...f, variants: f.variants.filter((_, n) => n !== i) }))} className="justify-self-end p-2 text-oxblood" aria-label="Remove variant"><Trash2 size={13} /></button>
          </div>)}</div></div>
        <label className="sm:col-span-2"><span className="mb-2 block text-[8px] uppercase tracking-widest">Description</span><textarea value={form.description} onChange={e => set({ description: e.target.value })} rows={4} className="w-full border border-black/15 bg-white p-3 text-xs outline-none" /></label>
        <label className="sm:col-span-2"><span className="mb-2 block text-[8px] uppercase tracking-widest">Materials</span><textarea value={form.materials} onChange={e => set({ materials: e.target.value })} rows={2} className="w-full border border-black/15 bg-white p-3 text-xs outline-none" /></label>
        <label className="sm:col-span-2"><span className="mb-2 block text-[8px] uppercase tracking-widest">Dimensions</span><textarea value={form.dimensions} onChange={e => set({ dimensions: e.target.value })} rows={2} className="w-full border border-black/15 bg-white p-3 text-xs outline-none" /></label>
        <div className="flex justify-end gap-3 border-t border-black/10 pt-5 sm:col-span-2"><button type="button" onClick={onClose} className="border border-black/15 px-5 py-3 text-[8px] uppercase tracking-widest">Cancel</button><button disabled={busy} className="flex items-center gap-2 bg-ink px-5 py-3 text-[8px] uppercase tracking-widest text-white disabled:opacity-50"><Upload size={13} /> {busy ? 'Saving…' : 'Save product'}</button></div>
      </form>
    </aside></div>
}
function EditorField({ label, value, onChange, type = 'text', min }: { label: string; value: string; onChange: (v: string) => void; type?: string; min?: number }) {
  return <label><span className="mb-2 block text-[8px] uppercase tracking-widest">{label}</span><input required type={type} min={min} value={value} onChange={e => onChange(e.target.value)} className="w-full border border-black/15 bg-white p-3 text-xs outline-none focus:border-black" /></label>
}
