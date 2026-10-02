# VPM Widgets — Handoff
*Status: active — share page finished and merged; Cloudflare/`widgets.vpm.org` move parked (no access to the vpm.org domain account right now)*
*Last updated: 2026-10-02 · fixed the `&live=` host check (#20), committed local tooling (#19), closed live-updates-rail PR #8 · Last verified: 2026-10-02 — `share/index.html` served locally in headless Chrome: 3 vpm.org URLs show the Live badge, 7 spoofed/invalid ones (`www.vpm.org@evil.example`, `user:pw@`, `evilvpm.org`, `vpm.org.evil.example`, `javascript:`, `ftp:`, garbage) keep "not live"; no page errors. Same 10 cases re-run against the live GitHub Pages URL after #20 merged: all passed.*
*Live vs repo: in sync (`origin/main` = what Pages serves). `hosted/signup-forms/` is in the repo but has never been deployed (2026-10-02: `vpm-signup-forms` Pages project does not exist on the VPM account).*

## Current state

`share/index.html` is a static page that wraps one widget (`?w=<slug>`) or page build (`?p=<slug>`) in context: title and first sentence from the folder's README, a "Goes into" chip from its `Deploy target`, optional `&note=`, optional `&live=<url>` (swaps the "not live" badge for a link), and the preview at wide/desktop/tablet/mobile true widths. `/share` (`.claude/commands/share.md`) builds the link and warns that links are public. Served from GitHub Pages on the personal account (`mhdesigns98.github.io/vpm-widgets/`). Onboarding PR #2 is merged. No open PRs.

## Decisions made (and why)

- **No Slack integration for `/share`.** Mark writes his own questions and replies and has no Slack access set up. A drafted Slack-post + `/share log` version was reverted; the diff is not kept in the repo (only in a session scratchpad, now gone).
- **Phones show the real mobile layout and hide the width toggle.** Deliberate: scaling a desktop layout down on a phone is illegible. `?view=wide` on a phone is silently ignored.
- **Cloudflare move parked.** Needs access to the account that owns the `vpm.org` DNS zone. Plan unchanged (below).
- **Cloudflare plan, for when access exists:** Pages project in the *new* account (same account as the DNS zone), `widgets.vpm.org` added via the Pages Custom domains tab (never a manual CNAME first, that gives a 522); `pbs-api` folds into this repo as `functions/api/pbs-episodes.js` (already on `main`); `newsletter-signup` and `chartbeat-weekly` stay separate repos with their own subdomains.

## In progress / next steps

- [ ] Before the first `hosted/signup-forms` deploy: pick the Cloudflare account. `npm run deploy` targets the old VPM account (`e017b19d…`), which can't serve a `vpm.org` subdomain (see Gotchas). Then replace `SIGNUP-HOST` in its README embed snippet with the real host.
- [ ] Nice-to-haves from the review, not started: plain-language width labels ("Desktop" instead of "1280px wide, scaled to 40%"), "Note from the sender" label on the note box.
- [ ] When vpm.org domain access exists: Cloudflare Pages project, `widgets.vpm.org`, `PBS_API_KEY`/`PBS_API_SECRET` as Pages secrets, verify `/api/pbs-episodes?show-id=...`, then update the 4 hardcoded `pbs-api.vpm-e01.workers.dev` references (`widgets/pbs-show-playlist/index.html`, its README, `widgets/virginia-home-grown-playlist/index.html`, its README), retire the old `pbs-api` Worker (`~/Projects/vpm/pbs-api/`), and fix the `mhdesigns98.github.io` doc references.

## Gotchas / things that will bite you

- **Share links are public and unauthenticated** (public repo on a personal GitHub account). Don't send embargoed or sensitive builds this way.
- GitHub Pages serves `main` only: a widget on a branch or open PR gives "Preview not found". Pages caches for 10 minutes, so the page appends `?fresh=<timestamp>` to the preview URL.
- The two iframe widgets (`pbs-show-playlist`, `virginia-home-grown-playlist`) depend on `mhdesigns98.github.io` URLs, and a `postMessage` origin check for it is pasted in the live Brightspot page, outside any repo. Confirm what's live in the CMS before any domain cutover.
- Cloudflare Pages custom domains need the project and the DNS zone in the same account. The old "VPM" account (`e017b19d2e3e1827adbd6f5907d81aac`) is the wrong one for this.
- The vestigial "Workers Builds: vpm-widgets" check was deleted 2026-10-01 (`wrangler delete`). Don't recreate it.
- `functions/api/pbs-episodes.js` known gaps left as-is to match the old Worker: no `show-id` validation, wildcard CORS, uncaught `cache.put()` failures, opaque error on missing secrets.
- `second-opinion` / save-progress background reviews use `timeout`, which isn't installed on macOS; Gemini silently never runs. Use `gtimeout` or a plain background job.
- Local testing of the share page: `python3 -m http.server` from the repo root, then `/share/?w=<slug>`. The PBS widgets log ad/tracker network errors there; that's the player, not the share page.

## Key files

- `share/index.html` — the share page (all logic inline)
- `.claude/commands/share.md` — `/share` command; `.claude/commands/` also has brief, new-widget, ship-widget, save-component, critique
- `functions/api/pbs-episodes.js` — Pages Function, on `main`, not deployed anywhere
- `widgets/live-updates-rail/HANDOFF.md` — that widget's own state (parked pending newsroom feedback)
- `CLAUDE.md`, `CONTRIBUTING.md`, `INDEX.md` — conventions, onboarding, widget index
- `hosted/signup-forms/` — builds iframe pages from the three signup widgets for a Cloudflare Pages project (not deployed); widgets stay the source
- `.claude/settings.json` + `.claude/hooks/check-index.sh` — shared hooks: INDEX/README drift warning on Stop, block edits to `tokens.css`
- `.claude/agents/harness-runner.md` — read-only subagent that runs a widget through the CMS harness (needs the chrome-devtools MCP)

## Session log

- 2026-10-02: Fixed the `&live=` host check in `share/index.html` (now requires http(s) on vpm.org or a subdomain, no `user:pass@`); 10 accept/reject cases passed in headless Chrome. Verified live. Committed local tooling (PR #19), refreshed this handoff (PR #18), closed live-updates-rail PR #8 (see that widget's handoff). Codex review of #20: no issues; Gemini returned a 503, no review.
- 2026-10-01: Reviewed the share page with /critique (Codex) and web-team-review; shipped PR #16 (width kept in link, `&live=` badge, darker focus ring + copy announcement, fresh URL on "Open on its own", public-link warning). Reverted the Slack-post `/share` redesign. Earlier the same day: PRs #9–#15 built the share page and fixed its sizing, caching, and README parsing; removed the vestigial Workers Build.
- 2026-09-04: Onboarding branch (PR #2, since merged), scoped Cloudflare migration, drafted `pbs-episodes.js`.
