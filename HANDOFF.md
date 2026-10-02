# VPM Widgets — Handoff
*Status: active — share page finished and merged; Cloudflare/`widgets.vpm.org` move parked (no access to the vpm.org domain account right now)*
*Last updated: 2026-10-01 · reviewed the share page (/critique + web-team-review), shipped 5 fixes as PR #16, dropped the Slack-post redesign of `/share` · Last verified: 2026-10-01 — PR #16 merged; on the live GitHub Pages URL the `&live=` chip, `view=` written to the URL on width click, and `fresh=` on "Open on its own" all confirmed in a browser; Codex review of the PR #16 diff returned one finding (below); Gemini did not run (`timeout` doesn't exist on macOS)*
*Live vs repo: in sync for everything committed (`origin/main` = what Pages serves). Local only, untracked: `hosted/signup-forms/`, `.claude/agents/`, `.claude/hooks/`, `.claude/settings.json`, `.playwright-mcp/`. (The `live-updates-rail` handoff note merged 2026-10-02 as PR #17.)*

## Current state

`share/index.html` is a static page that wraps one widget (`?w=<slug>`) or page build (`?p=<slug>`) in context: title and first sentence from the folder's README, a "Goes into" chip from its `Deploy target`, optional `&note=`, optional `&live=<url>` (swaps the "not live" badge for a link), and the preview at wide/desktop/tablet/mobile true widths. `/share` (`.claude/commands/share.md`) builds the link and warns that links are public. Served from GitHub Pages on the personal account (`mhdesigns98.github.io/vpm-widgets/`). Onboarding PR #2 is merged. Open: PR #8 (`live-updates-rail` Stories tab).

## Decisions made (and why)

- **No Slack integration for `/share`.** Mark writes his own questions and replies and has no Slack access set up. A drafted Slack-post + `/share log` version was reverted; the diff is not kept in the repo (only in a session scratchpad, now gone).
- **Phones show the real mobile layout and hide the width toggle.** Deliberate: scaling a desktop layout down on a phone is illegible. `?view=wide` on a phone is silently ignored.
- **Cloudflare move parked.** Needs access to the account that owns the `vpm.org` DNS zone. Plan unchanged (below).
- **Cloudflare plan, for when access exists:** Pages project in the *new* account (same account as the DNS zone), `widgets.vpm.org` added via the Pages Custom domains tab (never a manual CNAME first, that gives a 522); `pbs-api` folds into this repo as `functions/api/pbs-episodes.js` (already on `main`); `newsletter-signup` and `chartbeat-weekly` stay separate repos with their own subdomains.

## In progress / next steps

- [ ] **Fix `&live=` host check** (`share/index.html`, the `live` block in `load()`): it accepts any http(s) URL, so `https://www.vpm.org@evil.example/` shows "Live on vpm.org" but links elsewhere. Parse with `new URL`, require hostname `vpm.org` or `*.vpm.org`, reject credentials. Found by Codex review of PR #16; confirmed by reading the code, not yet fixed.
- [ ] Decide what to do with the untracked folders (`hosted/signup-forms/`, `.claude/agents/`, `.claude/hooks/`, `.claude/settings.json`, `.playwright-mcp/`); none are part of the share work.
- [ ] Merge or close PR #8 (`live-updates-rail` Stories tab).
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

## Session log

- 2026-10-01: Reviewed the share page with /critique (Codex) and web-team-review; shipped PR #16 (width kept in link, `&live=` badge, darker focus ring + copy announcement, fresh URL on "Open on its own", public-link warning). Reverted the Slack-post `/share` redesign. Earlier the same day: PRs #9–#15 built the share page and fixed its sizing, caching, and README parsing; removed the vestigial Workers Build.
- 2026-09-04: Onboarding branch (PR #2, since merged), scoped Cloudflare migration, drafted `pbs-episodes.js`.
