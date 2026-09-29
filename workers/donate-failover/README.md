# donate-failover

Cloudflare Worker that serves `vpm.org/donate` as a failover redirect. A cron (every 2 min)
health-checks the PledgeCart form and stores `{state, checkedAt, …}` in KV. The fetch handler
reads it and 302s donors to PledgeCart or `BACKUP_URL`, passing the query string through.

**Every uncertain case fails open to PledgeCart**: empty or unreadable KV, a KV read slower than 1s,
status older than 20 min (cron stopped), no `BACKUP_URL`. Donors only go to the backup on a
fresh, double-checked "down", or a manual override.

## Setup

```sh
npm install
npm test                 # unit tests (node --test, no Cloudflare needed)
npm run dev              # wrangler dev against the real PledgeCart
```

Before the first deploy:
1. Set `BACKUP_URL` in `wrangler.toml` (empty = failover disabled).
2. Set `HEALTH_MARKER`: a string that only appears on the working form. Without it, any
   HTTP 200 counts as "up", including a "campaign not found" page.
3. `npx wrangler login`, then `npx wrangler kv namespace create DONATE_STATUS`, then paste the id into `wrangler.toml`.
4. `npm run deploy`. The `routes` block is commented out, so this goes to `*.workers.dev` only.

## Testing the failover locally

```sh
npm run dev:down         # terminal 1: PRIMARY_URL → a dead port, BACKUP_URL → example.org
npm run failover-test    # terminal 2: redirect before/after a cron run, /__status, pass-through
```

`wrangler dev --test-scheduled` exposes `/__scheduled`, which triggers the cron on demand.

## Operating it

- **`/__status`** (workers.dev only) returns JSON: 200 when healthy, 503 when failed over, stale,
  or missing `BACKUP_URL`. Point an uptime monitor at it. That's how you find out the cron died.
- **Manual override:** `npx wrangler kv key put --remote --binding DONATE_STATUS override backup`
  (or `primary`). Delete the key to go back to automatic. Add `--local` instead when running under `wrangler dev`.
- **Bot-blocking:** a 403, a 429 or a Cloudflare challenge from PledgeCart is logged as "blocked" and
  **does not** trigger failover (it says nothing about whether humans can donate). The health check sends a
  browser UA tagged `VPM-DonateFailover/1.0`, so you can ask PledgeCart to allowlist it. Check
  `/__status` → `status.blocked` after the first deploy.
- **KV writes** happen on a state change, or as a heartbeat every 6 min (~240 writes/day). Writing
  only on change would leave `checkedAt` frozen while healthy, so a dead cron would be invisible,
  and a stale cross-location read could skip a needed write.
- `wrangler tail` for live logs.

## Routes

Exact patterns for `/donate` and `/donate/` on apex and www. `vpm.org/donate*` would also capture
`/donations`, `/donate/planned-giving`, etc. Any other path that does reach the Worker is passed
through to the origin untouched.
