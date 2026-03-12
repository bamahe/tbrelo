// ============================================================
// SITEMAP GENERATOR — Run: npx ts-node scripts/generate-sitemap.ts
// ============================================================
// Generates sitemap.xml from all content files.
// Run this after adding new content, before deploying.
// ============================================================

import fs from 'fs'
import path from 'path'

const SITE_URL = 'https://tbrelo.com'
const contentDir = path.join(process.cwd(), 'content')

function getMarkdownFiles(dir: string, prefix: string = ''): string[] {
  if (!fs.existsSync(dir)) return []
  
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const urls: string[] = []
  
  for (const entry of entries) {
    if (entry.isDirectory()) {
      urls.push(...getMarkdownFiles(path.join(dir, entry.name), `${prefix}${entry.name}/`))
    } else if (entry.name.endsWith('.md')) {
      const slug = entry.name.replace('.md', '')
      urls.push(`${prefix}${slug}/`)
    }
  }
  
  return urls
}

function generateSitemap() {
  const contentUrls = getMarkdownFiles(contentDir)
  
  // Static pages
  const staticUrls = [
    '',
    'moving-to-tampa-bay/',
    'cost-of-living/',
    'moving-checklist/',
    'blog/',
    'counties/',
    'affiliate-disclosure/',
    'privacy-policy/',
    'disclaimer/',
  ]
  
  const allUrls = [...staticUrls, ...contentUrls]
  const today = new Date().toISOString().split('T')[0]
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(url => `  <url>
    <loc>${SITE_URL}/${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${url === '' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${url === '' ? '1.0' : url.includes('counties/') ? '0.8' : '0.7'}</priority>
  </url>`).join('\n')}
</urlset>`

  fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap.xml'), sitemap)
  console.log(`Sitemap generated: ${allUrls.length} URLs`)
}

generateSitemap()
