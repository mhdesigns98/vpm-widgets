/**
 * vpm.org/donate failover redirect.
 *
 * scheduled (every 2 min): health-check PledgeCart, store {state, checkedAt, ...} in KV.
 * fetch: read that status and 302 donors to PledgeCart or the backup form,
 *        passing the incoming query string through.
 *
 * Failure policy — every "don't know" answer resolves to PledgeCart (the primary):
 *   - KV empty, unparseable, slow (>KV_TIMEOUT_MS) or throwing → primary
 *   - status older than STALE_AFTER_SECONDS (cron stopped)       → primary
 *   - BACKUP_URL not configured                                  → primary
 * The only thing that sends donors to the backup is a fresh, confirmed "down"
 * (or a manual override). /__status exists so an uptime monitor can alert on
 * the cases above instead of them failing silently.
 */

const STATUS_KEY = "status";
const OVERRIDE_KEY = "override"; // "primary" | "backup" — manual kill switch

const DEFAULTS = {
  STALE_AFTER_SECONDS: 1200, // must exceed HEARTBEAT + cron interval + KV propagation (~60s)
  HEARTBEAT_SECONDS: 360, // rewrite unchanged status this often so staleness is detectable
  CHECK_TIMEOUT_MS: 8000,
  RECHECK_DELAY_MS: 5000,
  KV_TIMEOUT_MS: 1000,
};

// Browser-like, but identifiable, so PledgeCart can allowlist it rather than guess.
const HEALTH_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) " +
  "Chrome/128.0 Safari/537.36 VPM-DonateFailover/1.0 (+https://vpm.org)";

function cfg(env, name) {
  const v = Number(env[name]);
  return Number.isFinite(v) && v >= 0 ? v : DEFAULTS[name];
}

// ---------------------------------------------------------------- health check

/**
 * One probe. Returns { result: "up" | "down" | "blocked", detail }.
 * "blocked" = we got a bot wall (403/429/challenge). That says nothing about
 * whether donors can reach the form, so it never flips the state.
 */
export async function probe(env, fetchImpl = fetch) {
  let res;
  try {
    res = await fetchImpl(env.PRIMARY_URL, {
      method: "GET",
      redirect: "follow",
      headers: {
        "User-Agent": HEALTH_UA,
        Accept: "text/html,application/xhtml+xml",
        "Cache-Control": "no-cache",
      },
      signal: AbortSignal.timeout(cfg(env, "CHECK_TIMEOUT_MS")),
      cf: { cacheTtl: 0, cacheEverything: false },
    });
  } catch (err) {
    return { result: "down", detail: `fetch failed: ${err.name}: ${err.message}` };
  }

  const status = res.status;
  const mitigated = res.headers.get("cf-mitigated");
  if (mitigated === "challenge" || status === 403 || status === 429) {
    return { result: "blocked", detail: `HTTP ${status}${mitigated ? ` cf-mitigated=${mitigated}` : ""}` };
  }
  if (status !== 200) {
    return { result: "down", detail: `HTTP ${status}` };
  }

  let body;
  try {
    body = await res.text();
  } catch (err) {
    return { result: "down", detail: `body read failed: ${err.message}` };
  }

  // A 200 challenge page or a generic "campaign not found" page is not the form.
  if (/<title>\s*Just a moment|challenge-platform|cf-chl-/i.test(body)) {
    return { result: "blocked", detail: "HTTP 200 challenge page" };
  }
  const marker = env.HEALTH_MARKER;
  if (marker && !body.includes(marker)) {
    return { result: "down", detail: `HTTP 200 but HEALTH_MARKER not found (${body.length} bytes)` };
  }
  return { result: "up", detail: `HTTP 200 (${body.length} bytes)` };
}

/**
 * Double-check: a single failure is re-probed after RECHECK_DELAY_MS.
 * Down only if both probes say down. Any "blocked" → "unknown" (state kept).
 */
export async function check(env, { fetchImpl = fetch, sleep = defaultSleep } = {}) {
  const first = await probe(env, fetchImpl);
  if (first.result === "up") return { verdict: "up", detail: first.detail };

  await sleep(cfg(env, "RECHECK_DELAY_MS"));
  const second = await probe(env, fetchImpl);

  if (second.result === "up") return { verdict: "up", detail: `recovered on recheck (first: ${first.detail})` };
  if (first.result === "blocked" || second.result === "blocked") {
    return { verdict: "unknown", detail: `bot-blocked: ${first.detail} / ${second.detail}` };
  }
  return { verdict: "down", detail: `${first.detail} / ${second.detail}` };
}

const defaultSleep = (ms) => new Promise((r) => setTimeout(r, ms));

// --------------------------------------------------------------------- KV state

async function readJSON(env, key) {
  const raw = await env.DONATE_STATUS.get(key);
  if (raw == null) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Runs the check and writes KV when the state changed OR a heartbeat is due.
 *
 * Why not write-on-change only: KV reads are eventually consistent (~60s
 * across locations), and cron invocations can land in different locations.
 * A run that reads a stale "up" after another run wrote "down" would skip
 * its write and leave "down" in place. The heartbeat bounds that to
 * HEARTBEAT_SECONDS, and it's what makes a dead cron detectable at all —
 * without it, checkedAt never moves while things are healthy.
 */
export async function runScheduled(env, opts = {}) {
  const now = opts.now ?? Date.now();
  const prev = await readJSON(env, STATUS_KEY);
  const { verdict, detail } = await check(env, opts);

  const prevState = prev?.state ?? null;
  // "unknown" (bot-blocked) keeps the previous state; with no previous state, assume up.
  const state = verdict === "unknown" ? prevState ?? "up" : verdict;

  const changed = state !== prevState;
  const heartbeatDue = prev?.checkedAt == null || now - prev.checkedAt >= cfg(env, "HEARTBEAT_SECONDS") * 1000;
  // Always record the first bot-block so it shows up in /__status.
  const newlyBlocked = verdict === "unknown" && !prev?.blocked;

  const next = {
    state,
    checkedAt: now,
    changedAt: changed ? now : prev?.changedAt ?? now,
    detail,
    blocked: verdict === "unknown",
  };

  if (changed || heartbeatDue || newlyBlocked) {
    await env.DONATE_STATUS.put(STATUS_KEY, JSON.stringify(next));
  }

  const log = verdict === "up" ? console.log : console.warn;
  log(
    `[donate-failover] verdict=${verdict} state=${state}` +
      `${changed ? ` (changed from ${prevState})` : ""} wrote=${changed || heartbeatDue || newlyBlocked} ${detail}`
  );
  return { ...next, verdict, changed };
}

// ---------------------------------------------------------------------- routing

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(`timeout after ${ms}ms`)), ms)),
  ]);
}

/** Decides where to send a donor. Never throws. */
export async function resolveTarget(env, now = Date.now()) {
  const primary = { target: "primary", url: env.PRIMARY_URL };
  if (!env.BACKUP_URL) return { ...primary, reason: "BACKUP_URL not configured" };

  let override, status;
  try {
    [override, status] = await withTimeout(
      Promise.all([
        env.DONATE_STATUS.get(OVERRIDE_KEY, { cacheTtl: 60 }),
        env.DONATE_STATUS.get(STATUS_KEY, { cacheTtl: 60 }),
      ]),
      cfg(env, "KV_TIMEOUT_MS")
    );
  } catch (err) {
    console.error(`[donate-failover] KV read failed, failing open to primary: ${err.message}`);
    return { ...primary, reason: `KV error: ${err.message}` };
  }

  if (override === "backup") return { target: "backup", url: env.BACKUP_URL, reason: "override" };
  if (override === "primary") return { ...primary, reason: "override" };

  let parsed = null;
  try {
    parsed = status ? JSON.parse(status) : null;
  } catch {
    /* fall through */
  }
  if (!parsed?.state || typeof parsed.checkedAt !== "number") return { ...primary, reason: "no status in KV" };

  const ageSec = (now - parsed.checkedAt) / 1000;
  if (ageSec > cfg(env, "STALE_AFTER_SECONDS")) {
    console.error(`[donate-failover] status is ${Math.round(ageSec)}s old — cron not running? failing open`);
    return { ...primary, reason: `stale status (${Math.round(ageSec)}s)` };
  }
  if (parsed.state === "down") return { target: "backup", url: env.BACKUP_URL, reason: "primary down" };
  return { ...primary, reason: "primary up" };
}

/**
 * Merge the donor's query string onto the target URL. The target's own
 * params win on conflict, so ?campaign=... on a donor link can't send them
 * to a different PledgeCart campaign.
 */
export function buildRedirectURL(targetURL, incomingSearch) {
  const out = new URL(targetURL);
  const incoming = new URLSearchParams(incomingSearch);
  const reserved = new Set(out.searchParams.keys());
  for (const [k, v] of incoming) {
    if (!reserved.has(k)) out.searchParams.append(k, v);
  }
  return out.toString();
}

/** /donate and /donate/ only. Anything else under a /donate route passes through. */
export function isDonatePath(pathname) {
  return /^\/donate\/?$/i.test(pathname);
}

function redirect(location) {
  return new Response(null, {
    status: 302,
    headers: {
      Location: location,
      // Never let a browser or edge cache pin donors to one side of the failover.
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const onWorkersDev = url.hostname.endsWith(".workers.dev") || url.hostname === "localhost" || url.hostname === "127.0.0.1";

    if (onWorkersDev && url.pathname === "/__status") {
      const now = Date.now();
      const resolved = await resolveTarget(env, now);
      let status = null;
      try {
        status = JSON.parse((await env.DONATE_STATUS.get(STATUS_KEY)) ?? "null");
      } catch {
        /* reported as null */
      }
      const ageSec = status?.checkedAt ? Math.round((now - status.checkedAt) / 1000) : null;
      // 503 whenever a human should look: stale/missing status, or currently failed over.
      const healthy = ageSec !== null && ageSec <= cfg(env, "STALE_AFTER_SECONDS") && resolved.target === "primary" && !!env.BACKUP_URL;
      return Response.json(
        { healthy, routing: resolved, status, statusAgeSeconds: ageSec },
        { status: healthy ? 200 : 503, headers: { "Cache-Control": "no-store" } }
      );
    }

    // On workers.dev, / also redirects so it's easy to click-test.
    if (!isDonatePath(url.pathname) && !(onWorkersDev && url.pathname === "/")) {
      // Routed on vpm.org but not /donate or /donate/ (e.g. /donate/planned-giving):
      // hand it back to the origin untouched.
      return onWorkersDev ? new Response("Not found", { status: 404 }) : fetch(request);
    }

    const resolved = await resolveTarget(env);
    return redirect(buildRedirectURL(resolved.url, url.search));
  },

  async scheduled(controller, env) {
    await runScheduled(env);
  },
};
