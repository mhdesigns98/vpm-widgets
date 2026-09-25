/**
 * PBS Media Manager episode proxy — Cloudflare Pages Function.
 *
 * Folded in from the standalone pbs-api Worker: this had no state (no D1/KV),
 * exists only to be called by the playlist widgets in this repo, and doesn't
 * need its own project, subdomain, or secret set. See pbs-api/README.md in
 * the old location for the Worker version this replaces.
 *
 * Proxies PBS Media Manager API v1 with server-side auth and 1-hour caching.
 * PBS Media Manager uses HTTP Basic Auth (RFC 2617): Authorization: Basic base64(key:secret)
 *
 * Secrets required (set via `wrangler pages secret put <NAME> --project-name=vpm-widgets`):
 *   PBS_API_KEY    — the "key" half of the credential pair
 *   PBS_API_SECRET — the "secret" half of the credential pair
 *
 * Route: GET /api/pbs-episodes?show-id=<id>&page-size=<n>
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const PBS_BASE = 'https://media.services.pbs.org/api/v1';

export function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

// Catch-all for any method without a specific handler. Method-specific handlers
// above take precedence, so this only fires for the rest.
export function onRequest() {
  return json({ error: 'Method not allowed' }, 405);
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const showId = url.searchParams.get('show-id');
  const rawPageSize = parseInt(url.searchParams.get('page-size') || '5', 10);
  const pageSize = Number.isFinite(rawPageSize) ? Math.min(Math.max(rawPageSize, 1), 20) : 5;

  if (!showId) {
    return json({ error: 'Missing required param: show-id' }, 400);
  }

  // PBS Media Manager has no flat "episodes for a show" endpoint — episodes
  // hang off seasons (shows/{id}/seasons -> seasons/{id}/episodes). The
  // `assets` endpoint supports a direct `show-id` filter and a `type` filter
  // (full_length/clip/preview); full_length assets carry a `player_code`
  // iframe embed the widget uses directly.
  const pbsUrl = new URL(`${PBS_BASE}/assets/`);
  pbsUrl.searchParams.set('show-id', showId);
  pbsUrl.searchParams.set('type', 'full_length');
  pbsUrl.searchParams.set('page-size', String(pageSize));
  pbsUrl.searchParams.set('sort', '-encored_on');

  const cacheKey = new Request(pbsUrl.toString());
  const cache = caches.default;
  const cached = await cache.match(cacheKey);
  if (cached) {
    return addCors(cached);
  }

  const basicAuth = btoa(`${env.PBS_API_KEY}:${env.PBS_API_SECRET}`);
  const pbsRes = await fetch(pbsUrl.toString(), {
    headers: { 'Authorization': `Basic ${basicAuth}` },
  });

  if (!pbsRes.ok) {
    return json({ error: 'PBS API error', status: pbsRes.status }, 502);
  }

  const body = await pbsRes.text();
  const response = new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
      ...CORS_HEADERS,
    },
  });

  await cache.put(cacheKey, response.clone());
  return response;
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

function addCors(response) {
  const r = new Response(response.body, response);
  Object.entries(CORS_HEADERS).forEach(([k, v]) => r.headers.set(k, v));
  return r;
}
