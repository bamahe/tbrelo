// ============================================================
// SITEMAP GENERATOR — Run: npx ts-node scripts/generate-sitemap.ts
// ============================================================
// Generates sitemap.xml from all content files.
// Reads updatedAt from frontmatter for lastmod.
// Run this after adding new content, before deploying.
// ============================================================

import fs from 'fs'
import path from 'path'

const SITE_URL = 'https://tbrelo.com'
const contentDir = path.join(process.cwd(), 'content')

// Extract updatedAt from markdown frontmatter
function getUpdatedAt(filePath: string): string {
  const content = fs.readFileSync(filePath, 'utf-8')
  const match = content.match(/updatedAt:\s*["']?([\d-]+)["']?/)
  if (match) return match[1]
  // Fallback to publishedAt
  const pubMatch = content.match(/publishedAt:\s*["']?([\d-]+)["']?/)
  if (pubMatch) return pubMatch[1]
  // Fallback to today
  return new Date().toISOString().split('T')[0]
}

// Get all .md files from a directory (non-recursive)
function getMarkdownSlugs(dir: string): { slug: string; updatedAt: string }[] {
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => ({
      slug: f.replace('.md', ''),
      updatedAt: getUpdatedAt(path.join(dir, f)),
    }))
}

interface SitemapEntry {
  loc: string
  lastmod: string
  changefreq: string
  priority: string
}

function generateSitemap() {
  const entries: SitemapEntry[] = []
  const counts: Record<string, number> = {}
  const today = new Date().toISOString().split('T')[0]

  // --- Static pages ---
  const staticPages = [
    { path: '/', changefreq: 'weekly', priority: '1.0' },
    { path: '/counties/', changefreq: 'monthly', priority: '0.9' },
    { path: '/cities/', changefreq: 'monthly', priority: '0.7' },
    { path: '/blog/', changefreq: 'weekly', priority: '0.6' },
    { path: '/moving-from/', changefreq: 'monthly', priority: '0.7' },
  ]
  for (const page of staticPages) {
    entries.push({
      loc: `${SITE_URL}${page.path}`,
      lastmod: today,
      changefreq: page.changefreq,
      priority: page.priority,
    })
  }
  counts['static'] = staticPages.length

  // --- Counties ---
  const counties = getMarkdownSlugs(path.join(contentDir, 'counties'))
  for (const c of counties) {
    entries.push({
      loc: `${SITE_URL}/counties/${c.slug}/`,
      lastmod: c.updatedAt,
      changefreq: 'monthly',
      priority: '0.9',
    })
  }
  counts['counties'] = counties.length

  // --- Pillar pages ---
  const pillars = getMarkdownSlugs(path.join(contentDir, 'pillar'))
  for (const p of pillars) {
    entries.push({
      loc: `${SITE_URL}/${p.slug}/`,
      lastmod: p.updatedAt,
      changefreq: 'monthly',
      priority: '0.8',
    })
  }
  counts['pillar'] = pillars.length

  // --- Cities ---
  const cities = getMarkdownSlugs(path.join(contentDir, 'cities'))
  for (const c of cities) {
    entries.push({
      loc: `${SITE_URL}/cities/${c.slug}/`,
      lastmod: c.updatedAt,
      changefreq: 'monthly',
      priority: '0.7',
    })
  }
  counts['cities'] = cities.length

  // --- Moving-from pages ---
  const movingFrom = getMarkdownSlugs(path.join(contentDir, 'moving-from'))
  for (const m of movingFrom) {
    entries.push({
      loc: `${SITE_URL}/moving-from/${m.slug}/`,
      lastmod: m.updatedAt,
      changefreq: 'monthly',
      priority: '0.6',
    })
  }
  counts['moving-from'] = movingFrom.length

  // --- Blog posts ---
  const blogs = getMarkdownSlugs(path.join(contentDir, 'blog'))
  for (const b of blogs) {
    entries.push({
      loc: `${SITE_URL}/blog/${b.slug}/`,
      lastmod: b.updatedAt,
      changefreq: 'weekly',
      priority: '0.6',
    })
  }
  counts['blog'] = blogs.length

  // --- Static content pages (about, privacy, etc.) ---
  const pages = getMarkdownSlugs(path.join(contentDir, 'pages'))
  for (const p of pages) {
    entries.push({
      loc: `${SITE_URL}/${p.slug}/`,
      lastmod: p.updatedAt,
      changefreq: 'yearly',
      priority: '0.4',
    })
  }
  counts['pages'] = pages.length

  // --- Build XML ---
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (e) => `  <url>
    <loc>${e.loc}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

  fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap.xml'), sitemap)

  // --- Report ---
  console.log('\n=== SITEMAP GENERATED ===')
  console.log(`Total URLs: ${entries.length}`)
  console.log('\nBreakdown by content type:')
  for (const [type, count] of Object.entries(counts)) {
    console.log(`  ${type.padEnd(15)} ${count}`)
  }
  console.log(`\nWritten to: public/sitemap.xml`)
}

generateSitemap()
