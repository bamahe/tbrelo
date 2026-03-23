// ============================================================
// IMAGE RESOLVER
// ============================================================
// Resolves the correct hero image for any page using tiered fallback:
// 1. Frontmatter `image` field (if set)
// 2. Page-specific image (pillar/county have their own)
// 3. County fallback (cities inherit their county's image)
// 4. Category fallback (blog posts use category images)
// ============================================================

import { siteConfig } from './config'

// Maps blog slugs to image categories based on keyword patterns
function getBlogCategory(slug: string): string {
  if (slug.includes('-vs-')) return 'comparison'
  if (/insurance|loan|mortgage|cost|tax|exemption|closing|escrow|title|apprais/.test(slug)) return 'finance'
  if (/hurricane|bug|storm|weather|flood/.test(slug)) return 'weather'
  if (/fishing|dog-park|beach|outdoor|day-trip|kayak/.test(slug)) return 'outdoors'
  if (/coffee|market|living|newcomer|farmer/.test(slug)) return 'lifestyle'
  return 'housing'
}

interface GetPageImageOptions {
  type: 'pillar' | 'county' | 'city' | 'blog' | 'moving-from' | 'page'
  slug: string
  frontmatterImage?: string  // Optional override from markdown frontmatter
  county?: string            // For city pages — their parent county name
}

// Returns the image path relative to /images/ (e.g., "heroes/hillsborough.jpg")
export function getPageImage(opts: GetPageImageOptions): string {
  // Frontmatter override always wins
  if (opts.frontmatterImage) return opts.frontmatterImage

  switch (opts.type) {
    case 'county':
      return `heroes/${opts.slug}.jpg`

    case 'city':
      // Cities fall back to their county's hero image
      if (opts.county) {
        return `heroes/${opts.county.toLowerCase()}.jpg`
      }
      return 'heroes/homepage.jpg'

    case 'pillar':
      return `pillar/${opts.slug}.jpg`

    case 'blog':
      return `blog/${getBlogCategory(opts.slug)}.jpg`

    case 'moving-from':
      return 'moving-from.jpg'

    case 'page':
      return 'heroes/homepage.jpg'

    default:
      return 'heroes/homepage.jpg'
  }
}

// Full URL for OG image meta tags
export function getPageImageUrl(opts: GetPageImageOptions): string {
  return `${siteConfig.url}/images/${getPageImage(opts)}`
}
