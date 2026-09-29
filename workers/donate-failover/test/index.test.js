import { test } from "node:test";
import assert from "node:assert/strict";
import worker, { probe, check, runScheduled, resolveTarget, buildRedirectURL, isDonatePath } from "../src/index.js";

const PRIMARY = "https://www.pledgecart.org/home?campaign=ABC";
const BACKUP = "https://backup.example/give";

function kv(initial = {}) {
  const store = new Map(Object.entries(initial));
  const kvObj = {
    store,
    puts: 0,
    delay: 0,
    async get(k) {
      if (kvObj.delay) await new Promise((r) => setTimeout(r, kvObj.delay));
      return store.has(k) ? store.get(k) : null;
    },
    async put(k, v) {
      kvObj.puts++;
      store.set(k, v);
    },
  };
  return kvObj;
}

function env(over = {}) {
  return { PRIMARY_URL: PRIMARY, BACKUP_URL: BACKUP, HEALTH_MARKER: "", DONATE_STATUS: kv(), ...over };
}

const res = (status, body = "<html>form</html>", headers = {}) => async () => new Response(body, { status, headers });
const seq = (...fns) => {
  let i = 0;
  return (...a) => fns[Math.min(i++, fns.length - 1)](...a);
};
const noSleep = async () => {};
const status = (e) => JSON.parse(e.DONATE_STATUS.store.get("status"));

// ------------------------------------------------------------------ probe

test("probe: 200 is up, 5xx is down, network error is down", async () => {
  assert.equal((await probe(env(), res(200))).result, "up");
  assert.equal((await probe(env(), res(502))).result, "down");
  assert.equal((await probe(env(), async () => { throw new TypeError("connect ECONNREFUSED"); })).result, "down");
});

test("probe: 403 / 429 / cf challenge are 'blocked', not down", async () => {
  assert.equal((await probe(env(), res(403))).result, "blocked");
  assert.equal((await probe(env(), res(429))).result, "blocked");
  assert.equal((await probe(env(), res(503, "", { "cf-mitigated": "challenge" }))).result, "blocked");
  assert.equal((await probe(env(), res(200, "<title>Just a moment...</title>"))).result, "blocked");
});

test("probe: HEALTH_MARKER missing from a 200 page is down", async () => {
  const e = env({ HEALTH_MARKER: "donation-form" });
  assert.equal((await probe(e, res(200, "<h1>Campaign not found</h1>"))).result, "down");
  assert.equal((await probe(e, res(200, '<form id="donation-form">'))).result, "up");
});

// ------------------------------------------------------------------ double-check

test("check: one failure then success is up (no flap)", async () => {
  const r = await check(env(), { fetchImpl: seq(res(500), res(200)), sleep: noSleep });
  assert.equal(r.verdict, "up");
});

test("check: two failures is down", async () => {
  const r = await check(env(), { fetchImpl: seq(res(500), res(504)), sleep: noSleep });
  assert.equal(r.verdict, "down");
});

test("check: bot-blocked is unknown even if the other probe failed", async () => {
  const r = await check(env(), { fetchImpl: seq(res(500), res(403)), sleep: noSleep });
  assert.equal(r.verdict, "unknown");
});

// ------------------------------------------------------------------ KV writes

test("scheduled: first run writes; unchanged within heartbeat skips; heartbeat rewrites", async () => {
  const e = env();
  const up = { fetchImpl: res(200), sleep: noSleep };
  await runScheduled(e, { ...up, now: 0 });
  assert.equal(e.DONATE_STATUS.puts, 1);
  await runScheduled(e, { ...up, now: 120_000 });
  assert.equal(e.DONATE_STATUS.puts, 1, "no write when unchanged and heartbeat not due");
  await runScheduled(e, { ...up, now: 360_000 });
  assert.equal(e.DONATE_STATUS.puts, 2, "heartbeat write");
  assert.equal(status(e).checkedAt, 360_000);
});

test("scheduled: state change writes immediately and sets changedAt", async () => {
  const e = env();
  await runScheduled(e, { fetchImpl: res(200), sleep: noSleep, now: 0 });
  await runScheduled(e, { fetchImpl: res(500), sleep: noSleep, now: 120_000 });
  assert.equal(e.DONATE_STATUS.puts, 2);
  assert.equal(status(e).state, "down");
  assert.equal(status(e).changedAt, 120_000);
});

test("scheduled: bot-block keeps prior state (does not fail over) and is recorded", async () => {
  const e = env();
  await runScheduled(e, { fetchImpl: res(200), sleep: noSleep, now: 0 });
  await runScheduled(e, { fetchImpl: res(403), sleep: noSleep, now: 120_000 });
  assert.equal(status(e).state, "up");
  assert.equal(status(e).blocked, true);
});

test("scheduled: bot-block with empty KV assumes up", async () => {
  const e = env();
  await runScheduled(e, { fetchImpl: res(403), sleep: noSleep, now: 0 });
  assert.equal(status(e).state, "up");
});

// ------------------------------------------------------------------ routing decision

const put = (e, obj) => e.DONATE_STATUS.store.set("status", JSON.stringify(obj));

test("resolve: down + fresh → backup; up → primary", async () => {
  const e = env();
  put(e, { state: "down", checkedAt: 1000 });
  assert.equal((await resolveTarget(e, 2000)).target, "backup");
  put(e, { state: "up", checkedAt: 1000 });
  assert.equal((await resolveTarget(e, 2000)).target, "primary");
});

test("resolve: empty KV, garbage KV, stale down → primary", async () => {
  const e = env();
  assert.equal((await resolveTarget(e, 0)).target, "primary");
  e.DONATE_STATUS.store.set("status", "{not json");
  assert.equal((await resolveTarget(e, 0)).target, "primary");
  put(e, { state: "down", checkedAt: 0 });
  assert.equal((await resolveTarget(e, 1201_000)).target, "primary", "stale → fail open");
});

test("resolve: slow KV → primary within timeout", async () => {
  const e = env({ KV_TIMEOUT_MS: "50" });
  put(e, { state: "down", checkedAt: Date.now() });
  e.DONATE_STATUS.delay = 500;
  const t = Date.now();
  const r = await resolveTarget(e);
  assert.equal(r.target, "primary");
  assert.ok(Date.now() - t < 300);
});

test("resolve: no BACKUP_URL → always primary", async () => {
  const e = env({ BACKUP_URL: "" });
  put(e, { state: "down", checkedAt: Date.now() });
  assert.equal((await resolveTarget(e)).target, "primary");
});

test("resolve: override wins over status", async () => {
  const e = env();
  put(e, { state: "up", checkedAt: Date.now() });
  e.DONATE_STATUS.store.set("override", "backup");
  assert.equal((await resolveTarget(e)).target, "backup");
  put(e, { state: "down", checkedAt: Date.now() });
  e.DONATE_STATUS.store.set("override", "primary");
  assert.equal((await resolveTarget(e)).target, "primary");
});

// ------------------------------------------------------------------ URL handling

test("query passthrough; target params can't be overridden", () => {
  assert.equal(
    buildRedirectURL(PRIMARY, "?utm_source=email&campaign=EVIL"),
    "https://www.pledgecart.org/home?campaign=ABC&utm_source=email"
  );
  assert.equal(buildRedirectURL(BACKUP, ""), BACKUP);
  assert.equal(buildRedirectURL(BACKUP, "?a=1&a=2"), BACKUP + "?a=1&a=2");
});

test("paths: /donate and /donate/ only", () => {
  for (const p of ["/donate", "/donate/", "/DONATE/"]) assert.ok(isDonatePath(p), p);
  for (const p of ["/donations", "/donate/planned-giving", "/donate//", "/"]) assert.ok(!isDonatePath(p), p);
});

test("fetch: /donate/?x=1 302s with no-store and query preserved", async () => {
  const e = env();
  const r = await worker.fetch(new Request("https://vpm.org/donate/?utm_source=x"), e);
  assert.equal(r.status, 302);
  assert.equal(r.headers.get("location"), PRIMARY + "&utm_source=x");
  assert.match(r.headers.get("cache-control"), /no-store/);
});
