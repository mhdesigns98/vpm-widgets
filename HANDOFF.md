# VPM Widgets — Handoff
*Status: active — team onboarding (PR #2, open/unmerged) + Cloudflare account migration planning*
*Last updated: 2026-09-04 · onboarding docs/commands finished and pushed; Cloudflare migration scoped and one piece drafted · Last verified: 2026-09-04 — GitHub Pages API confirmed no custom domain (`cname: null`); grepped both repos for every `mhdesigns98.github.io`/`vpm-e01.workers.dev` reference; multi-model review run on the new Pages Function (Codex returned and found a real bug, now fixed; Gemini hit a 429 quota error; Ollama gave a non-review twice)*
*Live vs repo: diverged — `team-onboarding` branch is fully pushed but **not merged** (PR #2 open against `main`); `functions/api/pbs-episodes.js` exists only in the local working tree on `main`, uncommitted, not deployed anywhere*

## Current state

`vpm-widgets` is still served from GitHub Pages (`mhdesigns98.github.io`, personal account, no custom domain). Two widgets (`pbs-show-playlist`, `virginia-home-grown-playlist`) are deployed as **iframes pointing straight at that URL** — their entire hosting depends on it, not just an asset link. The repo's onboarding work (shared skill + 4 slash commands + docs) is done and pushed to `team-onboarding`, PR #2 open, not yet merged. Separately, we scoped moving the three VPM Cloudflare projects (`pbs-api`, `newsletter-signup`, `chartbeat-weekly`) plus this repo's hosting to a *different* Cloudflare account than the one they're on now — because `vpm.org`'s DNS got moved to a new account during the WordPress migration, and Mark just got access to it.

## Decisions made (and why)

- **Custom domain on Cloudflare Pages (`widgets.vpm.org`), not a GitHub org transfer, comes first.** The urgent risk is the live iframe widgets depending on `mhdesigns98.github.io` — a GitHub Pages URL doesn't auto-redirect if the repo is ever transferred to an org, so those two widgets would go dark. Decoupling the *hosting URL* from GitHub account ownership fixes that immediately; the GitHub repo ownership question becomes a separate, lower-stakes cleanup.
- **The Pages project must be created in the account that owns the `vpm.org` DNS zone** (confirmed via Cloudflare's own docs — cross-account custom domains aren't supported without a manual-CNAME workaround that risks a 522). That's the *new*, Free-plan account Mark just got access to — not the older "VPM" account (`e017b19d2e3e1827adbd6f5907d81aac`) that already hosts `chartbeat-weekly`/`newsletter-signup`/`pbs-api`. Confirmed Free plan is not a blocker for this (100 custom domains/project, 500 builds/mo, 20k files — all far above what this needs).
- **One subdomain per independently-deployed codebase, not one for everything.** Landed on three (`widgets.vpm.org`, `newsletter.vpm.org`, `chartbeat.vpm.org`), not four, because `pbs-api` specifically folds into `vpm-widgets` rather than getting its own.
- **`pbs-api` folds into `vpm-widgets` as a Cloudflare Pages Function**, not migrated as its own Worker — it's stateless (no D1/KV), and its only callers are the two widgets in this repo. `newsletter-signup` stays separate — different repo, different secrets (Turnstile, Mailchimp), independent deploy cadence; merging it would couple two independently-changing codebases just to save one subdomain.
- **`chartbeat-weekly` stays fully separate** — different audience (internal staff dashboard vs. public embeds), and it's the one project with real state: an accumulating D1 database that needs an actual export/import, not just a redeploy.

## In progress / next steps

- [ ] Confirm access to the new (Free-plan) Cloudflare account works, then create a Pages project for `vpm-widgets` there
- [ ] Add `widgets.vpm.org` via that Pages project's **Custom domains** tab — not the DNS tab directly (manual CNAME first = 522 error)
- [ ] Set `PBS_API_KEY` / `PBS_API_SECRET` as Pages secrets (`wrangler pages secret put <NAME> --project-name=vpm-widgets`)
- [ ] Confirm `GET widgets.vpm.org/api/pbs-episodes?show-id=...` returns real data
- [ ] Update the 4 hardcoded `pbs-api.vpm-e01.workers.dev` references once verified: `widgets/pbs-show-playlist/index.html:254`, `widgets/pbs-show-playlist/README.md:33,35,36`, `widgets/virginia-home-grown-playlist/index.html:260`, `widgets/virginia-home-grown-playlist/README.md:38-39`
- [ ] Retire the old `pbs-api` Worker (`~/Projects/vpm/pbs-api/`) once cutover is confirmed
- [ ] Commit `functions/api/pbs-episodes.js` (currently untracked on `main`)
- [ ] Merge PR #2 — ideally after a dry-run by someone other than Mark (new hire or existing teammate) walks clone → `claude` → `/brief` → `/new-widget` → `/ship-widget` end to end
- [ ] Same custom-domain treatment for `newsletter-signup` (`newsletter.vpm.org`) and `chartbeat-weekly` (`chartbeat.vpm.org`), including chartbeat's D1 export/import and its 5-way cron trigger recreation
- [ ] Update the Tier-3 doc-only `mhdesigns98.github.io` references in both `vpm-widgets` and `vpm-pages` (README/CLAUDE.md/index.html footers) — not urgent, just dead links until fixed

## Gotchas / things that will bite you

- The two iframe widgets' READMEs also document a `postMessage` origin check (`e.origin !== "https://mhdesigns98.github.io"`) that's pasted directly into the **live Brightspot page**, outside any repo — grep can't find that. Confirm what's actually live in the CMS before any domain cutover.
- Cloudflare Pages custom domains require the Pages project and the DNS zone to be in the *same* account — don't create the project in the old "VPM" account by habit.
- `functions/api/pbs-episodes.js` first draft had an unvalidated `page-size` param (non-numeric → `NaN` forwarded to PBS) — Codex caught it, now fixed. Left as-is, matching the original Worker's behavior: no `show-id` format validation, wildcard CORS, `cache.put()` failures aren't caught, missing secrets fail as an opaque upstream error rather than a clear config error. Worth hardening later, not blocking.
- Multi-model review notes: Codex ran clean. Gemini hit a 429 quota error, no review. Ollama (`qwen2.5-coder:7b`) described the code instead of critiquing it, twice, even after a sharper retry — treat as no usable review.
- The `.claude/commands/*.md` files only exist on `team-onboarding` — merging `main` today does not include them yet.

## Key files

- `~/Projects/vpm/vpm-widgets` — repo root; `team-onboarding` branch has the onboarding work (PR #2), `main` has the uncommitted `pbs-episodes.js` draft
- `.claude/commands/{brief,new-widget,ship-widget,save-component}.md` — repo-relative slash commands (`team-onboarding` only)
- `CONTRIBUTING.md`, `README.md` — onboarding docs (`team-onboarding`)
- `functions/api/pbs-episodes.js` — Pages Function draft, uncommitted on `main`
- `~/Projects/vpm/pbs-api/` — the standalone Worker this replaces; keep until cutover confirmed
- `~/Projects/vpm/chartbeat-weekly/wrangler.jsonc`, `~/Projects/vpm/newsletter-signup/wrangler.jsonc` — the other two projects queued for the same migration

## Session log

- 2026-09-04: Filled the gap in an already-in-flight onboarding branch (PR #2): added the missing `.claude/commands/*.md` (rewritten to repo-relative paths, de-personalized `/brief`), a commands table + first-widget walkthrough in `CONTRIBUTING.md`, a prerequisites line in `README.md`. Pushed, opened PR #2. Found the live-production risk in the two iframe-embedded PBS widgets. Confirmed Cloudflare Pages custom domains need same-account DNS. Discovered `vpm.org`'s DNS moved to a different (Free-plan) Cloudflare account during the WordPress migration; confirmed Free plan isn't a blocker. Scoped the `pbs-api`/`newsletter-signup`/`chartbeat-weekly` migration; decided to fold `pbs-api` into this repo as a Pages Function instead of migrating it separately. Drafted `functions/api/pbs-episodes.js`, ran a multi-model review, fixed the one real bug it found.
