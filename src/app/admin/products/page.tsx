import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'
import { formatPrice } from '@/lib/types'
import { ProductActions } from './ProductActions'
import { Sparkles, Package, Check, Layers, AlertCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Products & Inventory — FÉROCE Admin',
  description: 'Manage handcrafted Dallas atelier handbag catalog and inventory.',
}

type ProductRow = {
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
  created_at: string
}

type CategoryRow = { id: string; name: string; slug: string; sort_order: number }

async function getProducts(): Promise<ProductRow[]> {
  const supabase = createAdminClient()
  const { data } = (await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })) as { data: ProductRow[] | null }
  return data || []
}

async function getCategories(): Promise<CategoryRow[]> {
  const supabase = createAdminClient()
  const { data } = (await supabase
    .from('categories')
    .select('*')
    .order('sort_order')) as { data: CategoryRow[] | null }
  return data || []
}

export default async function AdminProductsPage() {
  const products = await getProducts()
  const categories = await getCategories()

  const preorderCount = products.filter((p) => p.preorder).length
  const inStockCount = products.filter((p) => !p.preorder && p.stock > 0).length
  const totalStockUnits = products.reduce((sum, p) => sum + (p.stock || 0), 0)

  return (
    <div className="p-5 sm:p-8 lg:p-10 space-y-8 max-w-7xl mx-auto">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 bg-[#F6F6F8] border border-gray-200/80 text-[11px] font-semibold tracking-wider uppercase text-navy/70 mb-3 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            • ATELIER PIECES & INVENTORY CONTROL
          </div>
          <h1 className="font-sans font-bold text-navy text-2xl sm:text-4xl tracking-[-0.035em]">
            Products & Inventory
          </h1>
          <p className="text-xs sm:text-sm text-navy/60 font-sans mt-1">
            Manage your Dallas atelier handbag silhouettes, pricing, inventory stock, and pre-order drops.
          </p>
        </div>

        <div>
          <ProductActions mode="create" categories={categories} />
        </div>
      </div>

      {/* ── Summary Micro Pills ── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="rounded-full px-4 py-2 bg-white border border-gray-200/80 text-xs font-semibold text-navy shadow-2xs">
          ✦ <strong>{products.length}</strong> Total Silhouettes
        </div>
        <div className="rounded-full px-4 py-2 bg-amber-50 border border-amber-200/70 text-xs font-semibold text-amber-900 shadow-2xs flex items-center gap-1.5">
          <Sparkles size={13} className="text-amber-600" />
          <span><strong>{preorderCount}</strong> Made-to-Order Pre-Orders</span>
        </div>
        <div className="rounded-full px-4 py-2 bg-emerald-50 border border-emerald-200/70 text-xs font-semibold text-emerald-900 shadow-2xs flex items-center gap-1.5">
          <Check size={13} className="text-emerald-600" />
          <span><strong>{inStockCount}</strong> Ready-to-Ship Pieces</span>
        </div>
        <div className="rounded-full px-4 py-2 bg-white border border-gray-200/80 text-xs font-semibold text-navy/60 shadow-2xs">
          <strong>{totalStockUnits}</strong> Total Recorded Workshop Units
        </div>
      </div>

      {/* ── Products Table Card ── */}
      <div className="rounded-[32px] sm:rounded-[40px] bg-white border border-gray-200/80 p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.02)] space-y-6">
        <div className="overflow-x-auto rounded-[24px] border border-gray-200/80">
          <table className="w-full text-left text-sm font-sans">
            <thead>
              <tr className="bg-[#F6F6F8] border-b border-gray-200/80 text-[10px] font-bold uppercase tracking-wider text-navy/55">
                <th className="px-5 py-4">Piece</th>
                <th className="px-5 py-4">Title & Collection</th>
                <th className="px-5 py-4">Price</th>
                <th className="px-5 py-4">Fulfillment Mode</th>
                <th className="px-5 py-4">Workshop Stock</th>
                <th className="px-5 py-4">Visibility</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => {
                const hasSale =
                  Boolean(product.compare_at_price) &&
                  product.compare_at_price! > product.price
                const image = product.image_urls?.[0] || '/images/hero-home.jpg'

                return (
                  <tr key={product.id} className="hover:bg-[#FBFBFC] transition-colors">
                    {/* Thumbnail */}
                    <td className="px-5 py-4">
                      <div className="w-14 h-16 rounded-[16px] overflow-hidden bg-[#ECECEE] border border-gray-100 shrink-0">
                        <img
                          src={image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </td>

                    {/* Title & Details */}
                    <td className="px-5 py-4">
                      <p className="font-bold text-sm text-navy">{product.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {product.color && (
                          <span className="text-[11px] text-navy/55">{product.color}</span>
                        )}
                        {product.collection && (
                          <span className="rounded-full px-2 py-0.5 bg-[#F6F6F8] text-[9px] font-semibold text-navy/60 uppercase">
                            {product.collection}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Price */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-navy">
                          {formatPrice(product.price)}
                        </span>
                        {hasSale && (
                          <span className="text-xs text-navy/40 line-through">
                            {formatPrice(product.compare_at_price!)}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Fulfillment Mode */}
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {product.preorder ? (
                          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 bg-amber-50 border border-amber-200/80 text-[10px] font-bold uppercase tracking-wider text-amber-900 shadow-2xs">
                            <Sparkles size={10} className="text-amber-600" />
                            Pre-Order Allocation
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 bg-emerald-50 border border-emerald-200/80 text-[10px] font-bold uppercase tracking-wider text-emerald-800 shadow-2xs">
                            <Check size={10} strokeWidth={2.5} className="text-emerald-600" />
                            In Stock
                          </span>
                        )}
                        {product.is_new && (
                          <span className="rounded-full px-2 py-0.5 bg-gold/15 text-navy text-[9px] font-bold uppercase tracking-wider">
                            New
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Stock Count */}
                    <td className="px-5 py-4">
                      <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 bg-[#F6F6F8] border border-gray-200 text-xs font-bold font-mono text-navy">
                        <Package size={12} className="text-navy/50" />
                        <span>{product.stock} units</span>
                      </div>
                    </td>

                    {/* Visibility */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          product.active
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/70'
                            : 'bg-gray-100 text-gray-500 border border-gray-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            product.active ? 'bg-emerald-600' : 'bg-gray-400'
                          }`}
                        />
                        {product.active ? 'Active' : 'Draft'}
                      </span>
                    </td>

                    {/* Edit Actions */}
                    <td className="px-5 py-4 text-right">
                      <ProductActions
                        mode="edit"
                        product={product}
                        categories={categories}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
