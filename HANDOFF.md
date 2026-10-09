# VPM Widgets — Handoff
*Status: active — share page finished; `youtube-shorts-row` widget shipped to Pages (not yet on vpm.org); Cloudflare/`widgets.vpm.org` move parked (no access to the vpm.org domain account)*
*Last updated: 2026-10-09 · built and merged `youtube-shorts-row` (#23, #24), archived the old `vpm-pages` repo and turned off its Pages · Last verified: 2026-10-09 — live `…/vpm-widgets/widgets/youtube-shorts-row/` in Chromium and WebKit: 10 cards and thumbnails, one player at a time, `vpm_shorts_play` reaches `dataLayer`, no overflow at 320px, no page errors; old `…/vpm-pages/` URLs return 404. Share-page checks from 2026-10-02 not re-run.*
*Live vpm.org vs repo: `youtube-shorts-row` is not pasted into vpm.org yet. GitHub Pages serves `main`. Branch `ship-and-banner-fixes` (checked out) is 1 commit ahead of `origin/main` (e3c25a5, `/ship` and vpm-banner edits, not from the Shorts work); working tree clean. `hosted/signup-forms/` still never deployed.*

## Current state

`share/index.html` is a static page that wraps one widget (`?w=<slug>`) or page build (`?p=<slug>`) in context: title and first sentence from the folder's README, a "Goes into" chip from its `Deploy target`, optional `&note=`, optional `&live=<url>` (swaps the "not live" badge for a link), and the preview at wide/desktop/tablet/mobile true widths. `/share` (`.claude/commands/share.md`) builds the link and warns that links are public. Served from GitHub Pages on the personal account (`mhdesigns98.github.io/vpm-widgets/`). Onboarding PR #2 is merged. 
`widgets/youtube-shorts-row/` is a horizontal row of 9:16 VPM Shorts cards (click to play in place, one at a time; button links to the Shorts playlist; headline "VPM on YouTube"), added next to the original `youtube-shorts-embed`, which is unchanged. The old `vpm-pages` repo is archived and its Pages site is off.

## Decisions made (and why)

- **Shorts row is a new widget, not a change to `youtube-shorts-embed`.** Mark wanted both versions available. Headline "VPM on YouTube", sentence case, per the VPM voice; "Virginia in 60 seconds" was dropped because Shorts vary in length.
- **Shorts video list stays hand-edited for now.** The playlist feed has no CORS, so self-updating needs a Worker. No exclusion list: YouTube managers hide videos on YouTube's side. Runs on vpm.org only.
- **Old `vpm-pages` archived and its Pages disabled (2026-10-09).** Undo with `gh repo unarchive` and re-enabling Pages in that repo's settings.
- **No Slack integration for `/share`.** Mark writes his own questions and replies and has no Slack access set up. A drafted Slack-post + `/share log` version was reverted; the diff is not kept in the repo (only in a session scratchpad, now gone).
- **Phones show the real mobile layout and hide the width toggle.** Deliberate: scaling a desktop layout down on a phone is illegible. `?view=wide` on a phone is silently ignored.
- **Cloudflare move parked.** Needs access to the account that owns the `vpm.org` DNS zone. Plan unchanged (below).
- **Cloudflare plan, for when access exists:** Pages project in the *new* account (same account as the DNS zone), `widgets.vpm.org` added via the Pages Custom domains tab (never a manual CNAME first, that gives a 522); `pbs-api` folds into this repo as `functions/api/pbs-episodes.js` (already on `main`); `newsletter-signup` and `chartbeat-weekly` stay separate repos with their own subdomains.

## In progress / next steps

- [ ] `youtube-shorts-row` before it goes on vpm.org: confirm the page's CSP allows `img-src i.ytimg.com` and `frame-src www.youtube.com`; add GTM/GA4 triggers for `vpm_shorts_play` and `vpm_shorts_cta_click` (events are pushed to `dataLayer` but nothing records them yet); test playback on a real phone.
- [ ] Optional: build the Cloudflare Worker that serves the Shorts playlist feed so the row updates itself, per `widgets/youtube-shorts-row/FEED-SPEC.md` (VPM owns the Cloudflare account; only open question is the Worker route/domain).
- [ ] Before the first `hosted/signup-forms` deploy: pick the Cloudflare account. `npm run deploy` targets the old VPM account (`e017b19d…`), which can't serve a `vpm.org` subdomain (see Gotchas). Then replace `SIGNUP-HOST` in its README embed snippet with the real host.
- [ ] Nice-to-haves from the review, not started: plain-language width labels ("Desktop" instead of "1280px wide, scaled to 40%"), "Note from the sender" label on the note box.
- [ ] When vpm.org domain access exists: Cloudflare Pages project, `widgets.vpm.org`, `PBS_API_KEY`/`PBS_API_SECRET` as Pages secrets, verify `/api/pbs-episodes?show-id=...`, then update the 4 hardcoded `pbs-api.vpm-e01.workers.dev` references (`widgets/pbs-show-playlist/index.html`, its README, `widgets/virginia-home-grown-playlist/index.html`, its README), retire the old `pbs-api` Worker (`~/Projects/vpm/pbs-api/`), and fix the `mhdesigns98.github.io` doc references.

## Gotchas / things that will bite you

- Old `mhdesigns98.github.io/vpm-pages/...` links are dead (404 since 2026-10-09); new links must use `.../vpm-widgets/pages/<slug>/`. Old branches `claude/rich-text-sections-acf` (on origin) and `claude/consolidate-page` (local only) hold unmerged work.
- `vpm-banner` fails the widget checklist (duplicate ids, hard-coded hex, generic `vpm-button`/`vpm-close` classes); found in the post-merge audit, not fixed.

- **Share links are public and unauthenticated** (public repo on a personal GitHub account). Don't send embargoed or sensitive builds this way.
- GitHub Pages serves `main` only: a widget on a branch or open PR gives "Preview not found". Pages caches for 10 minutes, so the page appends `?fresh=<timestamp>` to the preview URL.
- The two iframe widgets (`pbs-show-playlist`, `virginia-home-grown-playlist`) depend on `mhdesigns98.github.io` URLs, and a `postMessage` origin check for it is pasted in the live Brightspot page, outside any repo. Confirm what's live in the CMS before any domain cutover.
- Cloudflare Pages custom domains need the project and the DNS zone in the same account. The old "VPM" account (`e017b19d2e3e1827adbd6f5907d81aac`) is the wrong one for this.
- The vestigial "Workers Builds: vpm-widgets" check was deleted 2026-10-01 (`wrangler delete`). Don't recreate it.
- `widgets/youtube-shorts-row/` — Shorts row widget (`index.html`, `README.md`, `FEED-SPEC.md` for the self-updating-list outline)
- `functions/api/pbs-episodes.js` known gaps left as-is to match the old Worker: no `show-id` validation, wildcard CORS, uncaught `cache.put()` failures, opaque error on missing secrets.
- `second-opinion` / save-progress background reviews use `timeout`, which isn't installed on macOS; Gemini silently never runs. Use `gtimeout` or a plain background job.
- Local testing of the share page: `python3 -m http.server` from the repo root, then `/share/?w=<slug>`. The PBS widgets log ad/tracker network errors there; that's the player, not the share page.

## Key files

- `share/index.html` — the share page (all logic inline)
- `.claude/commands/share.md` — `/share` command; `.claude/commands/` also has brief, new-widget, ship-widget, save-component, new-page, ship-page, consolidate-page, critique
- `functions/api/pbs-episodes.js` — Pages Function, on `main`, not deployed anywhere
- `widgets/live-updates-rail/HANDOFF.md` — that widget's own state (parked pending newsroom feedback)
- `CLAUDE.md`, `CONTRIBUTING.md`, `INDEX.md` — conventions, onboarding, widget and page index
- `pages/` — full page builds, merged in from the old `vpm-pages` repo on 2026-10-09 (PR #25) with history; the old repo is archived and its Pages is off
- `hosted/signup-forms/` — builds iframe pages from the three signup widgets for a Cloudflare Pages project (not deployed); widgets stay the source
- `.claude/settings.json` + `.claude/hooks/check-index.sh` — shared hooks: INDEX/README drift warning on Stop, block edits to `tokens.css`
- `.claude/agents/harness-runner.md` — read-only subagent that runs a widget through the CMS harness (needs the chrome-devtools MCP)

## Session log

- 2026-10-09: Built `youtube-shorts-row` (PR #23), ran it through the CMS harness (fixed duplicate id, host `!important` link color, 320px column blowout, host image border) and a WebKit pass; web-team review led to PR #24 (analytics events, dead-video drop, resize-listener fix, token cleanup, `FEED-SPEC.md`). Archived `vpm-pages`, turned off its Pages. Multi-model second-opinion review was not run.
- 2026-10-02: Fixed the `&live=` host check in `share/index.html` (now requires http(s) on vpm.org or a subdomain, no `user:pass@`); 10 accept/reject cases passed in headless Chrome. Verified live. Committed local tooling (PR #19), refreshed this handoff (PR #18), closed live-updates-rail PR #8 (see that widget's handoff). Codex review of #20: no issues; Gemini returned a 503, no review.
- 2026-10-01: Reviewed the share page with /critique (Codex) and web-team-review; shipped PR #16 (width kept in link, `&live=` badge, darker focus ring + copy announcement, fresh URL on "Open on its own", public-link warning). Reverted the Slack-post `/share` redesign. Earlier the same day: PRs #9–#15 built the share page and fixed its sizing, caching, and README parsing; removed the vestigial Workers Build.
- 2026-09-04: Onboarding branch (PR #2, since merged), scoped Cloudflare migration, drafted `pbs-episodes.js`.
