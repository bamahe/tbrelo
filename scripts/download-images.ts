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
