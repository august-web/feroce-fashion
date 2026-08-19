import { fetchCategories, fetchProducts } from '@/lib/shop-data'
import { HeroSection } from '@/components/home/HeroSection'
import { Marquee } from '@/components/home/Marquee'
import { CategoryIcons } from '@/components/home/CategoryIcons'
import { EditSection } from '@/components/home/EditSection'
import { LifestyleStrip } from '@/components/home/LifestyleStrip'
import { MemberBanner } from '@/components/home/MemberBanner'

// ── Product counts per category ──

async function getProductCounts(categories: { id: string; slug: string }[]): Promise<Record<string, number>> {
  // Since we're using seed data fallback, just count from the products
  const products = await fetchProducts()
  const counts: Record<string, number> = {}
  for (const cat of categories) {
    counts[cat.slug] = products.filter((p) => p.category_id === cat.id).length
  }
  return counts
}

// ── Page Component ──

export default async function HomePage() {
  const [categories, allProducts] = await Promise.all([fetchCategories(), fetchProducts()])
  const productCounts = await getProductCounts(categories)

  // Only show first 4 products on homepage
  const products = allProducts.slice(0, 4)

  return (
    <>
      <HeroSection />
      <Marquee />
      <CategoryIcons categories={categories} productCounts={productCounts} />
      <EditSection products={products} />
      <LifestyleStrip />
      <MemberBanner />
    </>
  )
}
