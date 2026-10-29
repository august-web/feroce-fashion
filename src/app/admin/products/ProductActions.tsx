'use client'

import React, { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Upload,
  Sparkles,
  AlertTriangle,
  Check,
  Tag,
  DollarSign,
  Package,
} from 'lucide-react'

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

  const inputClass =
    'w-full rounded-2xl border border-gray-200/90 bg-[#FBFBFC] px-4 py-2.5 text-sm text-navy placeholder:text-gray-400 focus:bg-white focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all font-sans'
  const labelClass =
    'block text-[10px] font-mono uppercase tracking-[0.15em] text-navy/60 font-semibold mb-1.5'

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'catalog' | 'model'
  ) => {
    const files = e.target.files
    if (!files?.length) return
    setUploading(true)
    try {
      const formData = new FormData()
      for (const file of Array.from(files)) {
        formData.append('files', file)
      }
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.urls?.length) {
        if (target === 'catalog') setImageUrls((prev) => [...prev, ...data.urls])
        else setModelImageUrls((prev) => [...prev, ...data.urls])
      } else if (data.error) {
        alert(data.error)
      }
    } catch {
      alert('Upload failed.')
    }
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
      slug: (form.get('name') as string)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, ''),
      description: (form.get('description') as string) || '',
      price: parseInt(form.get('price') as string) || 0,
      compare_at_price: hasSale ? parseInt(form.get('compare_at_price') as string) || null : null,
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

  const ImgUploadBtn = ({
    target,
    inputRef,
  }: {
    target: 'catalog' | 'model'
    inputRef: React.RefObject<HTMLInputElement | null>
  }) => (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      disabled={uploading}
      className="h-20 w-20 rounded-2xl border-2 border-dashed border-gray-200 hover:border-gold bg-[#FBFBFC] hover:bg-gold/5 flex flex-col items-center justify-center text-navy/40 hover:text-gold transition-all disabled:opacity-50 group"
    >
      {uploading ? (
        <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : (
        <>
          <Upload className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
          <span className="text-[9px] font-mono uppercase tracking-wider mt-1">Upload</span>
        </>
      )}
    </button>
  )

  return (
    <>
      {mode === 'create' ? (
        <button
          onClick={() => {
            setOpen(true)
            setImageUrls([])
            setModelImageUrls([])
            setHasSale(false)
            setIsPreorder(false)
          }}
          className="bg-[#4A4D52] hover:bg-navy text-white text-[11px] font-mono uppercase tracking-[0.16em] px-5 py-2.5 rounded-full shadow-sm flex items-center gap-2 transition-all hover:shadow hover:scale-[1.01]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Piece</span>
        </button>
      ) : (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setOpen(true)
              setImageUrls(product?.image_urls || [])
              setModelImageUrls(product?.model_image_urls || [])
              setHasSale(!!product?.compare_at_price)
              setIsPreorder(!!product?.preorder)
            }}
            className="px-3 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-wider text-navy/70 hover:text-navy bg-gray-100 hover:bg-gray-200 transition-all flex items-center gap-1.5"
          >
            <Pencil className="w-3 h-3" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-3 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-wider text-red-600 hover:text-white bg-red-50 hover:bg-red-600 transition-all flex items-center gap-1.5"
          >
            <Trash2 className="w-3 h-3" />
            <span>Delete</span>
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-navy/40 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-[32px] p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl border border-gray-100 animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 mx-auto flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-navy">Decommission Piece?</h3>
            <p className="text-xs text-navy/60 mt-2 leading-relaxed">
              Are you sure you want to permanently remove <strong>{product?.name}</strong> from the
              active atelier catalog?
            </p>
            <div className="flex gap-2.5 mt-6">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider bg-gray-100 hover:bg-gray-200 text-navy font-medium transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting && (
                  <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                )}
                <span>Confirm</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-navy/40 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-[32px] sm:rounded-[36px] border border-gray-100 w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 text-gold-dark text-[10px] font-mono uppercase tracking-[0.18em] font-semibold">
                  <Sparkles className="w-3 h-3 text-gold" />
                  <span>Atelier Specification</span>
                </span>
                <h2 className="font-serif text-xl font-semibold text-navy mt-1">
                  {mode === 'create' ? 'Create New Atelier Piece' : `Edit: ${product?.name}`}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-navy/60 hover:text-navy flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="overflow-y-auto p-6 sm:p-8 space-y-6 flex-1">
              {/* Product Images (Catalog) */}
              <div className="bg-[#F6F6F8] rounded-[24px] p-5">
                <label className={labelClass}>Catalog Photography (Front & Details)</label>
                <div className="flex flex-wrap gap-2.5 mt-2">
                  {imageUrls.map((url, i) => (
                    <div
                      key={i}
                      className="relative h-20 w-20 rounded-2xl bg-white border border-gray-200 overflow-hidden group shadow-sm"
                    >
                      <img src={url} alt="" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(i, 'catalog')}
                        className="absolute inset-0 bg-navy/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <ImgUploadBtn target="catalog" inputRef={fileInputRef} />
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={(e) => handleImageUpload(e, 'catalog')}
                  className="hidden"
                />
                <p className="text-[10px] text-navy/40 mt-2 font-mono">
                  Primary studio piece images shown on the shop canvas.
                </p>
              </div>

              {/* Model Images (Lifestyle) */}
              <div className="bg-[#F6F6F8] rounded-[24px] p-5">
                <label className={labelClass}>Lifestyle & Model Photography</label>
                <div className="flex flex-wrap gap-2.5 mt-2">
                  {modelImageUrls.map((url, i) => (
                    <div
                      key={i}
                      className="relative h-20 w-20 rounded-2xl bg-white border border-gray-200 overflow-hidden group shadow-sm"
                    >
                      <img src={url} alt="" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(i, 'model')}
                        className="absolute inset-0 bg-navy/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <ImgUploadBtn target="model" inputRef={modelFileInputRef} />
                </div>
                <input
                  ref={modelFileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={(e) => handleImageUpload(e, 'model')}
                  className="hidden"
                />
                <p className="text-[10px] text-navy/40 mt-2 font-mono">
                  Editorial model shots and contextual styling views.
                </p>
              </div>

              {/* Title & Collection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Piece Name</label>
                  <input
                    name="name"
                    defaultValue={product?.name}
                    placeholder="e.g. Feroce Fanny Pack"
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Collection</label>
                  <input
                    name="collection"
                    defaultValue={product?.collection || ''}
                    placeholder="e.g. Dallas Atelier, Noir Series"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Category & Color */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Category</label>
                  <div className="relative">
                    <select
                      name="category_id"
                      defaultValue={product?.category_id || categories[0]?.id}
                      className={`${inputClass} appearance-none cursor-pointer pr-8`}
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Color Name</label>
                  <input
                    name="color"
                    defaultValue={product?.color}
                    placeholder="e.g. Midnight Black"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Color Swatch</label>
                  <div className="flex items-center gap-3">
                    <input
                      name="color_hex"
                      type="color"
                      defaultValue={product?.color_hex || '#0A1128'}
                      className="h-10 w-14 rounded-xl border border-gray-200 cursor-pointer p-0.5 bg-white"
                    />
                    <span className="text-[11px] font-mono text-navy/50">Hex Swatch</span>
                  </div>
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Price (USD $)</label>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={product?.price}
                    placeholder="443"
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Workshop Stock / Max Allocation</label>
                  <input
                    name="stock"
                    type="number"
                    defaultValue={product?.stock ?? 50}
                    placeholder="50"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Pre-Order Toggle Card */}
              <div
                className={`rounded-[24px] p-5 border transition-all ${
                  isPreorder
                    ? 'bg-amber-500/5 border-amber-300/80'
                    : 'bg-[#F6F6F8] border-gray-200/80'
                }`}
              >
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isPreorder}
                      onChange={(e) => setIsPreorder(e.target.checked)}
                      className="h-4 w-4 rounded-full accent-[#D4AF37] cursor-pointer"
                    />
                    <div>
                      <div className="text-xs font-mono uppercase tracking-wider font-semibold text-navy">
                        ✦ Made-to-Order Pre-Order Fulfillment
                      </div>
                      <div className="text-[11px] text-navy/60 mt-0.5">
                        Item is crafted upon order allocation. Checkout skips physical inventory
                        barriers.
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full font-medium ${
                      isPreorder ? 'bg-amber-100 text-amber-800' : 'bg-gray-200/60 text-navy/50'
                    }`}
                  >
                    {isPreorder ? 'Pre-Order Active' : 'Standard Stock'}
                  </span>
                </label>
              </div>

              {/* Sale / Compare at Price */}
              <div className="rounded-[24px] p-5 bg-[#F6F6F8] border border-gray-200/80 space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={hasSale}
                      onChange={(e) => setHasSale(e.target.checked)}
                      className="h-4 w-4 rounded-full accent-[#D4AF37] cursor-pointer"
                    />
                    <span className="text-xs font-mono uppercase tracking-wider font-semibold text-navy">
                      Enable Promotional / Sale Strikethrough
                    </span>
                  </div>
                </label>
                {hasSale && (
                  <div className="pt-2 animate-in fade-in">
                    <label className={labelClass}>Original Price Before Discount ($)</label>
                    <input
                      name="compare_at_price"
                      type="number"
                      step="0.01"
                      min="0"
                      defaultValue={product?.compare_at_price || ''}
                      placeholder="478"
                      className={inputClass}
                    />
                    <p className="text-[10px] text-navy/40 mt-1.5 font-mono">
                      Shown with strikethrough in product view and shop cards.
                    </p>
                  </div>
                )}
              </div>

              {/* Description & Materials */}
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Piece Description</label>
                  <textarea
                    name="description"
                    defaultValue={product?.description}
                    rows={3}
                    placeholder="Artisanal craftsmanship, tailored silhouette..."
                    className={`${inputClass} resize-none`}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Materials & Sourcing</label>
                    <textarea
                      name="materials"
                      defaultValue={product?.materials || ''}
                      rows={2}
                      placeholder="e.g. Italian calf leather, custom brass hardware"
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Care Instructions</label>
                    <textarea
                      name="care_instructions"
                      defaultValue={product?.care_instructions || ''}
                      rows={2}
                      placeholder="e.g. Store in dedicated atelier dust bag"
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                </div>
              </div>

              {/* Stripe Direct Link */}
              <div>
                <label className={labelClass}>Stripe Direct Payment Link (Optional Override)</label>
                <input
                  name="stripe_checkout_url"
                  defaultValue={product?.stripe_checkout_url || ''}
                  placeholder="https://buy.stripe.com/..."
                  className={inputClass}
                />
              </div>

              {/* Catalog Flags */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    name="active"
                    defaultChecked={product?.active ?? true}
                    className="h-4 w-4 rounded accent-navy"
                  />
                  <span className="text-xs font-mono uppercase tracking-wider font-semibold text-navy">
                    Active in Catalog
                  </span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_new"
                    defaultChecked={product?.is_new ?? false}
                    className="h-4 w-4 rounded accent-navy"
                  />
                  <span className="text-xs font-mono uppercase tracking-wider font-semibold text-navy">
                    Mark as Atelier New Release
                  </span>
                </label>
              </div>

              {/* Footer Actions */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3 sticky bottom-0 bg-white py-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-6 py-3 rounded-full text-xs font-mono uppercase tracking-wider text-navy/60 hover:text-navy hover:bg-gray-100 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="bg-[#4A4D52] hover:bg-navy text-white text-xs font-mono uppercase tracking-[0.16em] px-8 py-3 rounded-full transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center gap-2 font-medium"
                >
                  {saving && (
                    <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                  )}
                  <span>{mode === 'create' ? 'Create Piece' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
