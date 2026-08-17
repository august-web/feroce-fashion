/**
 * Real collection definitions for FÉROCE FASHION_FF, grounded in the brand's
 * Instagram feed (@ferocefashion_ff): materials and colorways are taken from the
 * actual post captions and product-sheet graphics, not invented.
 *
 * The storefront currently carries placeholder product records as a stopgap —
 * the pieces shown in each collection are sample records until the client
 * uploads real SKUs. `count` is derived from the live/static catalog at render
 * time, so a collection with no products yet (Naji) renders an honest
 * "pieces arriving" state instead of a fabricated list.
 */
export interface CollectionDefinition {
  slug: string
  name: string
  /** Short editorial line used on tiles and headers. */
  line: string
  /** Collection story written from the feed captions. */
  story: string
  /** Actual materials, listed in the order the brand describes them. */
  materials: string[]
  /** Actual colorways with swatch hexes. */
  colorways: { name: string; hex: string }[]
  /** Hero/campaign image for the collection. */
  image: string
  /** Secondary image (a second colorway or product sheet). */
  secondaryImage: string
  /** Eyebrow label above the collection name. */
  eyebrow: string
  /** Optional note for collections whose real SKUs are not uploaded yet. */
  note?: string
}

export const collections: CollectionDefinition[] = [
  {
    slug: 'de-ville',
    name: 'De Ville',
    eyebrow: 'The signature collection',
    line: 'Structured flap bags — cream gold & navy denim, all-over gold monogram.',
    story:
      'The house signature: a structured flap shoulder bag crafted from denim-textured coated canvas with an all-over gold monogram — high quality, sturdy and luxury, made to be worn every day. De Ville arrives in cream gold and the navy & gold denim edition, and extends into a convertible fanny pack & satchel line for the men’s side, made up in cream, brown, grey, black and red.',
    materials: [
      'Denim-textured coated canvas',
      'All-over gold monogram',
      'Gold metal hardware',
      'Signature FÉROCE logo',
      'Adjustable crossbody strap',
      'Multiple compartments',
      'Front & back zip pockets',
      'Luxury interior lining',
    ],
    colorways: [
      { name: 'Cream Gold', hex: '#D9C7A0' },
      { name: 'Navy & Gold', hex: '#23304C' },
      { name: 'Cream', hex: '#E7DEC9' },
      { name: 'Brown', hex: '#6B4A2F' },
      { name: 'Grey', hex: '#8A8A8A' },
      { name: 'Black', hex: '#191919' },
      { name: 'Red', hex: '#8E1F2D' },
    ],
    image: '/images/women-campaign.jpg',
    secondaryImage: '/images/product-weekender.jpg',
  },
  {
    slug: 'naji',
    name: 'Naji',
    eyebrow: 'The soft-fur line',
    line: 'Statement fur handbags — red maroon & golden.',
    story:
      'The Naji Handbag Collection: our statement fur handbags in red maroon and golden, crafted from high-quality materials — fur, bobby-shiney and satin — with a special gift for special women. A bolder, softer side of the house, made to be seen.',
    materials: ['High-quality fur', 'Bobby-shiney material', 'Satin', 'Structured flap silhouette'],
    colorways: [
      { name: 'Red Maroon', hex: '#6E1626' },
      { name: 'Golden', hex: '#C9A227' },
      { name: 'Golden Fur', hex: '#B98A2F' },
      { name: 'Black Bobby', hex: '#141414' },
    ],
    image: '/images/naji-campaign.jpg',
    secondaryImage: '/images/product-mini.jpg',
    note: 'Real Naji SKUs and pricing are being confirmed with the founder. The pieces shown below are placeholders until the client uploads the collection.',
  },
]

export const getCollection = (slug: string | undefined) => collections.find(c => c.slug === slug)
