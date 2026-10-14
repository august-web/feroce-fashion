import { fetchProducts } from '@/lib/shop-data'
import { HeroSection } from '@/components/home/HeroSection'
import { VideoGrid } from '@/components/home/VideoGrid'
import { FounderSection } from '@/components/home/FounderSection'
import { EditSection } from '@/components/home/EditSection'
import { MemberBanner } from '@/components/home/MemberBanner'

export const dynamic = 'force-dynamic'

const EDIT_COLLECTIONS = new Set(['Naji', 'Denim De Ville'])

export default async function HomePage() {
  const products = await fetchProducts()

  const signature = products.filter(p => p.collection && EDIT_COLLECTIONS.has(p.collection))
  const edit = (signature.length >= 2 ? signature : products).slice(0, 4)

  return (
    <>
      <HeroSection />
      <VideoGrid />
      <FounderSection />
      <EditSection products={edit} />
      <MemberBanner />
    </>
  )
}
