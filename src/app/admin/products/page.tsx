import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'
import { formatPrice } from '@/lib/types'
import { ProductActions } from './ProductActions'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Products — FÉROCE Admin',
  description: 'Manage your Féroce product catalog.',
}

type ProductRow = {
  id: string; name: string; slug: string; description: string; price: number
  image_urls: string[]; color: string; stock: number; active: boolean
  is_new: boolean; category_id: string; created_at: string
}

type CategoryRow = { id: string; name: string; slug: string; sort_order: number }

async function getProducts(): Promise<ProductRow[]> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false }) as { data: ProductRow[] | null }
  return data || []
}

async function getCategories(): Promise<CategoryRow[]> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order') as { data: CategoryRow[] | null }
  return data || []
}

export default async function AdminProductsPage() {
  const products = await getProducts()
  const categories = await getCategories()

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-navy">Products</h1>
          <p className="text-sm text-navy/50 mt-1">{products.length} products</p>
        </div>
        <ProductActions mode="create" categories={categories} />
      </div>

      {/* Products table */}
      <div className="bg-white border border-line overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line">
              <th className="px-5 py-3 text-left text-[10px] font-sans uppercase tracking-luxury text-navy/50 font-medium">Image</th>
              <th className="px-5 py-3 text-left text-[10px] font-sans uppercase tracking-luxury text-navy/50 font-medium">Name</th>
              <th className="px-5 py-3 text-left text-[10px] font-sans uppercase tracking-luxury text-navy/50 font-medium">Price</th>
              <th className="px-5 py-3 text-left text-[10px] font-sans uppercase tracking-luxury text-navy/50 font-medium">Stock</th>
              <th className="px-5 py-3 text-left text-[10px] font-sans uppercase tracking-luxury text-navy/50 font-medium">Active</th>
              <th className="px-5 py-3 text-left text-[10px] font-sans uppercase tracking-luxury text-navy/50 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-line/50 last:border-0 hover:bg-cream/50 transition-colors">
                <td className="px-5 py-3">
                  <div className="h-12 w-12 overflow-hidden border border-line bg-cream">
                    {product.image_urls?.[0] && (
                      <img src={product.image_urls[0]} alt={product.name} className="h-full w-full object-cover" />
                    )}
                  </div>
                </td>
                <td className="px-5 py-3">
                  <p className="font-medium text-navy">{product.name}</p>
                  <p className="text-[10px] text-navy/40 mt-0.5">{product.color}</p>
                </td>
                <td className="px-5 py-3 text-navy">{formatPrice(product.price)}</td>
                <td className="px-5 py-3 text-navy/60">{product.stock}</td>
                <td className="px-5 py-3">
                  <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 ${
                    product.active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {product.active ? 'Active' : 'Draft'}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <ProductActions mode="edit" product={product} categories={categories} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
