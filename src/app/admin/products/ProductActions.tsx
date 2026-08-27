'use client'

import React, { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  compare_at_price?: number | null
  preorder?: boolean
  collection?: string | null
  materials?: string | null
  care_instructions?: string | null
  color_hex?: string | null
  stripe_checkout_url?: string | null
  image_urls: string[]
  model_image_urls?: string[]
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
  const [modelImageUrls, setModelImageUrls] = useState<string[]>(product?.model_image_urls || [])
  const [saving, setSaving] = useState(false)
  const [hasSale, setHasSale] = useState(!!product?.compare_at_price)
  const [isPreorder, setIsPreorder] = useState(!!product?.preorder)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const modelFileInputRef = useRef<HTMLInputElement>(null)

  const inputClass = "w-full border border-line bg-white px-3 py-2 text-sm font-sans text-navy placeholder:text-navy/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 min-h-[40px] transition-all"
  const labelClass = "block text-[10px] font-sans uppercase tracking-[0.1em] text-navy/50 mb-1"

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'catalog' | 'model') => {
    const files = e.target.files
    if (!files?.length) return
    setUploading(true)
    try {
      const formData = new FormData()
      for (const file of Array.from(files)) { formData.append('files', file) }
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.urls?.length) {
        if (target === 'catalog') setImageUrls((prev) => [...prev, ...data.urls])
        else setModelImageUrls((prev) => [...prev, ...data.urls])
      } else if (data.error) { alert(data.error) }
    } catch { alert('Upload failed.') }
    setUploading(false)
    if (target === 'catalog' && fileInputRef.current) fileInputRef.current.value = ''
    if (target === 'model' && modelFileInputRef.current) modelFileInputRef.current.value = ''
  }

  const removeImage = (index: number, target: 'catalog' | 'model') => {
    if (target === 'catalog') setImageUrls((prev) => prev.filter((_, i) => i !== index))
    else setModelImageUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    const form = new FormData(e.currentTarget)
    const supabase = createClient()
    const productData = {
      name: form.get('name') as string,
      slug: (form.get('name') as string).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: (form.get('description') as string) || '',
      price: parseInt(form.get('price') as string) || 0,
      compare_at_price: hasSale ? (parseInt(form.get('compare_at_price') as string) || null) : null,
      preorder: isPreorder,
      collection: (form.get('collection') as string) || null,
      materials: (form.get('materials') as string) || null,
      care_instructions: (form.get('care_instructions') as string) || null,
      color_hex: (form.get('color_hex') as string) || null,
      stripe_checkout_url: (form.get('stripe_checkout_url') as string) || null,
      image_urls: imageUrls,
      model_image_urls: modelImageUrls,
      color: (form.get('color') as string) || '',
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
    window.location.reload()
  }

  const handleDelete = async () => {
    if (!product) return
    setDeleting(true)
    const supabase = createClient()
    const { error } = await supabase.from('products').delete().eq('id', product.id)
    if (error) {
      alert('Failed to delete product: ' + error.message)
      setDeleting(false)
      return
    }
    setShowDeleteConfirm(false)
    setDeleting(false)
    window.location.reload()
  }

  const ImgUploadBtn = ({ target, ref }: { target: 'catalog' | 'model'; ref: React.RefObject<HTMLInputElement | null> }) => (
    <button type='button' onClick={() => ref.current?.click()} disabled={uploading}
      className='h-16 w-16 border border-dashed border-line flex items-center justify-center text-navy/30 hover:border-gold hover:text-gold transition-colors disabled:opacity-50'>
      {uploading ? <svg className='w-4 h-4 animate-spin' viewBox='0 0 24 24'><circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' fill='none' /><path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z' /></svg>
      : <svg className='w-4 h-4' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round'><line x1='12' y1='5' x2='12' y2='19' /><line x1='5' y1='12' x2='19' y2='12' /></svg>}
    </button>
  )

  return (
    <>
      {mode === 'create' ? (
        <button onClick={() => { setOpen(true); setImageUrls([]); setModelImageUrls([]); setHasSale(false); setIsPreorder(false) }}
          className="bg-navy text-white uppercase font-sans font-medium text-[10px] tracking-[0.2em] px-5 py-2.5 min-h-[40px] hover:bg-[#152240] transition-colors flex items-center gap-2">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Add Product
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <button onClick={() => { setOpen(true); setImageUrls(product?.image_urls || []); setModelImageUrls(product?.model_image_urls || []); setHasSale(!!product?.compare_at_price); setIsPreorder(!!product?.preorder) }}
            className="text-[11px] font-sans uppercase tracking-[0.1em] text-navy/60 hover:text-navy transition-colors min-h-[36px]">
            Edit
          </button>
          <button onClick={() => setShowDeleteConfirm(true)}
            className="text-[11px] font-sans uppercase tracking-[0.1em] text-red-500 hover:text-red-700 transition-colors min-h-[36px]">
            Delete
          </button>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{backgroundColor:'rgba(10,17,40,0.4)'}}>
          <div className="bg-white border border-line w-full max-w-sm p-6 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
            </div>
            <h3 className="text-sm font-semibold text-navy mb-2">Delete Product</h3>
            <p className="text-xs text-navy/60 mb-6">Are you sure you want to delete <strong>{product?.name}</strong>? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 text-[11px] font-sans uppercase tracking-[0.1em] text-navy/50 hover:text-navy transition-colors min-h-[44px] border border-line">Cancel</button>
              <button onClick={handleDelete} disabled={deleting} className="flex-1 bg-red-600 text-white uppercase font-sans font-medium text-[10px] tracking-[0.2em] px-4 py-2.5 min-h-[44px] hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {deleting && <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{backgroundColor:'rgba(10,17,40,0.4)'}}>
          <div className="bg-white border border-line w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-line sticky top-0 bg-white z-10">
              <h2 className="text-[11px] font-sans uppercase tracking-[0.15em] text-navy font-semibold">
                {mode === 'create' ? 'Add Product' : 'Edit Product'}
              </h2>
              <button onClick={() => setOpen(false)} className="text-navy/40 hover:text-navy min-h-[40px] min-w-[40px] flex items-center justify-center"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div><label className={labelClass}>Product Images (Catalog)</label><div className="flex flex-wrap gap-2 mb-2">{imageUrls.map((url, i) => (<div key={i} className="relative h-16 w-16 border border-line bg-cream overflow-hidden group"><img src={url} alt="" className="h-full w-full object-cover" /><button type="button" onClick={() => removeImage(i, 'catalog')} className="absolute inset-0 bg-navy/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg></button></div>))}<ImgUploadBtn target='catalog' ref={fileInputRef} /></div><input ref={fileInputRef} type='file' accept='image/jpeg,image/png,image/webp' multiple onChange={(e) => handleImageUpload(e, 'catalog')} className='hidden' /><p className='text-[9px] text-navy/30'>Main product images.</p></div>
              <div><label className={labelClass}>Model Images (Lifestyle)</label><div className="flex flex-wrap gap-2 mb-2">{modelImageUrls.map((url, i) => (<div key={i} className="relative h-16 w-16 border border-line bg-cream overflow-hidden group"><img src={url} alt="" className="h-full w-full object-cover" /><button type="button" onClick={() => removeImage(i, 'model')} className="absolute inset-0 bg-navy/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg></button></div>))}<ImgUploadBtn target='model' ref={modelFileInputRef} /></div><input ref={modelFileInputRef} type='file' accept='image/jpeg,image/png,image/webp' multiple onChange={(e) => handleImageUpload(e, 'model')} className='hidden' /><p className='text-[9px] text-navy/30'>Photos of models.</p></div>
              <div><label className={labelClass}>Name</label><input name='name' defaultValue={product?.name} placeholder='Product name' className={inputClass} required /></div>
              <div><label className={labelClass}>Collection</label><input name='collection' defaultValue={product?.collection || ''} placeholder='e.g. Naji, Denim De Ville' className={inputClass} /></div>
              <div className="grid grid-cols-2 gap-4"><div><label className={labelClass}>Price (cents)</label><input name='price' type='number' defaultValue={product?.price} placeholder='44300' className={inputClass} required /></div><div><label className={labelClass}>Stock</label><input name='stock' type='number' defaultValue={product?.stock} placeholder='30' className={inputClass} /></div></div>
              <div className="border border-line p-3 bg-cream/30 space-y-3"><label className="flex items-center gap-2 cursor-pointer min-h-[36px]"><input type='checkbox' checked={hasSale} onChange={(e) => setHasSale(e.target.checked)} className='h-4 w-4 accent-gold' /><span className='text-xs text-navy font-medium'>On Sale / Discount</span></label>{hasSale && (<div><label className={labelClass}>Original Price Before Discount (cents)</label><input name='compare_at_price' type='number' defaultValue={product?.compare_at_price || ''} placeholder='47800' className={inputClass} /><p className='text-[9px] text-navy/40 mt-1'>Shown as strikethrough price</p></div>)}</div>
              <div className="border border-line p-3 bg-cream/30 space-y-3"><label className="flex items-center gap-2 cursor-pointer min-h-[36px]"><input type='checkbox' checked={isPreorder} onChange={(e) => setIsPreorder(e.target.checked)} className='h-4 w-4 accent-gold' /><span className='text-xs text-navy font-medium'>Preorder</span></label>{isPreorder && <p className='text-[9px] text-navy/50'>Customers see PREORDER notice instead of In stock.</p>}</div>
              <div><label className={labelClass}>Color</label><input name='color' defaultValue={product?.color} placeholder='Navy' className={inputClass} /></div>
              <div><label className={labelClass}>Color Hex</label><input name='color_hex' type='color' defaultValue={product?.color_hex || '#0A1128'} className='h-10 w-10 border border-line cursor-pointer' /></div>
              <div><label className={labelClass}>Category</label><select name='category_id' defaultValue={product?.category_id} className={inputClass + ' appearance-none cursor-pointer'}>{categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}</select></div>
              <div><label className={labelClass}>Description</label><textarea name='description' defaultValue={product?.description} rows={3} className={inputClass + ' resize-none'} /></div>
              <div><label className={labelClass}>Materials</label><textarea name='materials' defaultValue={product?.materials || ''} rows={2} placeholder='e.g. Genuine fur, suede lining' className={inputClass + ' resize-none'} /></div>
              <div><label className={labelClass}>Care Instructions</label><textarea name='care_instructions' defaultValue={product?.care_instructions || ''} rows={2} placeholder='e.g. Store in dust bag' className={inputClass + ' resize-none'} /></div>
              <div><label className={labelClass}>Stripe Checkout URL</label><input name='stripe_checkout_url' defaultValue={product?.stripe_checkout_url || ''} placeholder='https://buy.stripe.com/...' className={inputClass} /></div>
              <div className="flex items-center gap-6"><label className="flex items-center gap-2 cursor-pointer min-h-[40px]"><input type='checkbox' name='active' defaultChecked={product?.active ?? true} className='h-4 w-4 accent-navy' /><span className='text-xs text-navy/60'>Active</span></label><label className="flex items-center gap-2 cursor-pointer min-h-[40px]"><input type='checkbox' name='is_new' defaultChecked={product?.is_new ?? false} className='h-4 w-4 accent-navy' /><span className='text-xs text-navy/60'>New</span></label></div>
              <div className="flex gap-3 pt-2"><button type='submit' disabled={saving || uploading} className="bg-navy text-white uppercase font-sans font-medium text-[10px] tracking-[0.2em] px-6 py-2.5 min-h-[40px] hover:bg-[#152240] transition-colors disabled:opacity-50 flex items-center gap-2">{saving && <svg className='w-3 h-3 animate-spin' viewBox='0 0 24 24'><circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' fill='none' /><path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z' /></svg>}{mode === 'create' ? 'Create' : 'Save'}</button><button type='button' onClick={() => setOpen(false)} className='text-[11px] font-sans uppercase tracking-[0.1em] text-navy/50 hover:text-navy transition-colors min-h-[40px] px-4'>Cancel</button></div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
