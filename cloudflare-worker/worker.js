/**
 * Cloudflare Worker — CORS proxy for product page scraping
 *
 * Fetches the target URL with a realistic User-Agent and returns
 * the raw HTML with permissive CORS headers so the browser app
 * can parse it with DOMParser.
 *
 * Deploy: see README.md
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const FETCH_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
  'Cache-Control': 'no-cache',
};

function corsResponse(body, status = 200, extra = {}) {
  return new Response(body, {
    status,
    headers: { ...CORS_HEADERS, ...extra },
  });
}

export default {
  async fetch(request) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const { searchParams } = new URL(request.url);
    const targetRaw = searchParams.get('url');

    if (!targetRaw) {
      return corsResponse('Missing ?url= parameter', 400);
    }

    // Validate URL — only allow http(s)
    let targetUrl;
    try {
      targetUrl = new URL(targetRaw);
      if (targetUrl.protocol !== 'http:' && targetUrl.protocol !== 'https:') {
        throw new Error('Invalid protocol');
      }
    } catch {
      return corsResponse('Invalid URL', 400);
    }

    // Fetch with 10 s timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

    try {
      const res = await fetch(targetUrl.toString(), {
        signal: controller.signal,
        headers: FETCH_HEADERS,
        redirect: 'follow',
      });
      clearTimeout(timeout);

      const html = await res.text();

      return corsResponse(html, 200, { 'Content-Type': 'text/html; charset=utf-8' });
    } catch (err) {
      clearTimeout(timeout);
      const isTimeout = err.name === 'AbortError';
      return corsResponse(
        isTimeout ? 'Gateway Timeout' : 'Bad Gateway',
        isTimeout ? 504 : 502
      );
    }
  },
};
