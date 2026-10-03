#!/usr/bin/env node

// =============================================================================
// MARKET DATA REFRESH SCRIPT
// =============================================================================
// Rotates through city + county pages, pulls live stats from Bridge API
// (Stellar MLS), updates the markdown files, and regenerates the sitemap.
//
// Usage:
//   BRIDGE_SERVER_TOKEN=xxx node scripts/refresh-market-data.mjs
//   (or set env vars in .env.local / GitHub Actions secrets)
//
// Rotation: picks BATCH_SIZE pages per run from a cursor file so all ~102
// pages cycle roughly once per month at 5/day.
//
// ANTI-HALLUCINATION: if Bridge returns no data for a city, that city is
// SKIPPED — numbers are NEVER fabricated.
// =============================================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content');
const CURSOR_FILE = path.join(__dirname, '.refresh-cursor.json');

// How many pages to refresh per run
const BATCH_SIZE = 5;

// ---------------------------------------------------------------------------
// Bridge API client (inline — this runs standalone, not in Next.js)
// ---------------------------------------------------------------------------

const BRIDGE_BASE = process.env.BRIDGE_API_BASE || 'https://api.bridgedataoutput.com/api/v2';
const BRIDGE_TOKEN = process.env.BRIDGE_SERVER_TOKEN || '';
const DATASET = process.env.BRIDGE_DATASET || 'stellar';

if (!BRIDGE_TOKEN) {
  console.error('ERROR: BRIDGE_SERVER_TOKEN is not set. Cannot fetch market data.');
  process.exit(1);
}

// Rate limit tracking
let rateLimitedUntil = 0;

async function bridgeFetch(endpoint, params = {}) {
  if (Date.now() < rateLimitedUntil) {
    throw new Error('Bridge API rate limited — in cooldown');
  }

  const url = new URL(`${BRIDGE_BASE}/OData/${DATASET}${endpoint}`);
  for (const [k, v] of Object.entries(params)) {
    if (v) url.searchParams.set(k, v);
  }

  let res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${BRIDGE_TOKEN}`,
      Accept: 'application/json',
    },
  });

  // Retry once on 429
  if (res.status === 429) {
    await new Promise(r => setTimeout(r, 2000));
    res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${BRIDGE_TOKEN}`,
        Accept: 'application/json',
      },
    });
    if (res.status === 429) {
      rateLimitedUntil = Date.now() + 5 * 60 * 1000;
      throw new Error('Bridge API rate limited after retry');
    }
  }

  if (!res.ok) {
    throw new Error(`Bridge API ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

// ---------------------------------------------------------------------------
// Fetch market stats for a location
// ---------------------------------------------------------------------------

async function fetchStats(filterField, filterValue) {
  const mlsValue = filterValue.toUpperCase();
  const activeFilter = `${filterField} eq '${mlsValue}' and StandardStatus eq 'Active' and PropertyType eq 'Residential'`;

  const activeRes = await bridgeFetch('/Property', {
    '$filter': activeFilter,
    '$select': 'ListPrice,DaysOnMarket',
    '$top': filterField === 'CountyOrParish' ? '1000' : '500',
    '$count': 'true',
  });

  const listings = activeRes.value || [];
  if (listings.length === 0) return null;

  // Median price
  const prices = listings
    .map(l => l.ListPrice)
    .filter(p => typeof p === 'number' && p > 0)
    .sort((a, b) => a - b);

  if (prices.length === 0) return null;

  const mid = Math.floor(prices.length / 2);
  const medianPrice = prices.length % 2 === 0
    ? Math.round((prices[mid - 1] + prices[mid]) / 2)
    : prices[mid];

  // Avg days on market
  const domValues = listings
    .map(l => l.DaysOnMarket)
    .filter(d => typeof d === 'number' && d >= 0);
  const avgDaysOnMarket = domValues.length > 0
    ? Math.round(domValues.reduce((a, b) => a + b, 0) / domValues.length)
    : 0;

  // New listings this month
  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const newFilter = `${filterField} eq '${mlsValue}' and StandardStatus eq 'Active' and PropertyType eq 'Residential' and ListingContractDate ge ${firstOfMonth}`;

  let newListingsThisMonth = 0;
  try {
    const newRes = await bridgeFetch('/Property', {
      '$filter': newFilter,
      '$top': '1',
      '$count': 'true',
    });
    newListingsThisMonth = newRes['@odata.count'] || newRes.value?.length || 0;
  } catch {
    // Non-critical — keep other stats
  }

  return {
    medianPrice,
    activeListings: listings.length,
    newListingsThisMonth,
    avgDaysOnMarket,
  };
}

// ---------------------------------------------------------------------------
// Markdown update helpers
// ---------------------------------------------------------------------------

const MARKET_START = '<!-- MARKET_DATA_START -->';
const MARKET_END = '<!-- MARKET_DATA_END -->';

// Format price: 450000 → "$450,000"
function formatPrice(n) {
  return '$' + n.toLocaleString('en-US');
}

// Get month name like "June 2026"
function currentMonthYear() {
  return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

// Build the market data markdown block
function buildMarketBlock(stats, locationName) {
  return `${MARKET_START}
## Current Market Snapshot

| Metric | Value |
|--------|-------|
| **Median Home Price** | ${formatPrice(stats.medianPrice)} |
| **Active Listings** | ${stats.activeListings} |
| **New Listings This Month** | ${stats.newListingsThisMonth} |
| **Avg Days on Market** | ${stats.avgDaysOnMarket} |

*Market data from Stellar MLS for ${locationName}, updated ${currentMonthYear()}. Contact Barrett Henry for the latest.*
${MARKET_END}`;
}

// Update a markdown file with new market data + bump updatedAt
function updateMarkdownFile(filePath, stats, locationName) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const today = new Date().toISOString().split('T')[0];
  const block = buildMarketBlock(stats, locationName);

  // Replace existing market block, or insert after first ## section
  if (content.includes(MARKET_START)) {
    // Replace existing block
    const regex = new RegExp(
      MARKET_START.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') +
      '[\\s\\S]*?' +
      MARKET_END.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      ''
    );
    content = content.replace(regex, block);
  } else {
    // Insert after the first ## section (after the intro paragraph)
    // Find second ## heading and insert before it
    const secondH2 = content.indexOf('\n## ', content.indexOf('\n## ') + 1);
    if (secondH2 !== -1) {
      content = content.slice(0, secondH2) + '\n\n' + block + '\n' + content.slice(secondH2);
    } else {
      // Fallback: append before FAQ section or at end
      const faqPos = content.search(/\n## (?:FAQ|Frequently Asked)/i);
      if (faqPos !== -1) {
        content = content.slice(0, faqPos) + '\n\n' + block + '\n' + content.slice(faqPos);
      } else {
        content += '\n\n' + block + '\n';
      }
    }
  }

  // Bump updatedAt in frontmatter
  content = content.replace(
    /updatedAt:\s*["']?[\d-]+["']?/,
    `updatedAt: "${today}"`
  );

  fs.writeFileSync(filePath, content, 'utf-8');
}

// ---------------------------------------------------------------------------
// Rotation cursor — tracks which pages we've refreshed
// ---------------------------------------------------------------------------

function loadCursor() {
  try {
    return JSON.parse(fs.readFileSync(CURSOR_FILE, 'utf-8'));
  } catch {
    return { index: 0, lastRun: null };
  }
}

function saveCursor(cursor) {
  fs.writeFileSync(CURSOR_FILE, JSON.stringify(cursor, null, 2), 'utf-8');
}

// ---------------------------------------------------------------------------
// Build the full page list (cities + counties)
// ---------------------------------------------------------------------------

function buildPageList() {
  const cityMap = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'city-zip-map.json'), 'utf-8')
  );

  const pages = [];

  // Cities
  const cityDir = path.join(CONTENT_DIR, 'cities');
  const citySlugs = fs.readdirSync(cityDir).filter(f => f.endsWith('.md')).map(f => f.replace('.md', ''));

  for (const slug of citySlugs) {
    const mapping = cityMap[slug];
    if (!mapping) {
      // No mapping — skip (shouldn't happen, but safe)
      continue;
    }
    pages.push({
      slug,
      type: 'city',
      filePath: path.join(cityDir, `${slug}.md`),
      mlsCity: mapping.mlsCity,
      county: mapping.county,
      displayName: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    });
  }

  // Counties
  const countyDir = path.join(CONTENT_DIR, 'counties');
  const countySlugs = fs.readdirSync(countyDir).filter(f => f.endsWith('.md')).map(f => f.replace('.md', ''));

  for (const slug of countySlugs) {
    const displayName = slug.charAt(0).toUpperCase() + slug.slice(1);
    pages.push({
      slug,
      type: 'county',
      filePath: path.join(countyDir, `${slug}.md`),
      mlsCity: null,
      county: displayName,
      displayName: `${displayName} County`,
    });
  }

  return pages;
}

// ---------------------------------------------------------------------------
// Sitemap regeneration (simplified version of generate-sitemap.ts)
// ---------------------------------------------------------------------------

function regenerateSitemap() {
  const SITE_URL = 'https://tbrelo.com';
  const entries = [];
  const today = new Date().toISOString().split('T')[0];

  // Helper: read updatedAt from frontmatter
  function getUpdatedAt(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const match = content.match(/updatedAt:\s*["']?([\d-]+)["']?/);
    if (match) return match[1];
    const pubMatch = content.match(/publishedAt:\s*["']?([\d-]+)["']?/);
    if (pubMatch) return pubMatch[1];
    return today;
  }

  // Helper: get markdown slugs from a directory
  function getSlugs(dir) {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir).filter(f => f.endsWith('.md')).map(f => ({
      slug: f.replace('.md', ''),
      updatedAt: getUpdatedAt(path.join(dir, f)),
    }));
  }

  // Static pages
  const staticPages = [
    { path: '/', changefreq: 'weekly', priority: '1.0' },
    { path: '/counties/', changefreq: 'monthly', priority: '0.9' },
    { path: '/cities/', changefreq: 'monthly', priority: '0.7' },
    { path: '/blog/', changefreq: 'weekly', priority: '0.6' },
    { path: '/moving-from/', changefreq: 'monthly', priority: '0.7' },
  ];
  for (const p of staticPages) {
    entries.push({ loc: `${SITE_URL}${p.path}`, lastmod: today, changefreq: p.changefreq, priority: p.priority });
  }

  // Content types
  const types = [
    { dir: 'counties', prefix: '/counties/', changefreq: 'monthly', priority: '0.9' },
    { dir: 'pillar', prefix: '/', changefreq: 'monthly', priority: '0.8' },
    { dir: 'cities', prefix: '/cities/', changefreq: 'monthly', priority: '0.7' },
    { dir: 'moving-from', prefix: '/moving-from/', changefreq: 'monthly', priority: '0.6' },
    { dir: 'blog', prefix: '/blog/', changefreq: 'weekly', priority: '0.6' },
    { dir: 'pages', prefix: '/', changefreq: 'yearly', priority: '0.4' },
  ];

  for (const t of types) {
    for (const s of getSlugs(path.join(CONTENT_DIR, t.dir))) {
      entries.push({
        loc: `${SITE_URL}${t.prefix}${s.slug}/`,
        lastmod: s.updatedAt,
        changefreq: t.changefreq,
        priority: t.priority,
      });
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(e => `  <url>
    <loc>${e.loc}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(ROOT, 'public', 'sitemap.xml'), xml);
  console.log(`Sitemap regenerated: ${entries.length} URLs`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('=== TBRELO MARKET DATA REFRESH ===');
  console.log(`Date: ${new Date().toISOString()}`);
  console.log(`Bridge API: ${BRIDGE_BASE}`);
  console.log(`Dataset: ${DATASET}`);
  console.log('');

  const pages = buildPageList();
  const cursor = loadCursor();

  // Pick the next BATCH_SIZE pages from the rotation
  const startIdx = cursor.index % pages.length;
  const batch = [];
  for (let i = 0; i < BATCH_SIZE; i++) {
    batch.push(pages[(startIdx + i) % pages.length]);
  }

  console.log(`Rotation: starting at index ${startIdx} of ${pages.length} pages`);
  console.log(`Batch: ${batch.map(p => p.slug).join(', ')}`);
  console.log('');

  // Results table
  const results = [];

  for (const page of batch) {
    console.log(`Fetching: ${page.displayName} (${page.type})...`);

    try {
      let stats;
      if (page.type === 'county') {
        // County: query by CountyOrParish
        stats = await fetchStats('CountyOrParish', page.county);
      } else {
        // City: query by City using MLS city name
        stats = await fetchStats('City', page.mlsCity);
      }

      if (!stats) {
        console.log(`  SKIPPED — no data returned from MLS`);
        results.push({
          page: page.displayName,
          type: page.type,
          status: 'SKIPPED',
          reason: 'No MLS data',
          median: '-',
          active: '-',
          new: '-',
          dom: '-',
        });
        continue;
      }

      // Update the markdown file
      updateMarkdownFile(page.filePath, stats, page.displayName);

      console.log(`  Updated: median ${formatPrice(stats.medianPrice)}, ${stats.activeListings} active, ${stats.avgDaysOnMarket} DOM`);
      results.push({
        page: page.displayName,
        type: page.type,
        status: 'UPDATED',
        reason: '',
        median: formatPrice(stats.medianPrice),
        active: String(stats.activeListings),
        new: String(stats.newListingsThisMonth),
        dom: String(stats.avgDaysOnMarket),
      });

      // Small delay between API calls to be nice to Bridge
      await new Promise(r => setTimeout(r, 1000));

    } catch (error) {
      console.error(`  ERROR: ${error.message}`);
      results.push({
        page: page.displayName,
        type: page.type,
        status: 'ERROR',
        reason: error.message,
        median: '-',
        active: '-',
        new: '-',
        dom: '-',
      });
    }
  }

  // Update cursor for next run
  saveCursor({
    index: (startIdx + BATCH_SIZE) % pages.length,
    lastRun: new Date().toISOString(),
    lastBatch: batch.map(p => p.slug),
  });

  // Regenerate sitemap with updated dates
  console.log('\nRegenerating sitemap...');
  regenerateSitemap();

  // Print summary table
  console.log('\n=== REFRESH SUMMARY ===');
  console.log('');
  console.log('| Page | Type | Status | Median | Active | New | DOM |');
  console.log('|------|------|--------|--------|--------|-----|-----|');
  for (const r of results) {
    console.log(`| ${r.page} | ${r.type} | ${r.status} | ${r.median} | ${r.active} | ${r.new} | ${r.dom} |`);
  }

  const updated = results.filter(r => r.status === 'UPDATED').length;
  const skipped = results.filter(r => r.status === 'SKIPPED').length;
  const errors = results.filter(r => r.status === 'ERROR').length;
  console.log('');
  console.log(`Done: ${updated} updated, ${skipped} skipped, ${errors} errors`);

  // Exit with error code if everything failed
  if (updated === 0 && errors > 0) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
