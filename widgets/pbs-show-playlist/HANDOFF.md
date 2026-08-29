# PBS Show Playlist — Handoff
*Status: blocked — on PBS confirming API credentials*
*Last updated: 2026-08-29 · Built widget + CF Worker, wired real show ID, hit a 401 auth wall on PBS's side · Last verified: 2026-08-29 — curl'd PBS API directly with the provided key/secret as Basic Auth, got 401 (confirmed not a Worker/code bug)*
*Live vs repo: n/a — nothing pasted into WordPress yet; only the GitHub Pages preview exists*

## Current state
Widget (`index.html` in this folder) and its Cloudflare Worker (`~/Projects/vpm/pbs-api/`) are both built and committed. The widget shows a main PBS partner-player video, a 5-thumbnail strip below it, click-to-swap, and autoplay-to-next. The Worker proxies PBS's Media Manager API with a 1-hour cache and keeps credentials server-side. Real show ID (`678b37bf-6863-450d-9340-8bdf343f94eb`) and callsign (`WCVE`) are already in the widget. The Worker is deployed live at `https://pbs-api.vpm-e01.workers.dev`, but every request to PBS returns `401 Unauthorized` — this is not a bug in our code, it's on PBS's end (see Gotchas).

## Decisions made (and why)
- **iframe embed, not ACF split-file** — brief called for a WordPress iframe, so the widget is a single self-contained `index.html` (format `single`), not the `preview.html`/`html.html`/`css.css`/`js.js` split used elsewhere in this repo.
- **CF Worker proxy for the PBS API** — PBS API keys can't be exposed client-side; the Worker (`~/Projects/vpm/pbs-api/`) holds them as encrypted secrets and adds a 1-hour cache so PBS isn't hit on every pageview.
- **New standalone repo for the Worker, not folded into vpm-widgets** — CF Workers need their own `wrangler.jsonc`/deploy lifecycle, distinct from the static-file Widget Lab.
- **Assets endpoint, not episodes endpoint** — PBS Media Manager has no flat "recent episodes for a show" endpoint; episodes only exist nested under seasons (`shows/{id}/seasons` → `seasons/{id}/episodes`). The `assets` endpoint (`GET assets?show-id=`) does support a direct show filter and returns `tp_media_object_id`, which the player embed needs anyway — confirmed against PBS's own open-source PHP client (`OpenPublicMedia/pbs-media-manager-php`) source on GitHub.
- **HTTP Basic Auth, not a single API key** — PBS Media Manager auth is `Authorization: Basic base64(key:secret)`, per PBS's own docs and confirmed in the same PHP client's `Client.php` (`'auth' => [$key, $secret]` in Guzzle is literally Basic Auth). The Worker originally sent a wrong `X-Api-Key` header from an incorrect first guess — fixed this session.
- **Out of scope for v1 (confirmed with Mark)**: season filtering, other PBS shows (duplicate the widget per show instead), search, watch history, pagination past 5 episodes.
- **Skipped multi-model code review this session** — the change was a small, verifiable mechanical fix (auth header + endpoint), checked directly against PBS's own reference client rather than reasoned about; not the ambiguous-logic case that review is for.

## In progress / next steps
- [ ] Get PBS to confirm the key/secret are active and confirm live vs. staging environment — curl direct to `media.services.pbs.org` with the credentials as HTTP Basic Auth still returns 401 even bypassing the Worker entirely, so this is a PBS-side credentials/activation issue, not our code.
- [ ] Once PBS confirms credentials work, re-test: `curl -s "https://pbs-api.vpm-e01.workers.dev/episodes?show-id=678b37bf-6863-450d-9340-8bdf343f94eb&page-size=5"` should return real episode JSON instead of `{"error":"PBS API error","status":401}`.
- [ ] Push the `pbs-api` Worker repo to GitHub (currently local-only, no remote configured).
- [ ] Once data flows, verify the widget end-to-end in a browser at `https://mhdesigns98.github.io/vpm-widgets/widgets/pbs-show-playlist/` — confirm thumbnails render, click-swap works, and autoplay-to-next fires (needs a real episode to reach its end, or manually trigger the PBS player's postMessage `complete` event to test).
- [ ] Resolve the PBS API Terms of Service open question: confirm with PBS/station relations whether any sponsor/underwriting content on the VHG show page conflicts with the ToS ban on selling "advertising, sponsorships, or promotions... in association with the PBS Content or PBS Player." This could get API access revoked if unresolved.
- [ ] Add a visible link to PBS's Terms of Use somewhere in the widget — the PBS API ToS requires displaying this to end users; not yet added.
- [ ] Run `/ship-widget pbs-show-playlist` before pasting the final iframe into WordPress.

## Gotchas / things that will bite you
- **401 is confirmed PBS-side, not ours.** Verified three ways: (1) Worker → PBS fails, (2) direct curl with `-u key:secret` to PBS bypassing the Worker entirely fails identically, (3) swapping key/secret order made no difference. Don't re-debug the Worker code for this — it's credentials/activation on PBS's end.
- **PBS Media Manager has no flat episodes-by-show endpoint.** If future work needs season-aware episode listings, use `shows/{id}/seasons` then `seasons/{id}/episodes` — the `assets` endpoint (currently used) returns video assets, not "episode" objects with season metadata.
- **PBS API ToS forbids advertising/sponsorship "in association with" PBS content/player** — this is the biggest open compliance risk, not a technical one. Don't treat this as resolved just because the code works.
- **The PBS docs site (docs.pbs.org) renders via JS/auth-gated content** — WebFetch on it returns empty shells. To find real API behavior, pull PBS's own open-source client library source instead (e.g. `github.com/OpenPublicMedia/pbs-media-manager-php`, `src/Client.php`) — that's how the auth scheme and assets-endpoint fix were actually confirmed this session.
- **Two Cloudflare Worker secrets needed, not one**: `PBS_API_KEY` and `PBS_API_SECRET` (set via `npx wrangler secret put <NAME> --profile vpm`, run from inside `~/Projects/vpm/pbs-api` — wrangler errors with "Required Worker name missing" if run from the wrong directory since it can't find `wrangler.jsonc`).

## Key files
- `~/Projects/vpm/vpm-widgets/widgets/pbs-show-playlist/index.html` — the widget itself (player, thumbnail strip, autoplay logic)
- `~/Projects/vpm/vpm-widgets/widgets/pbs-show-playlist/BRIEF.md` — original brief with user moment, done criteria, out-of-scope list
- `~/Projects/vpm/vpm-widgets/widgets/pbs-show-playlist/README.md` — widget usage notes, config values to update per show
- `~/Projects/vpm/pbs-api/src/index.js` — the CF Worker: proxies PBS assets endpoint, Basic Auth, 1-hour cache, CORS
- `~/Projects/vpm/pbs-api/wrangler.jsonc` — Worker config, `account_id` pinned to VPM's CF account (`e017b19d2e3e1827adbd6f5907d81aac`)
- `~/Projects/vpm/pbs-api/README.md` — deploy commands, route spec

## Session log
- 2026-08-29: Scaffolded widget + Worker, deployed Worker, wired real show ID/callsign, discovered and fixed wrong auth header + wrong API endpoint (via PBS's own PHP client source), confirmed remaining 401 is PBS-side (credentials not yet active, or wrong environment) — handed back to Mark to follow up with PBS.
- 2026-08-29 (earlier): Wrote BRIEF.md via `/brief`, scaffolded widget via `/new-widget`, reviewed PBS API Terms of Service and flagged the advertising/sponsorship clause as a real risk.
