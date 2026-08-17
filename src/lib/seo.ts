import { useEffect } from 'react'

/**
 * Absolute base for canonical URLs, og:url and og:image. Set VITE_SITE_URL in the
 * build environment at launch (e.g. https://feroce.com); until then the deployed
 * origin is used so dev/preview social sharing still resolves correctly.
 */
const siteUrl = (import.meta.env.VITE_SITE_URL as string | undefined)?.trim().replace(/\/+$/, '') || (typeof window !== 'undefined' ? window.location.origin : '')

const toAbsolute = (path: string) => (/^https?:\/\//.test(path) ? path : `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`)

/** Default social-card image — the brand editorial campaign, served from the site origin. */
const DEFAULT_IMAGE = '/images/hero-campaign.jpg'

/** Launch-ready brand statement used for the static shell and as a sane fallback. */
export const BRAND_DESCRIPTION = 'FÉROCE — the new designer bags for women and men. High quality, sturdy and luxury, made to be worn every day and made to be seen.'

function ensureMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export interface SeoOptions {
  /** Absolute or site-relative image for og:image / twitter:image (defaults to the brand campaign image). */
  image?: string
  /** Override the canonical path (defaults to the current location.pathname, query excluded). */
  path?: string
  /** Open Graph type (defaults to 'website'). */
  type?: string
}

/**
 * Per-page SEO + social sharing: sets the title, meta description, Open Graph,
 * Twitter card, og:image and the absolute canonical URL for the current route.
 */
export function useSeo(title: string, description: string, options: SeoOptions = {}) {
  useEffect(() => {
    const fullTitle = `${title} — FÉROCE`
    const path = options.path ?? window.location.pathname
    const url = `${siteUrl}${path === '/' ? '/' : path.replace(/\/+$/, '')}`
    const image = toAbsolute(options.image ?? DEFAULT_IMAGE)

    document.title = fullTitle
    ensureMeta('name', 'description', description)
    ensureMeta('property', 'og:title', fullTitle)
    ensureMeta('property', 'og:description', description)
    ensureMeta('property', 'og:type', options.type ?? 'website')
    ensureMeta('property', 'og:url', url)
    ensureMeta('property', 'og:image', image)
    ensureMeta('property', 'og:site_name', 'FÉROCE')
    ensureMeta('name', 'twitter:card', 'summary_large_image')
    ensureMeta('name', 'twitter:title', fullTitle)
    ensureMeta('name', 'twitter:description', description)
    ensureMeta('name', 'twitter:image', image)

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = url
  }, [title, description, options.image, options.path, options.type])
}
