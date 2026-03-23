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
  ['heroes/homepage.jpg', 'Tampa skyline sunset'],
  ['heroes/hillsborough.jpg', 'Tampa Florida downtown skyline'],
  ['heroes/pinellas.jpg', 'St Petersburg Florida waterfront'],
  ['heroes/pasco.jpg', 'Wesley Chapel Florida suburban neighborhood'],
  ['heroes/polk.jpg', 'Lakeland Florida lake swan'],
  ['heroes/manatee.jpg', 'Bradenton Florida beach'],
  ['heroes/sarasota.jpg', 'Sarasota Florida bay sunset'],
  ['heroes/citrus.jpg', 'Crystal River Florida nature springs'],
  ['heroes/hernando.jpg', 'Florida natural springs clear water'],

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
  ['pillar/tampa-bay-healthcare.jpg', 'Florida hospital healthcare'],
  ['pillar/tampa-bay-job-market.jpg', 'Tampa office buildings business district'],
  ['pillar/tampa-bay-neighborhoods.jpg', 'Florida neighborhood street trees'],
  ['pillar/tampa-bay-beaches.jpg', 'Florida beach sunset ocean'],
  ['pillar/tampa-bay-things-to-do.jpg', 'Tampa downtown waterfront activities'],
  ['pillar/tampa-bay-outdoor-living.jpg', 'Florida kayaking nature outdoor'],
  ['pillar/moving-checklist.jpg', 'moving boxes packing home'],
  ['pillar/florida-drivers-license.jpg', 'Florida road driving palm trees'],
  ['pillar/florida-car-registration.jpg', 'car parked Florida palm trees'],

  // Blog categories (shared fallback)
  ['blog/comparison.jpg', 'Tampa Bay aerial neighborhoods houses'],
  ['blog/lifestyle.jpg', 'Florida restaurant patio dining'],
  ['blog/housing.jpg', 'Florida homes for sale residential'],
  ['blog/finance.jpg', 'mortgage documents house keys'],
  ['blog/weather.jpg', 'Florida sunshine palm trees blue sky'],
  ['blog/outdoors.jpg', 'Florida nature hiking trail park'],

  // Blog posts (unique per post)
  ['blog/apollo-beach-vs-ruskin.jpg', 'Florida waterfront homes canal'],
  ['blog/brandon-vs-riverview.jpg', 'Florida suburban neighborhood street'],
  ['blog/clearwater-vs-dunedin.jpg', 'Clearwater Beach Florida pier'],
  ['blog/crystal-river-vs-homosassa.jpg', 'Florida springs clear water nature'],
  ['blog/lakeland-vs-winter-haven.jpg', 'Florida lake downtown small city'],
  ['blog/lakewood-ranch-vs-wesley-chapel.jpg', 'Florida master planned community'],
  ['blog/new-construction-vs-resale-tampa-bay.jpg', 'new home construction Florida'],
  ['blog/new-tampa-vs-wesley-chapel.jpg', 'Florida master planned community pool'],
  ['blog/sarasota-vs-bradenton.jpg', 'Sarasota bay sunset'],
  ['blog/seminole-heights-vs-ybor-city.jpg', 'historic district colorful buildings Tampa'],
  ['blog/siesta-key-vs-anna-maria.jpg', 'white sand beach turquoise water Florida'],
  ['blog/south-tampa-vs-st-pete.jpg', 'Tampa Bay waterfront boulevard palm'],
  ['blog/spring-hill-vs-brooksville.jpg', 'Florida rural countryside homes'],
  ['blog/st-pete-vs-tampa.jpg', 'St Petersburg Florida mural arts'],
  ['blog/tampa-bay-vs-miami.jpg', 'Florida cityscape comparison skyline'],
  ['blog/tampa-bay-vs-orlando.jpg', 'Orlando skyline lake Florida'],
  ['blog/valrico-vs-fishhawk.jpg', 'Florida family neighborhood park'],
  ['blog/wesley-chapel-vs-land-o-lakes.jpg', 'Florida shopping plaza new'],
  ['blog/florida-homeowners-insurance-guide.jpg', 'house roof storm damage insurance'],
  ['blog/best-55-plus-communities-tampa-bay.jpg', 'retirement community pool active adults'],
  ['blog/best-neighborhoods-young-professionals-tampa.jpg', 'urban nightlife restaurant district'],
  ['blog/florida-drivers-license.jpg', 'car keys drivers license document'],
  ['blog/florida-no-car-inspection.jpg', 'car driving Florida highway'],
  ['blog/how-to-save-money-moving-to-florida.jpg', 'piggy bank savings money'],
  ['blog/is-tampa-bay-worth-moving-to.jpg', 'beautiful Florida aerial coast'],
  ['blog/spring-training-baseball-tampa-bay.jpg', 'baseball stadium spring training'],
  ['blog/best-things-about-living-in-florida.jpg', 'Florida sunset palm trees beautiful'],
  ['blog/florida-things-newcomers-should-know.jpg', 'Florida welcome sign palm road'],
  ['blog/tampa-bay-coffee-guide.jpg', 'coffee latte art cafe shop'],
  ['blog/tampa-bay-farmers-markets-guide.jpg', 'outdoor farmers market produce'],
  ['blog/worst-things-about-living-in-florida.jpg', 'Florida summer heat humidity'],
  ['blog/best-day-trips-from-tampa-bay.jpg', 'scenic road trip Florida coast'],
  ['blog/best-dog-parks-tampa-bay.jpg', 'dogs playing park happy'],
  ['blog/best-fishing-spots-tampa-bay.jpg', 'fishing boat pier sunset'],
  ['blog/first-hurricane-season-what-to-expect.jpg', 'storm clouds dramatic sky hurricane'],
  ['blog/florida-bugs-survival-guide.jpg', 'tropical garden plants Florida'],

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

  const res = await fetch(searchUrl)
  // Handle rate limiting — wait 60s and retry
  if (res.status === 429) {
    console.log('RATE LIMITED — waiting 60s...')
    await new Promise(r => setTimeout(r, 60000))
    return downloadImage(filename, query)
  }
  const searchResult: any = await res.json()

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
