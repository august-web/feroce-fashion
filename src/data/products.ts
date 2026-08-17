import type { Product, OrderRow } from '../types'

// SAMPLE CATALOG: names, specifications and prices must be reviewed by the brand before launch.
// Collection mapping: the storefront is structured around the brand's real collections
// (De Ville, Naji — see src/data/collections.ts). These placeholder records stand in for
// real SKUs until the client uploads them, so they are grouped under De Ville (the structured
// bag line) for now; Naji (fur) has no SKUs on the site yet and renders a "pieces arriving"
// state on its collection page.
export const products: Product[] = [
  {
    id: 'p_noir_01', slug: 'feroce-noir-01', name: 'Féroce Noir 01', subtitle: 'Sculpted top-handle bag',
    price: 2450, priceIsPlaceholder: true, category: 'Top Handle', gender: 'Women', collection: 'De Ville',
    image: '/images/product-noir.jpg', alternateImage: '/images/women-campaign.jpg',
    colors: [{ name: 'Noir', hex: '#151515' }, { name: 'Oxblood', hex: '#551B24' }], badge: 'BEST SELLER',
    availability: 'In stock', inventory: 12, variants: ['Classic'],
    description: 'An architectural top-handle silhouette created for a decisive everyday presence.',
    materials: 'Denim-textured coated canvas; gold metal hardware; signature FÉROCE logo; luxury interior lining.',
    dimensions: '26 × 19 × 10 cm.', keywords: ['black', 'structured', 'elegant']
  },
  {
    id: 'p_rouge_02', slug: 'rouge-mouvement', name: 'Rouge Mouvement', subtitle: 'Soft leather shoulder bag',
    price: 2180, priceIsPlaceholder: true, category: 'Shoulder Bag', gender: 'Women', collection: 'De Ville',
    image: '/images/product-rouge.jpg', alternateImage: '/images/women-campaign.jpg',
    colors: [{ name: 'Oxblood', hex: '#551B24' }, { name: 'Noir', hex: '#151515' }], badge: 'NEW',
    availability: 'In stock', inventory: 8, variants: ['Classic', 'Mini'],
    description: 'A relaxed shoulder silhouette shaped by movement, proportion and tactile softness.',
    materials: 'Denim-textured coated canvas; gold metal hardware; adjustable strap; luxury interior lining.',
    dimensions: '29 × 18 × 9 cm.', keywords: ['red', 'shoulder', 'soft']
  },
  {
    id: 'p_sable_03', slug: 'sable-carryall', name: 'Sable Carryall', subtitle: 'Refined everyday tote',
    price: 2600, priceIsPlaceholder: true, category: 'Tote', gender: 'Women', collection: 'De Ville',
    image: '/images/product-sable.jpg', alternateImage: '/images/atelier.jpg',
    colors: [{ name: 'Sable', hex: '#B39A7C' }, { name: 'Noir', hex: '#151515' }],
    availability: 'Low stock', inventory: 3, variants: ['Medium', 'Large'],
    description: 'A precise, upright carryall balancing generous volume with a refined profile.',
    materials: 'Denim-textured coated canvas; gold metal hardware; multiple compartments; luxury interior lining.',
    dimensions: '34 × 28 × 13 cm.', keywords: ['beige', 'work', 'tote']
  },
  {
    id: 'p_homme_04', slug: 'ligne-messenger', name: 'Ligne Messenger', subtitle: 'Slim leather city satchel',
    price: 2320, priceIsPlaceholder: true, category: 'Crossbody', gender: 'Men', collection: 'De Ville',
    image: '/images/product-homme.jpg', alternateImage: '/images/men-campaign.jpg',
    colors: [{ name: 'Espresso', hex: '#38251D' }, { name: 'Noir', hex: '#151515' }], badge: 'NEW',
    availability: 'In stock', inventory: 9, variants: ['Regular'],
    description: 'A disciplined city bag with considered organization and an assured, streamlined profile.',
    materials: 'Denim-textured coated canvas; gold metal hardware; adjustable crossbody strap; front zip pocket.',
    dimensions: '25 × 29 × 7 cm.', keywords: ['brown', 'men', 'satchel', 'city']
  },
  {
    id: 'p_week_05', slug: 'nocturne-weekender', name: 'Nocturne 48', subtitle: 'Overnight leather holdall',
    price: 3450, priceIsPlaceholder: true, category: 'Travel', gender: 'Men', collection: 'De Ville',
    image: '/images/product-weekender.jpg', alternateImage: '/images/men-campaign.jpg',
    colors: [{ name: 'Noir', hex: '#151515' }, { name: 'Espresso', hex: '#38251D' }], badge: 'LIMITED',
    availability: 'Made to order', inventory: 4, variants: ['48-hour'],
    description: 'A low-profile weekender designed for concise journeys and unhurried arrivals.',
    materials: 'Denim-textured coated canvas; gold metal hardware; metal feet; cotton lining.',
    dimensions: '48 × 27 × 22 cm.', keywords: ['travel', 'weekender', 'men', 'black']
  },
  {
    id: 'p_vert_06', slug: 'vert-miniature', name: 'Vert Miniature', subtitle: 'Compact top-handle bag',
    price: 1850, priceIsPlaceholder: true, category: 'Mini Bag', gender: 'Women', collection: 'De Ville',
    image: '/images/product-mini.jpg', alternateImage: '/images/atelier.jpg',
    colors: [{ name: 'Forest', hex: '#26372D' }, { name: 'Oxblood', hex: '#551B24' }], badge: 'PRE-ORDER',
    availability: 'Pre-order', inventory: 25, variants: ['Mini'], preorderEstimate: 'Estimated dispatch window to be confirmed by the brand.',
    description: 'A compact statement of geometry and color, designed to carry only the essential.',
    materials: 'Denim-textured coated canvas; brushed gold hardware; signature FÉROCE logo; luxury interior lining.',
    dimensions: '19 × 15 × 7 cm.', keywords: ['green', 'mini', 'preorder']
  },
]

export const formatMoney = (value: number, currency: string = 'GHS') => new Intl.NumberFormat('en-GH', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value)
