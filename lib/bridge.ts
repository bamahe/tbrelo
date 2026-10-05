// =============================================================================
// Bridge API client for Stellar MLS market data
// Used by the refresh script to pull live stats for city/county pages.
// Pattern matches nowtb-next/src/lib/bridge.ts — same API, same auth method.
// =============================================================================

// Pull config from environment (.env.local or GitHub Actions secrets)
const BRIDGE_BASE = process.env.BRIDGE_API_BASE || 'https://api.bridgedataoutput.com/api/v2';
const BRIDGE_TOKEN = process.env.BRIDGE_SERVER_TOKEN || '';
const DATASET = process.env.BRIDGE_DATASET || 'stellar';

// Rate limit tracking — 5-minute cooldown on 429
let rateLimitedUntil = 0;

function isRateLimited(): boolean {
  return Date.now() < rateLimitedUntil;
}

function markRateLimited(): void {
  rateLimitedUntil = Date.now() + 5 * 60 * 1000;
  console.warn('[Bridge] Rate limited — pausing for 5 minutes');
}

// ---------------------------------------------------------------------------
// Low-level fetcher with rate limit handling and single retry
// ---------------------------------------------------------------------------

interface BridgeResponse {
  '@odata.count'?: number;
  value?: Record<string, unknown>[];
  [key: string]: unknown;
}

async function bridgeFetch(
  endpoint: string,
  params: Record<string, string> = {}
): Promise<BridgeResponse> {
  if (isRateLimited()) {
    throw new Error('Bridge API rate limited — in cooldown');
  }

  // Build OData URL: base/OData/stellar/Property
  const url = new URL(`${BRIDGE_BASE}/OData/${DATASET}${endpoint}`);
  for (const [k, v] of Object.entries(params)) {
    if (v) url.searchParams.set(k, v);
  }

  const headers = {
    Authorization: `Bearer ${BRIDGE_TOKEN}`,
    Accept: 'application/json',
  };

  let res = await fetch(url.toString(), { headers });

  // Retry once on 429 with 2-second backoff
  if (res.status === 429) {
    await new Promise(r => setTimeout(r, 2000));
    res = await fetch(url.toString(), { headers });
    if (res.status === 429) {
      markRateLimited();
      throw new Error('Bridge API rate limited after retry');
    }
  }

  if (!res.ok) {
    throw new Error(`Bridge API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// ---------------------------------------------------------------------------
// Market stats aggregator
// Queries active listings for a city, computes median price, counts, avg DOM.
// Returns null if the city has no data — NEVER fabricates numbers.
// ---------------------------------------------------------------------------

export interface MarketStats {
  medianPrice: number;
  activeListings: number;
  newListingsThisMonth: number;
  avgDaysOnMarket: number;
}

/**
 * Fetch live market stats for a city from Bridge API.
 * Uses City field in MLS. For unincorporated communities (Brandon, Carrollwood,
 * etc.), the MLS often files them under the county seat — if no results come
 * back, returns null so the caller can skip without fabricating.
 */
export async function getCityMarketStats(
  cityName: string,
): Promise<MarketStats | null> {
  if (!BRIDGE_TOKEN) {
    console.warn('[Bridge] No BRIDGE_SERVER_TOKEN — skipping API call');
    return null;
  }

  try {
    // Query active residential listings for this city
    const mlsCity = cityName.toUpperCase();
    const activeFilter = `City eq '${mlsCity}' and StandardStatus eq 'Active' and PropertyType eq 'Residential'`;

    const activeRes = await bridgeFetch('/Property', {
      '$filter': activeFilter,
      '$select': 'ListPrice,DaysOnMarket',
      '$top': '500',
      '$count': 'true',
    });

    const listings = (activeRes.value || []) as { ListPrice?: number; DaysOnMarket?: number }[];
    const activeCount = listings.length;

    // No data for this city — return null, don't guess
    if (activeCount === 0) return null;

    // Calculate median price from returned listings
    const prices = listings
      .map(l => l.ListPrice)
      .filter((p): p is number => typeof p === 'number' && p > 0)
      .sort((a, b) => a - b);

    if (prices.length === 0) return null;

    const mid = Math.floor(prices.length / 2);
    const medianPrice = prices.length % 2 === 0
      ? Math.round((prices[mid - 1] + prices[mid]) / 2)
      : prices[mid];

    // Average days on market
    const domValues = listings
      .map(l => l.DaysOnMarket)
      .filter((d): d is number => typeof d === 'number' && d >= 0);
    const avgDaysOnMarket = domValues.length > 0
      ? Math.round(domValues.reduce((a, b) => a + b, 0) / domValues.length)
      : 0;

    // New listings this month — query with a date filter
    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const newFilter = `City eq '${mlsCity}' and StandardStatus eq 'Active' and PropertyType eq 'Residential' and ListingContractDate ge ${firstOfMonth}`;

    let newListingsThisMonth = 0;
    try {
      const newRes = await bridgeFetch('/Property', {
        '$filter': newFilter,
        '$top': '1',
        '$count': 'true',
      });
      newListingsThisMonth = (newRes['@odata.count'] as number) || (newRes.value?.length ?? 0);
    } catch {
      // If the new-listings query fails, just use 0 — we still have the other stats
      newListingsThisMonth = 0;
    }

    return {
      medianPrice,
      activeListings: activeCount,
      newListingsThisMonth,
      avgDaysOnMarket,
    };
  } catch (error) {
    console.error(`[Bridge] Failed to fetch stats for ${cityName}:`, error);
    return null;
  }
}

/**
 * Fetch market stats for a county by querying all cities in it.
 * Aggregates across all listings where CountyOrParish matches.
 */
export async function getCountyMarketStats(
  countyName: string,
): Promise<MarketStats | null> {
  if (!BRIDGE_TOKEN) {
    console.warn('[Bridge] No BRIDGE_SERVER_TOKEN — skipping API call');
    return null;
  }

  try {
    const mlsCounty = countyName.toUpperCase();
    const activeFilter = `CountyOrParish eq '${mlsCounty}' and StandardStatus eq 'Active' and PropertyType eq 'Residential'`;

    const activeRes = await bridgeFetch('/Property', {
      '$filter': activeFilter,
      '$select': 'ListPrice,DaysOnMarket',
      '$top': '1000',
      '$count': 'true',
    });

    const listings = (activeRes.value || []) as { ListPrice?: number; DaysOnMarket?: number }[];
    const activeCount = listings.length;

    if (activeCount === 0) return null;

    const prices = listings
      .map(l => l.ListPrice)
      .filter((p): p is number => typeof p === 'number' && p > 0)
      .sort((a, b) => a - b);

    if (prices.length === 0) return null;

    const mid = Math.floor(prices.length / 2);
    const medianPrice = prices.length % 2 === 0
      ? Math.round((prices[mid - 1] + prices[mid]) / 2)
      : prices[mid];

    const domValues = listings
      .map(l => l.DaysOnMarket)
      .filter((d): d is number => typeof d === 'number' && d >= 0);
    const avgDaysOnMarket = domValues.length > 0
      ? Math.round(domValues.reduce((a, b) => a + b, 0) / domValues.length)
      : 0;

    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const newFilter = `CountyOrParish eq '${mlsCounty}' and StandardStatus eq 'Active' and PropertyType eq 'Residential' and ListingContractDate ge ${firstOfMonth}`;

    let newListingsThisMonth = 0;
    try {
      const newRes = await bridgeFetch('/Property', {
        '$filter': newFilter,
        '$top': '1',
        '$count': 'true',
      });
      newListingsThisMonth = (newRes['@odata.count'] as number) || (newRes.value?.length ?? 0);
    } catch {
      newListingsThisMonth = 0;
    }

    return {
      medianPrice,
      activeListings: activeCount,
      newListingsThisMonth,
      avgDaysOnMarket,
    };
  } catch (error) {
    console.error(`[Bridge] Failed to fetch stats for ${countyName} county:`, error);
    return null;
  }
}
