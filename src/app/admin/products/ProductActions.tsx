'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  image_urls: string[]
  color: string
  stock: number
  active: boolean
  is_new: boolean
  category_id: string
}

interface Category {
  id: string
  name: string
  slug: string
}

interface ProductActionsProps {
  mode: 'create' | 'edit'
  product?: Product
  categories: Category[]
}

export function ProductActions({ mode, product, categories }: ProductActionsProps) {
  const [open, setOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imageUrls, setImageUrls] = useState<string[]>(product?.image_urls || [])
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const inputClass = "w-full border border-line bg-white px-3 py-2 text-sm font-sans text-navy placeholder:text-navy/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 min-h-[40px] transition-all"
  const labelClass = "block text-[10px] font-sans uppercase tracking-[0.1em] text-navy/50 mb-1"

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return

    setUploading(true)
    const supabase = createClient()
    const newUrls: string[] = []

    for (const file of Array.from(files)) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${fileExt}`
      const filePath = `products/${fileName}`

      const { error } = await supabase.storage
        .from('products')
        .upload(filePath, file)

      if (!error) {
        const { data } = supabase.storage.from('products').getPublicUrl(filePath)
        if (data?.publicUrl) newUrls.push(data.publicUrl)
      }
    }

    setImageUrls((prev) => [...prev, ...newUrls])
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)

    const form = new FormData(e.currentTarget)
    const supabase = createClient()

    const productData = {
      name: form.get('name') as string,
      slug: (form.get('name') as string).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: form.get('description') as string || '',
      price: parseInt(form.get('price') as string) || 0,
      image_urls: imageUrls,
      color: form.get('color') as string || '',
      stock: parseInt(form.get('stock') as string) || 0,
      active: form.get('active') === 'on',
      is_new: form.get('is_new') === 'on',
      category_id: form.get('category_id') as string,
    }

    if (mode === 'create') {
      await supabase.from('products').insert(productData as never)
    } else if (product) {
      await supabase.from('products').update(productData as never).eq('id', product.id)
    }

    setSaving(false)
    setOpen(false)
    // Reload page to show updated data
    window.location.reload()
  }

  return (
    <>
      {mode === 'create' ? (
        <button
          onClick={() => { setOpen(true); setImageUrls([]) }}
          className="bg-navy text-white uppercase font-sans font-medium text-[10px] tracking-[0.2em] px-5 py-2.5 min-h-[40px] hover:bg-[#152240] transition-colors flex items-center gap-2"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Add Product
        </button>
      ) : (
        <button
          onClick={() => { setOpen(true); setImageUrls(product?.image_urls || []) }}
          className="text-[11px] font-sans uppercase tracking-[0.1em] text-navy/60 hover:text-navy transition-colors min-h-[36px]"
        >
          Edit
        </button>
      )}

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/40 backdrop-blur-sm p-4">
          <div className="bg-white border border-line w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-line sticky top-0 bg-white z-10">
              <h2 className="text-[11px] font-sans uppercase tracking-[0.15em] text-navy font-semibold">
                {mode === 'create' ? 'Add Product' : 'Edit Product'}
              </h2>
              <button onClick={() => setOpen(false)} className="text-navy/40 hover:text-navy min-h-[40px] min-w-[40px] flex items-center justify-center">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* Image Upload */}
              <div>
                <label className={labelClass}>Product Images</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {imageUrls.map((url, i) => (
                    <div key={i} className="relative h-16 w-16 border border-line bg-cream overflow-hidden group">
                      <img src={url} alt="" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute inset-0 bg-navy/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="h-16 w-16 border border-dashed border-line flex items-center justify-center text-navy/30 hover:border-gold hover:text-gold transition-colors disabled:opacity-50"
                  >
                    {uploading ? (
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    ) : (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    )}
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <p className="text-[9px] text-navy/30">JPEG, PNG, or WebP. Max 5MB each.</p>
              </div>

              <div>
                <label className={labelClass}>Name</label>
                <input name="name" defaultValue={product?.name} placeholder="Product name" className={inputClass} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Price (cents)</label>
                  <input name="price" type="number" defaultValue={product?.price} placeholder="32500" className={inputClass} required />
                </div>
                <div>
                  <label className={labelClass}>Stock</label>
                  <input name="stock" type="number" defaultValue={product?.stock} placeholder="30" className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Color</label>
                <input name="color" defaultValue={product?.color} placeholder="Navy" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Category</label>
                <select name="category_id" defaultValue={product?.category_id} className={`${inputClass} appearance-none cursor-pointer`}>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <textarea name="description" defaultValue={product?.description} rows={3} className={`${inputClass} resize-none`} />
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer min-h-[40px]">
                  <input type="checkbox" name="active" defaultChecked={product?.active ?? true} className="h-4 w-4 accent-navy" />
                  <span className="text-xs text-navy/60">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer min-h-[40px]">
                  <input type="checkbox" name="is_new" defaultChecked={product?.is_new ?? false} className="h-4 w-4 accent-navy" />
                  <span className="text-xs text-navy/60">New</span>
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving || uploading} className="bg-navy text-white uppercase font-sans font-medium text-[10px] tracking-[0.2em] px-6 py-2.5 min-h-[40px] hover:bg-[#152240] transition-colors disabled:opacity-50 flex items-center gap-2">
                  {saving && <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
                  {mode === 'create' ? 'Create' : 'Save'}
                </button>
                <button type="button" onClick={() => setOpen(false)} className="text-[11px] font-sans uppercase tracking-[0.1em] text-navy/50 hover:text-navy transition-colors min-h-[40px] px-4">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
