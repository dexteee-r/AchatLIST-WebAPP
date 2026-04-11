const CACHE_KEY = 'imageCache_v1';
const SCRAPER_CACHE_KEY = 'scraperCache_v1';
const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function load() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
  } catch {
    return {};
  }
}

function save(cache) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // localStorage quota exceeded — skip silently
  }
}

/**
 * Returns the cached imageUrl for a given product URL, or null if missing/expired.
 * Empty strings are NOT cached, so a URL with no image can always be retried.
 */
export function getCachedImage(url) {
  const cache = load();
  const entry = cache[url];
  if (!entry) return null;
  if (Date.now() - entry.timestamp > TTL_MS) {
    delete cache[url];
    save(cache);
    return null;
  }
  return entry.imageUrl;
}

/**
 * Stores a non-empty imageUrl in the cache against its product URL.
 * Ignores empty strings — those are not worth caching.
 */
export function setCachedImage(url, imageUrl) {
  if (!imageUrl) return;
  const cache = load();
  cache[url] = { imageUrl, timestamp: Date.now() };
  save(cache);
}

// ---------------------------------------------------------------------------
// Scraper cache — stores full product info { title, imageUrl, description, price }
// ---------------------------------------------------------------------------

function load_scraper() {
  try {
    return JSON.parse(localStorage.getItem(SCRAPER_CACHE_KEY) || '{}');
  } catch {
    return {};
  }
}

function save_scraper(cache) {
  try {
    localStorage.setItem(SCRAPER_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // localStorage quota exceeded — skip silently
  }
}

/**
 * Returns the cached scrape result for a URL, or null if missing/expired.
 * Only entries that have at least title or imageUrl are stored, so null
 * means a genuine miss — safe to retry.
 */
export function getCachedScrape(url) {
  const cache = load_scraper();
  const entry = cache[url];
  if (!entry) return null;
  if (Date.now() - entry.timestamp > TTL_MS) {
    delete cache[url];
    save_scraper(cache);
    return null;
  }
  const { timestamp: _ts, ...data } = entry;
  return data;
}

/**
 * Stores a scrape result. Skipped if both title and imageUrl are empty
 * (complete failure — allow retry next time).
 */
export function setCachedScrape(url, { title, imageUrl, description, price }) {
  if (!title && !imageUrl) return;
  const cache = load_scraper();
  cache[url] = { title, imageUrl, description, price, timestamp: Date.now() };
  save_scraper(cache);
}
