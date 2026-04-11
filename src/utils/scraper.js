import { getCachedScrape, setCachedScrape } from './imageCache';

/**
 * URL of the deployed Cloudflare Worker CORS proxy.
 * Replace with your actual worker URL after deployment (see cloudflare-worker/README.md).
 * While this remains the placeholder, the scraper falls back to Microlink only.
 */
const WORKER_URL = 'https://bold-dew-aebe.dexterelmzn.workers.dev';

function is_worker_configured() {
  return !WORKER_URL.includes('YOUR_WORKER');
}

// ---------------------------------------------------------------------------
// Worker fetch
// ---------------------------------------------------------------------------

async function fetch_via_worker(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12_000);
  try {
    const res = await fetch(
      `${WORKER_URL}?url=${encodeURIComponent(url)}`,
      { signal: controller.signal }
    );
    clearTimeout(timer);
    if (!res.ok) return null;
    return await res.text();
  } catch {
    clearTimeout(timer);
    return null;
  }
}

// ---------------------------------------------------------------------------
// HTML parsing helpers
// ---------------------------------------------------------------------------

function meta_content(doc, ...selectors) {
  for (const sel of selectors) {
    const val = doc.querySelector(sel)?.content?.trim();
    if (val) return val;
  }
  return '';
}

/**
 * Finds the first Product (or WebPage) JSON-LD block in the document.
 * Handles: bare object, array of objects, @graph pattern.
 */
function extract_jsonld_product(doc) {
  for (const script of doc.querySelectorAll('script[type="application/ld+json"]')) {
    try {
      const data = JSON.parse(script.textContent);
      const nodes = Array.isArray(data)
        ? data
        : data['@graph']
        ? data['@graph']
        : [data];
      const product = nodes.find(
        n => n['@type'] === 'Product' || n['@type'] === 'product'
      );
      if (product) return product;
    } catch {
      // malformed JSON-LD — skip
    }
  }
  return null;
}

function resolve_image(raw) {
  if (!raw) return '';
  if (typeof raw === 'string') return raw;
  // ImageObject or array thereof
  if (Array.isArray(raw)) {
    const first = raw[0];
    return typeof first === 'string' ? first : first?.url || '';
  }
  return raw.url || '';
}

// ---------------------------------------------------------------------------
// Price extraction helpers
// ---------------------------------------------------------------------------

/**
 * Matches e-commerce price formats (currency before or after):
 *   €29.99  € 29,99  29,99 €  29.99€  $1,299.99  1 299,99 €  1.299,99€  £29.99
 * Capture group 1 = currency-before, group 2 = currency-after.
 */
const PRICE_RE = /(?:[€$£]\s*((?:\d{1,3}(?:[\s.]\d{3})*|\d+)(?:[,.]\d{2})?)|((?:\d{1,3}(?:[\s.]\d{3})*|\d+)(?:[,.]\d{2})?)\s*[€$£])/;

/**
 * Normalises a raw price string to a dot-decimal number string.
 *   "29,99"      → "29.99"
 *   "1.299,99"   → "1299.99"
 *   "1,299.99"   → "1299.99"
 *   "1 299,99"   → "1299.99"
 *   "29.99"      → "29.99"
 */
function normalize_price(raw) {
  let s = String(raw).replace(/\s/g, '');
  if (/,\d{2}$/.test(s)) {
    // Comma is decimal separator (FR/EU format): strip dot-thousands then swap comma
    s = s.replace(/\./g, '').replace(',', '.');
  } else if (/\.\d{2}$/.test(s)) {
    // Dot is decimal separator (US/UK format): strip comma-thousands
    s = s.replace(/,/g, '');
  }
  return s;
}

/** Applies PRICE_RE to a string and returns a normalised price, or ''. */
function parse_price_string(text) {
  if (!text) return '';
  const m = text.match(PRICE_RE);
  if (!m) return '';
  return normalize_price((m[1] ?? m[2]).trim());
}

/**
 * Extracts the product price from a parsed document using a priority chain:
 *   1. JSON-LD offers.price (array or object)
 *   2. JSON-LD priceRange
 *   3. Meta og:price:amount / product:price:amount
 *   4. DOM elements whose class or id contains "price" / "prix"
 *   5. Full body text regex (last resort)
 */
function extract_price(doc, ld) {
  // 1. JSON-LD offers.price
  const raw_offers = ld?.offers;
  const offer = Array.isArray(raw_offers) ? raw_offers[0] : raw_offers;
  if (offer?.price != null && String(offer.price).trim() !== '') {
    return normalize_price(String(offer.price));
  }

  // 2. JSON-LD priceRange (e.g. "29,99 €" or "29.99 - 49.99 €")
  if (ld?.priceRange) {
    const p = parse_price_string(ld.priceRange);
    if (p) return p;
  }

  // 3. Meta tags
  const meta_price = meta_content(
    doc,
    'meta[property="og:price:amount"]',
    'meta[property="product:price:amount"]'
  );
  if (meta_price) return normalize_price(meta_price);

  // 4. DOM elements with price-related class or id (high-signal, short text)
  const price_els = doc.querySelectorAll(
    '[class*="price"],[class*="prix"],[id*="price"],[id*="prix"]'
  );
  for (const el of price_els) {
    const p = parse_price_string(el.textContent?.trim());
    if (p) return p;
  }

  // 5. Full body text (last resort — noisier but catches anything missed above)
  return parse_price_string(doc.body?.textContent || '');
}

function parse_product_info(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const ld = extract_jsonld_product(doc);

  // --- Title ---
  const title =
    ld?.name?.trim() ||
    meta_content(doc, 'meta[property="og:title"]', 'meta[name="og:title"]') ||
    doc.querySelector('title')?.textContent?.trim() ||
    '';

  // --- Image ---
  const imageUrl =
    resolve_image(ld?.image) ||
    meta_content(doc, 'meta[property="og:image"]', 'meta[name="og:image"]');

  // --- Description ---
  const description =
    ld?.description?.trim() ||
    meta_content(
      doc,
      'meta[property="og:description"]',
      'meta[name="og:description"]',
      'meta[name="description"]'
    );

  // --- Price ---
  const price = extract_price(doc, ld);

  return { title, imageUrl, description, price };
}

// ---------------------------------------------------------------------------
// Microlink fallback
// ---------------------------------------------------------------------------

async function fetch_via_microlink(url) {
  try {
    const res = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`);
    const data = await res.json();
    return {
      title: data?.data?.title?.trim() || '',
      imageUrl: data?.data?.image?.url || '',
      description: data?.data?.description?.trim() || '',
      price: '',
    };
  } catch {
    return { title: '', imageUrl: '', description: '', price: '' };
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Scrapes product metadata from a URL.
 *
 * Strategy:
 *   1. Check localStorage cache (TTL 7 days) — unless force=true
 *   2. If worker is configured: fetch HTML via worker → parse JSON-LD + meta tags
 *   3. If any key field is still missing: supplement via Microlink
 *   4. Store result in cache (only if at least title or imageUrl was found)
 *
 * @param {string} url
 * @param {{ force?: boolean }} options  force=true bypasses cache (used by the 🔍 button)
 * @returns {Promise<{ title: string, imageUrl: string, description: string, price: string }>}
 */
export async function scrapeProductInfo(url, { force = false } = {}) {
  if (!url) return { title: '', imageUrl: '', description: '', price: '' };

  if (!force) {
    const cached = getCachedScrape(url);
    if (cached) return cached;
  }

  let result = { title: '', imageUrl: '', description: '', price: '' };

  if (is_worker_configured()) {
    const html = await fetch_via_worker(url);
    if (html) result = parse_product_info(html);
  }

  // Supplement missing fields via Microlink (also serves as sole source when worker not configured)
  if (!result.title || !result.imageUrl) {
    const ml = await fetch_via_microlink(url);
    result = {
      title: result.title || ml.title,
      imageUrl: result.imageUrl || ml.imageUrl,
      description: result.description || ml.description,
      price: result.price || ml.price,
    };
  }

  setCachedScrape(url, result);
  return result;
}
