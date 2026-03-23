# tbrelo.com Images Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add ~35 Unsplash stock photos across the entire tbrelo.com site with hero banners, fallback logic, and OG image metadata.

**Architecture:** Download images via Unsplash API script, create an image resolver utility (`lib/images.ts`), build a reusable `HeroImage` component, update all 5 page templates to render hero images and OG metadata.

**Tech Stack:** Next.js 14 (static export), Tailwind CSS, Unsplash API, next/image (unoptimized)

---

## Chunk 1: Image Infrastructure

### Task 1: Create image directory structure and download script

**Files:**
- Create: `scripts/download-images.ts`
- Create: `public/images/.gitkeep`

- [ ] **Step 1: Create the image directory structure**

```bash
mkdir -p public/images/heroes public/images/pillar public/images/blog
```

- [ ] **Step 2: Write the image download script**

Create `scripts/download-images.ts`. This script uses the Unsplash API to search for and download images. Requires `UNSPLASH_ACCESS_KEY` env var.

```typescript
// scripts/download-images.ts
// Downloads stock photos from Unsplash for the tbrelo.com site.
// Usage: UNSPLASH_ACCESS_KEY=your_key npx ts-node scripts/download-images.ts

import https from 'https'
import fs from 'fs'
import path from 'path'

const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY
if (!ACCESS_KEY) {
  console.error('Set UNSPLASH_ACCESS_KEY env var. Get one free at https://unsplash.com/developers')
  process.exit(1)
}

// Each entry: [filename, search query]
const images: [string, string][] = [
  // Homepage + Counties
  ['heroes/homepage.jpg', 'Tampa Bay Florida skyline waterfront'],
  ['heroes/hillsborough.jpg', 'Tampa Florida downtown skyline'],
  ['heroes/pinellas.jpg', 'St Petersburg Florida waterfront'],
  ['heroes/pasco.jpg', 'Wesley Chapel Florida suburban neighborhood'],
  ['heroes/polk.jpg', 'Lakeland Florida lake swan'],
  ['heroes/manatee.jpg', 'Bradenton Florida riverwalk'],
  ['heroes/sarasota.jpg', 'Sarasota Florida bay sunset'],
  ['heroes/citrus.jpg', 'Crystal River Florida nature springs'],
  ['heroes/hernando.jpg', 'Weeki Wachee Florida springs'],

  // Pillar guides
  ['pillar/moving-to-tampa-bay.jpg', 'Tampa Bay bridge sunset Florida'],
  ['pillar/cost-of-living.jpg', 'Florida neighborhood homes palm trees'],
  ['pillar/tampa-bay-housing-market.jpg', 'Florida homes aerial neighborhood'],
  ['pillar/investing-tampa-bay.jpg', 'Florida rental property investment'],
  ['pillar/florida-homestead-exemption.jpg', 'Florida home front yard palm'],
  ['pillar/florida-taxes.jpg', 'Florida residential street palm trees'],
  ['pillar/hurricane-prep.jpg', 'Florida storm clouds dramatic sky'],
  ['pillar/retirees-tampa-bay.jpg', 'Florida retirement community pool'],
  ['pillar/remote-work-tampa-bay.jpg', 'home office laptop Florida'],
  ['pillar/tampa-bay-schools.jpg', 'school building campus Florida'],
  ['pillar/tampa-bay-healthcare.jpg', 'hospital medical center Florida'],
  ['pillar/tampa-bay-job-market.jpg', 'Tampa office buildings business district'],
  ['pillar/tampa-bay-neighborhoods.jpg', 'Florida neighborhood street trees'],
  ['pillar/tampa-bay-beaches.jpg', 'Tampa Bay beach sunset Gulf Mexico'],
  ['pillar/tampa-bay-things-to-do.jpg', 'Tampa riverwalk activities people'],
  ['pillar/tampa-bay-outdoor-living.jpg', 'Florida kayaking nature outdoor'],
  ['pillar/moving-checklist.jpg', 'moving boxes packing home'],
  ['pillar/florida-drivers-license.jpg', 'Florida road driving palm trees'],
  ['pillar/florida-car-registration.jpg', 'car parked Florida palm trees'],

  // Blog categories (shared)
  ['blog/comparison.jpg', 'Tampa Bay aerial neighborhoods houses'],
  ['blog/lifestyle.jpg', 'Florida outdoor dining lifestyle'],
  ['blog/housing.jpg', 'Florida homes for sale residential'],
  ['blog/finance.jpg', 'mortgage documents house keys'],
  ['blog/weather.jpg', 'Florida sunshine palm trees blue sky'],
  ['blog/outdoors.jpg', 'Tampa Bay park nature trail'],

  // Moving-from (shared)
  ['moving-from.jpg', 'welcome Florida palm trees road'],
]

// Fetch the top Unsplash result for a query and download it
async function downloadImage(filename: string, query: string): Promise<void> {
  const outPath = path.join(process.cwd(), 'public', 'images', filename)

  // Skip if already downloaded
  if (fs.existsSync(outPath)) {
    console.log(`SKIP ${filename} (already exists)`)
    return
  }

  // Search Unsplash
  const searchUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape&client_id=${ACCESS_KEY}`

  const searchResult = await fetch(searchUrl).then(r => r.json())

  if (!searchResult.results || searchResult.results.length === 0) {
    console.error(`NO RESULTS for "${query}" — skipping ${filename}`)
    return
  }

  const photo = searchResult.results[0]
  // Use "regular" size (1080px wide) — good balance of quality and file size
  const imageUrl = photo.urls.regular

  // Download the image
  const response = await fetch(imageUrl)
  const buffer = Buffer.from(await response.arrayBuffer())

  // Ensure directory exists
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, buffer)

  console.log(`OK ${filename} — ${photo.user.name} (${photo.links.html})`)
}

// Run all downloads with a small delay to respect rate limits
async function main() {
  console.log(`Downloading ${images.length} images from Unsplash...\n`)

  for (const [filename, query] of images) {
    await downloadImage(filename, query)
    // Small delay to stay under rate limit (50 req/hr on free tier)
    await new Promise(r => setTimeout(r, 1500))
  }

  console.log('\nDone! Review images in public/images/ and swap any you don\'t like.')
}

main().catch(console.error)
```

- [ ] **Step 3: Run the download script**

First, get a free Unsplash API key at https://unsplash.com/developers (create an app, copy the Access Key).

```bash
UNSPLASH_ACCESS_KEY=your_key_here npx ts-node scripts/download-images.ts
```

Expected: 35 images downloaded to `public/images/`. Review the output — swap any bad matches by re-running with a different query or manually downloading.

- [ ] **Step 4: Add images directory to .gitignore (optional)**

If images are too large for git, add to `.gitignore`:
```
# Stock images — downloaded via scripts/download-images.ts
# public/images/*.jpg
```

Or commit them if total size is under 5MB. Check:
```bash
du -sh public/images/
```

- [ ] **Step 5: Commit**

```bash
git add scripts/download-images.ts public/images/
git commit -m "Add Unsplash image download script and stock photos"
```

---

### Task 2: Create image resolver utility

**Files:**
- Create: `lib/images.ts`

- [ ] **Step 1: Create the image resolver**

This utility resolves which image to show for any page, using the tiered fallback logic from the spec.

```typescript
// lib/images.ts
// Resolves the correct hero image for any page based on tiered fallback logic.
// Tier 1: Page-specific image (from frontmatter or matching filename)
// Tier 2: County fallback (cities use their county's image)
// Tier 3: Category fallback (blog posts use category images)

// Blog slug → category mapping
// Used to pick the right shared image for blog posts
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
  frontmatterImage?: string  // Optional override from frontmatter
  county?: string            // For city pages — their parent county
}

// Returns the image path relative to /images/ (e.g., "heroes/hillsborough.jpg")
export function getPageImage(opts: GetPageImageOptions): string {
  // Frontmatter override always wins
  if (opts.frontmatterImage) return opts.frontmatterImage

  switch (opts.type) {
    case 'county':
      // Each county has its own hero
      return `heroes/${opts.slug}.jpg`

    case 'city':
      // Cities fall back to their county's image
      if (opts.county) {
        return `heroes/${opts.county.toLowerCase()}.jpg`
      }
      return 'heroes/homepage.jpg'

    case 'pillar':
      // Pillar pages have their own images
      return `pillar/${opts.slug}.jpg`

    case 'blog':
      // Blog posts use category-based shared images
      return `blog/${getBlogCategory(opts.slug)}.jpg`

    case 'moving-from':
      // All moving-from pages share one image
      return 'moving-from.jpg'

    case 'page':
      // Static pages (about, privacy) fall back to homepage
      return 'heroes/homepage.jpg'

    default:
      return 'heroes/homepage.jpg'
  }
}

// Full URL for OG image tags
export function getPageImageUrl(opts: GetPageImageOptions): string {
  return `https://tbrelo.com/images/${getPageImage(opts)}`
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/images.ts
git commit -m "Add image resolver utility with tiered fallback logic"
```

---

## Chunk 2: HeroImage Component

### Task 3: Create HeroImage component

**Files:**
- Create: `components/HeroImage.tsx`

- [ ] **Step 1: Create the HeroImage component**

Full-width banner with dark overlay and title text. Uses `next/image` with `unoptimized: true` (required for static export).

```tsx
// components/HeroImage.tsx
// Full-width hero banner with background image, dark overlay, and page title.
// Used on all content pages (pillar, county, city, blog, moving-from).

import Image from 'next/image'

interface HeroImageProps {
  src: string    // Path relative to /images/, e.g. "heroes/hillsborough.jpg"
  title: string  // Page title displayed over the image
  subtitle?: string // Optional subtitle below the title
}

export default function HeroImage({ src, title, subtitle }: HeroImageProps) {
  return (
    <section className="relative w-full h-[200px] md:h-[300px] overflow-hidden bg-brand-navy">
      {/* Background image */}
      <Image
        src={`/images/${src}`}
        alt={title}
        fill
        className="object-cover"
        unoptimized
        priority
      />
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-brand-navy/60" />
      {/* Title text */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
        <h1 className="text-white text-3xl md:text-5xl font-display font-extrabold leading-tight max-w-4xl">
          {title}
        </h1>
        {subtitle && (
          <p className="text-gray-300 text-lg mt-3 max-w-2xl">{subtitle}</p>
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/HeroImage.tsx
git commit -m "Add HeroImage banner component"
```

---

## Chunk 3: Update Page Templates

### Task 4: Update pillar page template (top-level `[slug]`)

**Files:**
- Modify: `app/[slug]/page.tsx`

- [ ] **Step 1: Add hero image and OG metadata**

Update the file to import the image resolver and HeroImage component, add OG image to metadata, and render the hero banner.

Changes to `app/[slug]/page.tsx`:

1. Add imports at top:
```typescript
import HeroImage from '@/components/HeroImage'
import { getPageImage, getPageImageUrl } from '@/lib/images'
```

2. Update `generateMetadata` to include OG image:
```typescript
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const page = findPage(params.slug)
  if (!page) return {}
  const imageUrl = getPageImageUrl({
    type: page.frontmatter.type === 'page' ? 'page' : 'pillar',
    slug: params.slug,
    frontmatterImage: page.frontmatter.image,
  })
  return {
    title: page.frontmatter.metaTitle || page.frontmatter.title,
    description: page.frontmatter.metaDescription,
    openGraph: {
      images: [{ url: imageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      images: [imageUrl],
    },
  }
}
```

3. Add HeroImage before the article content (replace the standalone `<h1>`):
```tsx
const heroSrc = getPageImage({
  type: page.frontmatter.type === 'page' ? 'page' : 'pillar',
  slug: params.slug,
  frontmatterImage: page.frontmatter.image,
})

return (
  <>
    <script ... />
    <HeroImage src={heroSrc} title={page.frontmatter.title} />
    <article className="max-w-4xl mx-auto px-4 py-10">
      <Breadcrumb items={[...]} />
      {/* Remove the old <h1> — it's now in HeroImage */}
      <AdSlot slot="top" />
      ...
    </article>
  </>
)
```

- [ ] **Step 2: Verify build**

```bash
npm run build 2>&1 | tail -20
```

Expected: Build succeeds with no errors.

- [ ] **Step 3: Commit**

```bash
git add app/\[slug\]/page.tsx
git commit -m "Add hero image and OG metadata to pillar pages"
```

---

### Task 5: Update county page template

**Files:**
- Modify: `app/counties/[slug]/page.tsx`

- [ ] **Step 1: Add hero image and OG metadata**

Same pattern as Task 4. Add imports, update `generateMetadata`, add `HeroImage`, remove standalone `<h1>`.

Image resolver call:
```typescript
const heroSrc = getPageImage({
  type: 'county',
  slug: params.slug,
  frontmatterImage: page.frontmatter.image,
})
```

OG metadata:
```typescript
const imageUrl = getPageImageUrl({
  type: 'county',
  slug: params.slug,
  frontmatterImage: page.frontmatter.image,
})
```

- [ ] **Step 2: Verify build**

```bash
npm run build 2>&1 | tail -20
```

- [ ] **Step 3: Commit**

```bash
git add app/counties/\[slug\]/page.tsx
git commit -m "Add hero image and OG metadata to county pages"
```

---

### Task 6: Update city page template

**Files:**
- Modify: `app/cities/[slug]/page.tsx`

- [ ] **Step 1: Add hero image and OG metadata**

Cities use their parent county as fallback. The county name comes from frontmatter (`page.frontmatter.county`).

Image resolver call:
```typescript
const heroSrc = getPageImage({
  type: 'city',
  slug: params.slug,
  frontmatterImage: page.frontmatter.image,
  county: page.frontmatter.county,
})
```

- [ ] **Step 2: Verify build**

```bash
npm run build 2>&1 | tail -20
```

- [ ] **Step 3: Commit**

```bash
git add app/cities/\[slug\]/page.tsx
git commit -m "Add hero image and OG metadata to city pages"
```

---

### Task 7: Update blog post template

**Files:**
- Modify: `app/blog/[slug]/page.tsx`

- [ ] **Step 1: Add hero image and OG metadata**

Blog posts use category-based fallback from the slug pattern.

Image resolver call:
```typescript
const heroSrc = getPageImage({
  type: 'blog',
  slug: params.slug,
  frontmatterImage: page.frontmatter.image,
})
```

Move the published date below the breadcrumb (it was between h1 and content — now h1 is in the hero).

- [ ] **Step 2: Verify build**

```bash
npm run build 2>&1 | tail -20
```

- [ ] **Step 3: Commit**

```bash
git add app/blog/\[slug\]/page.tsx
git commit -m "Add hero image and OG metadata to blog posts"
```

---

### Task 8: Update moving-from page template

**Files:**
- Modify: `app/moving-from/[slug]/page.tsx`

- [ ] **Step 1: Add hero image and OG metadata**

All moving-from pages share one image.

Image resolver call:
```typescript
const heroSrc = getPageImage({
  type: 'moving-from',
  slug: params.slug,
  frontmatterImage: page.frontmatter.image,
})
```

- [ ] **Step 2: Verify build**

```bash
npm run build 2>&1 | tail -20
```

- [ ] **Step 3: Commit**

```bash
git add app/moving-from/\[slug\]/page.tsx
git commit -m "Add hero image and OG metadata to moving-from pages"
```

---

## Chunk 4: Homepage and Blog Index

### Task 9: Add hero image to homepage

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Update homepage hero to use background image**

Replace the solid navy background with the homepage hero image. Keep the existing text and CTAs.

```tsx
// In the hero section, replace:
//   className="bg-brand-navy text-white py-20 md:py-28"
// With a relative container + background image:

<section className="relative text-white py-20 md:py-28 overflow-hidden">
  <Image
    src="/images/heroes/homepage.jpg"
    alt="Tampa Bay skyline"
    fill
    className="object-cover"
    unoptimized
    priority
  />
  <div className="absolute inset-0 bg-brand-navy/70" />
  <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
    {/* existing h1, p, and CTA links stay the same */}
  </div>
</section>
```

Add `import Image from 'next/image'` at top.

Also add OG image to the root layout or homepage metadata:
```typescript
// In app/page.tsx, add metadata export:
import { Metadata } from 'next'
export const metadata: Metadata = {
  openGraph: {
    images: [{ url: 'https://tbrelo.com/images/heroes/homepage.jpg', width: 1200, height: 630 }],
  },
}
```

Note: Since `app/page.tsx` currently exports a default function (not metadata), add the metadata export. This overrides the layout's default OG for the homepage.

- [ ] **Step 2: Verify dev server**

```bash
npm run dev
```

Open http://localhost:3000 and verify the hero image shows behind the text.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "Add hero background image to homepage"
```

---

### Task 10: Add thumbnail images to blog index

**Files:**
- Modify: `app/blog/page.tsx`

- [ ] **Step 1: Check current blog index**

Read `app/blog/page.tsx` to see the current layout.

- [ ] **Step 2: Add small thumbnail to each blog card**

Import the image resolver and add a thumbnail to each blog post card in the index.

```tsx
import { getPageImage } from '@/lib/images'
import Image from 'next/image'
```

For each post card, add a small image:
```tsx
<div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden bg-brand-sand">
  <Image
    src={`/images/${getPageImage({ type: 'blog', slug: post.slug })}`}
    alt={post.frontmatter.title}
    fill
    className="object-cover"
    unoptimized
  />
</div>
```

- [ ] **Step 3: Verify build**

```bash
npm run build 2>&1 | tail -20
```

- [ ] **Step 4: Commit**

```bash
git add app/blog/page.tsx
git commit -m "Add thumbnail images to blog index"
```

---

## Chunk 5: Final Verification

### Task 11: Full build and visual verification

- [ ] **Step 1: Run full build**

```bash
npm run build
```

Expected: All 185+ pages build successfully with no errors.

- [ ] **Step 2: Verify locally**

```bash
npx serve out
```

Open http://localhost:3000 and check:
- Homepage hero has background image
- A pillar page (e.g., /moving-to-tampa-bay/) has hero banner
- A county page (e.g., /counties/hillsborough/) has hero banner
- A city page (e.g., /cities/apollo-beach/) inherits county image
- A blog post has hero banner
- A moving-from page has hero banner
- Blog index shows thumbnails

- [ ] **Step 3: Verify OG tags**

View page source on any page, search for `og:image`. Should show full URL to the image.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "Complete image implementation across tbrelo.com"
```
