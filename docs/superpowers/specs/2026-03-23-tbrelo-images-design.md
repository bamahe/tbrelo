# tbrelo.com Image Strategy

## Overview

Add images across the entire tbrelo.com site using a tiered approach: ~35 Unsplash stock photos covering homepage, counties, pillar guides, blog categories, and moving-from pages. Cities inherit county images. OG images auto-generated at build time.

## Image Tiers

### Tier 1 — Unique Images (hand-picked from Unsplash)

| Image | Search Query | File |
|---|---|---|
| Homepage hero | Tampa Bay skyline waterfront | `heroes/homepage.jpg` |
| Hillsborough County | Tampa downtown skyline | `heroes/hillsborough.jpg` |
| Pinellas County | St Petersburg waterfront pier | `heroes/pinellas.jpg` |
| Pasco County | Wesley Chapel Florida suburban | `heroes/pasco.jpg` |
| Polk County | Lakeland Florida lake | `heroes/polk.jpg` |
| Manatee County | Bradenton Florida riverwalk | `heroes/manatee.jpg` |
| Sarasota County | Sarasota Florida bay | `heroes/sarasota.jpg` |
| Citrus County | Crystal River Florida nature | `heroes/citrus.jpg` |
| Hernando County | Weeki Wachee springs Florida | `heroes/hernando.jpg` |
| Moving to Tampa Bay | Tampa Bay bridge sunset | `pillar/moving-to-tampa-bay.jpg` |
| Cost of Living | Florida home neighborhood | `pillar/cost-of-living.jpg` |
| Housing Market | Tampa Bay homes aerial | `pillar/tampa-bay-housing-market.jpg` |
| Investing | Florida rental property | `pillar/investing-tampa-bay.jpg` |
| Homestead Exemption | Florida home with yard | `pillar/florida-homestead-exemption.jpg` |
| Florida Taxes | Florida palm trees residential | `pillar/florida-taxes.jpg` |
| Hurricane Prep | Florida storm clouds | `pillar/hurricane-prep.jpg` |
| Retirees | Florida 55+ community pool | `pillar/retirees-tampa-bay.jpg` |
| Remote Work | Home office Florida | `pillar/remote-work-tampa-bay.jpg` |
| Schools | Florida school campus | `pillar/tampa-bay-schools.jpg` |
| Healthcare | Florida hospital medical | `pillar/tampa-bay-healthcare.jpg` |
| Job Market | Tampa office buildings | `pillar/tampa-bay-job-market.jpg` |
| Neighborhoods | Tampa Bay neighborhood street | `pillar/tampa-bay-neighborhoods.jpg` |
| Beaches | Tampa Bay beach sunset | `pillar/tampa-bay-beaches.jpg` |
| Things to Do | Tampa riverwalk activities | `pillar/tampa-bay-things-to-do.jpg` |
| Outdoor Living | Florida kayaking nature | `pillar/tampa-bay-outdoor-living.jpg` |
| Moving Checklist | Moving boxes packing | `pillar/moving-checklist.jpg` |
| Driver's License | Florida DMV driving | `pillar/florida-drivers-license.jpg` |
| Car Registration | Florida car palm trees | `pillar/florida-car-registration.jpg` |

### Tier 2 — Shared/Fallback Images

| Category | Search Query | File | Used By |
|---|---|---|---|
| Comparison | Tampa Bay aerial neighborhoods | `blog/comparison.jpg` | All vs/comparison blog posts |
| Lifestyle | Florida lifestyle outdoor dining | `blog/lifestyle.jpg` | Lifestyle blog posts |
| Housing | Florida homes for sale | `blog/housing.jpg` | Housing/buying blog posts |
| Finance | Mortgage documents keys | `blog/finance.jpg` | Insurance, finance blog posts |
| Weather | Florida sunshine palm trees | `blog/weather.jpg` | Weather/hurricane blog posts |
| Outdoors | Tampa Bay park nature | `blog/outdoors.jpg` | Outdoors/activities blog posts |
| Moving From | Welcome to Florida sign | `moving-from.jpg` | All 20 moving-from pages |

### Fallback Logic

1. If page frontmatter has `image:` field → use that
2. If city page → use parent county image from `heroes/{county}.jpg`
3. If blog post → map to category image based on content type
4. If moving-from page → use `moving-from.jpg`

## File Structure

```
public/images/
  heroes/
    homepage.jpg
    hillsborough.jpg
    pinellas.jpg
    pasco.jpg
    polk.jpg
    manatee.jpg
    sarasota.jpg
    citrus.jpg
    hernando.jpg
  pillar/
    moving-to-tampa-bay.jpg
    cost-of-living.jpg
    tampa-bay-housing-market.jpg
    investing-tampa-bay.jpg
    florida-homestead-exemption.jpg
    florida-taxes.jpg
    hurricane-prep.jpg
    retirees-tampa-bay.jpg
    remote-work-tampa-bay.jpg
    tampa-bay-schools.jpg
    tampa-bay-healthcare.jpg
    tampa-bay-job-market.jpg
    tampa-bay-neighborhoods.jpg
    tampa-bay-beaches.jpg
    tampa-bay-things-to-do.jpg
    tampa-bay-outdoor-living.jpg
    moving-checklist.jpg
    florida-drivers-license.jpg
    florida-car-registration.jpg
  blog/
    comparison.jpg
    lifestyle.jpg
    housing.jpg
    finance.jpg
    weather.jpg
    outdoors.jpg
  moving-from.jpg
```

**Total: 35 images**

## Implementation

### 1. Image Sourcing Script

Create `scripts/download-images.ts`:
- Uses Unsplash API (free, 50 requests/hour)
- Downloads each image by search query
- Resizes to 1200x630 (optimal for hero + OG)
- Saves to `public/images/` with correct filenames
- Requires `UNSPLASH_ACCESS_KEY` env var

### 2. Frontmatter Changes

Add optional `image` field to markdown frontmatter:
```yaml
image: "pillar/moving-to-tampa-bay.jpg"
```

No changes needed for files using fallback logic.

### 3. Image Resolution Helper (`lib/images.ts`)

New utility that resolves the correct image for any page:
```
getPageImage(type, slug, frontmatter) → string
```
- Checks frontmatter `image` field first
- Falls back based on content type (county hero, blog category, moving-from)
- Returns path relative to `/images/`

### 4. Blog Category Mapping

Map blog posts to image categories based on slug patterns:
- `*-vs-*` → comparison
- `*insurance*`, `*loan*`, `*mortgage*`, `*cost*`, `*tax*` → finance
- `*hurricane*`, `*bug*`, `*weather*` → weather
- `*fishing*`, `*dog-park*`, `*beach*`, `*outdoor*`, `*day-trip*` → outdoors
- `*coffee*`, `*market*`, `*living*`, `*newcomer*` → lifestyle
- Default → housing

### 5. HeroImage Component

New `components/HeroImage.tsx`:
- Full-width banner image with dark overlay for text readability
- Page title overlaid on image
- Uses `next/image` with `unoptimized: true` (static export)
- Responsive: 100vw width, ~300px height on desktop, ~200px mobile

### 6. OG Image Generation

Add `opengraph-image.tsx` to route segments using Next.js ImageResponse:
- Generates 1200x630 OG images at build time
- Uses hero image as background with title text overlay
- Falls back to navy background with white text if no image

### 7. Page Template Updates

Update all page templates (`[slug]/page.tsx`, `blog/[slug]/page.tsx`, etc.):
- Import and render `HeroImage` component
- Add `og:image` metadata via `generateMetadata()`
- Pass resolved image path to both

## Image Optimization

Before committing images:
- Resize to 1200x630 max
- Compress to ~80% JPEG quality
- Target ~50-100KB per image
- Total budget: ~3.5MB for all 35 images

## Unsplash Attribution

Per Unsplash license (free for commercial use, no attribution required but appreciated):
- Add a credits page at `/photo-credits/` listing photographer names + links
- Not legally required but good practice
