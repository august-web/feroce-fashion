interface OrganizationJsonLdProps {
  name: string
  url: string
  logo: string
  description: string
  sameAs?: string[]
}

export function OrganizationJsonLd({ name, url, logo, description, sameAs = [] }: OrganizationJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo,
    description,
    sameAs,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Dallas',
      addressRegion: 'TX',
      addressCountry: 'US',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

interface ProductJsonLdProps {
  name: string
  description: string
  image: string[]
  url: string
  price: number
  priceCurrency?: string
  availability?: string
  brand?: string
  reviewCount?: number
  ratingValue?: number
}

export function ProductJsonLd({
  name,
  description,
  image,
  url,
  price,
  priceCurrency = 'USD',
  availability = 'https://schema.org/InStock',
  brand = 'FÉROCE',
  reviewCount = 84,
  ratingValue = 5.0,
}: ProductJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image,
    url,
    brand: { '@type': 'Brand', name: brand },
    offers: {
      '@type': 'Offer',
      price: price / 100,
      priceCurrency,
      availability,
      url,
    },
    aggregateRating: { '@type': 'AggregateRating', ratingValue, reviewCount },
  }

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  )
}

interface BreadcrumbJsonLdProps {
  items: { name: string; url: string }[]
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  )
}

interface WebsiteJsonLdProps {
  name: string
  url: string
  description: string
}

export function WebsiteJsonLd({ name, url, description }: WebsiteJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    description,
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${url}/shop?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  )
}

interface CollectionPageJsonLdProps {
  name: string
  description: string
  url: string
  numberOfItems: number
}

export function CollectionPageJsonLd({ name, description, url, numberOfItems }: CollectionPageJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url,
    numberOfItems,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems,
      itemListOrder: 'https://schema.org/ItemListUnordered',
    },
  }

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  )
}

interface FaqJsonLdProps {
  items: { question: string; answer: string }[]
}

export function FaqJsonLd({ items }: FaqJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  )
}
