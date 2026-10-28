import { fetchProducts } from '@/lib/shop-data'
import { HeroSection } from '@/components/home/HeroSection'
import { SilhouetteSelector } from '@/components/home/SilhouetteSelector'
import { DropShowcase } from '@/components/home/DropShowcase'
import { EditSection } from '@/components/home/EditSection'
import { VideoGrid } from '@/components/home/VideoGrid'
import { ReviewsSection } from '@/components/home/ReviewsSection'
import { MemberBanner } from '@/components/home/MemberBanner'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const products = await fetchProducts()

  return (
    <div className="bg-white">
      {/* 1. High-Impact Editorial Hero + Value Pillars */}
      <HeroSection />

      {/* 2. Glamaholic Silhouette Taxonomy Bar */}
      <SilhouetteSelector />

      {/* 3. Flagship Pre-order Spotlight (Denim De Ville) */}
      <DropShowcase />

      {/* 4. Complete Catalog Showcase with Quick-Add */}
      <EditSection products={products} />

      {/* 5. Dallas Atelier Video Craftsmanship */}
      <VideoGrid />

      {/* 6. Verified Customer Social Proof & Reviews */}
      <ReviewsSection />

      {/* 7. Private Inner Circle Membership */}
      <MemberBanner />
    </div>
  )
}
