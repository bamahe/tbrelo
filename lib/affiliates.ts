// ============================================================
// AFFILIATE LINKS — Single source of truth
// ============================================================
// Change a link here → it updates across ALL 190+ pages instantly.
// Usage in markdown: {{adt}}, {{pods}}, {{uhaul}}, etc.
// Usage in components: import { affiliateLinks } from '@/lib/affiliates'
// ============================================================

export const affiliateLinks: Record<string, { url: string; name: string; category: string }> = {
  
  // ── YOUR BUSINESSES (always P1, every page) ──────────────
  nowtb: {
    url: 'https://nowtb.com',
    name: 'The NOW Team — Barrett Henry, REALTOR®',
    category: 'own',
  },
  bbs: {
    url: 'https://bestbayservices.com',
    name: 'Best Bay Services — Handyman & Home Services',
    category: 'own',
  },
  vivipm: {
    url: 'https://vivipm.com',
    name: 'ViVi Property Management',
    category: 'own',
  },
  priorityfunding: {
    url: 'https://priorityfunding.com', // UPDATE with James Rafuse's referral link
    name: 'Priority Funding — Mortgage Lender',
    category: 'own',
  },

  // ── HOME SECURITY ────────────────────────────────────────
  adt: {
    url: 'https://www.adt.com/', // UPDATE with CJ affiliate link
    name: 'ADT Home Security',
    category: 'security',
  },
  simplisafe: {
    url: 'https://www.simplisafe.com/', // UPDATE with Impact affiliate link
    name: 'SimpliSafe',
    category: 'security',
  },

  // ── MOVING ───────────────────────────────────────────────
  pods: {
    url: 'https://www.pods.com/', // UPDATE with CJ affiliate link
    name: 'PODS Moving & Storage',
    category: 'moving',
  },
  uhaul: {
    url: 'https://www.uhaul.com/', // UPDATE with CJ affiliate link
    name: 'U-Haul',
    category: 'moving',
  },
  upack: {
    url: 'https://www.upack.com/', // UPDATE with CJ affiliate link
    name: 'U-Pack / ABF Freight',
    category: 'moving',
  },
  penske: {
    url: 'https://www.pensketruckrental.com/', // UPDATE with CJ affiliate link
    name: 'Penske Truck Rental',
    category: 'moving',
  },

  // ── INSURANCE ────────────────────────────────────────────
  policygenius: {
    url: 'https://www.policygenius.com/', // UPDATE with Impact affiliate link
    name: 'Policygenius',
    category: 'insurance',
  },
  lemonade: {
    url: 'https://www.lemonade.com/', // UPDATE with Impact affiliate link
    name: 'Lemonade Insurance',
    category: 'insurance',
  },
  libertymutual: {
    url: 'https://www.libertymutual.com/', // UPDATE with CJ affiliate link
    name: 'Liberty Mutual',
    category: 'insurance',
  },

  // ── UTILITIES & INTERNET ─────────────────────────────────
  spectrum: {
    url: 'https://www.spectrum.com/', // UPDATE with CJ affiliate link
    name: 'Spectrum Internet',
    category: 'utilities',
  },
  tmobile: {
    url: 'https://www.t-mobile.com/', // UPDATE with Impact affiliate link
    name: 'T-Mobile Home Internet',
    category: 'utilities',
  },

  // ── FINANCE ──────────────────────────────────────────────
  lendingtree: {
    url: 'https://www.lendingtree.com/', // UPDATE with FlexOffers affiliate link
    name: 'LendingTree',
    category: 'finance',
  },
  bankrate: {
    url: 'https://www.bankrate.com/', // UPDATE with CJ affiliate link
    name: 'Bankrate',
    category: 'finance',
  },

  // ── STORAGE ──────────────────────────────────────────────
  publicstorage: {
    url: 'https://www.publicstorage.com/', // UPDATE with CJ affiliate link
    name: 'Public Storage',
    category: 'storage',
  },

  // ── JUNK REMOVAL ────────────────────────────────────────
  gotjunk: {
    url: 'https://www.1800gotjunk.com/', // UPDATE with CJ affiliate link
    name: '1-800-GOT-JUNK?',
    category: 'moving',
  },

  // ── HOME IMPROVEMENT ─────────────────────────────────────
  homedepot: {
    url: 'https://www.homedepot.com/', // UPDATE with Impact affiliate link
    name: 'Home Depot',
    category: 'home',
  },

  // ── AMAZON (catch-all) ───────────────────────────────────
  amazon: {
    url: 'https://www.amazon.com/?tag=tbrelo-20',
    name: 'Amazon',
    category: 'amazon',
  },
}

// Helper: get link by key
export function getAffiliateLink(key: string): string {
  return affiliateLinks[key]?.url || '#'
}

// Helper: get all links by category
export function getAffiliatesByCategory(category: string) {
  return Object.entries(affiliateLinks)
    .filter(([_, v]) => v.category === category)
    .map(([key, v]) => ({ key, ...v }))
}

// Helper: replace {{key}} placeholders in markdown content
export function replaceAffiliateLinks(content: string): string {
  return content.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    const link = affiliateLinks[key]
    if (!link) return match
    return `<a href="${link.url}" target="_blank" rel="noopener noreferrer nofollow" class="affiliate-link">${link.name}</a>`
  })
}
