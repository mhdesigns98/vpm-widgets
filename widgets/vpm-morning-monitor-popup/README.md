# Morning Monitor signup popup

Interstitial newsletter signup for VPM News Morning Monitor. Two-panel dialog — light-blue panel
with a dark-blue pill-oval decoration, Morning Monitor lockup, and tagline on the left; email form
on the right. Becomes a bottom sheet on mobile.

Copy as built: "Start Your Day with Virginia's Top Stories" (sentence case) / "News from across the
Commonwealth every weekday morning." / button "KEEP ME INFORMED" / privacy line "We respect your
privacy. Your information will never be sold. Unsubscribe at any time."

**This is not a CMS block, and this file is a reference copy, not the deploy source.** The real
popup is hosted on Cloudflare Pages at `newsletter-signup/public/assets/morning-monitor-popup.js`
and loaded into WordPress via a one-line `<script src>` tag in a header/footer snippet plugin — it
shows itself based on visitor behavior rather than being pasted anywhere. That makes it the one
widget in the Lab whose correctness depends on *when* it appears, not just how it looks, and the
one whose actual deploy step is a `wrangler pages deploy`, not a CMS paste.

**Keep this copy in sync manually.** It drifted silently for weeks (Brightspot-era JSONP
submission, different layout, hardcoded logo URL) before being resynced 2026-09-16. There's no
build step tying the two together — if the real script changes, this file goes stale again unless
someone copies the change over.

## Format

Single file — `index.html`. `test.html` is a local trigger harness for firing the popup on demand
instead of waiting out the real timers. (`test.html` predates the 2026-09-16 resync — verify it
still matches before relying on it.)

## Trigger logic

Three independent triggers, whichever fires first:

- **Time** — 35s on page
- **Scroll** — an upward scroll after 10s on page
- **Exit intent** — pointer leaves the top of the viewport (desktop only)

Suppression is `localStorage`-backed with two cooldowns: 7 days after a dismissal, 30 days after a
successful signup. Verify the cooldown by clearing site data, not by reloading — a reload alone
won't re-show it.

## Design tokens

Brand colors are inlined as CSS custom properties on `:host` (scoped to the shadow root, since a
shadow-DOM widget can't link `tokens.css` externally) — no hard-coded hex in the component styles.
Two colors from the original Figma comp (`#C1E2FF` panel background, `#0952A2` pill oval) don't
exist in `tokens.css`'s palette; they're mapped to the nearest real tokens (`--vpm-blue-100`,
`--vpm-blue-600`) rather than kept as one-off values, which is a small, deliberate shift from pixel
parity with the original comp.

## Namespace

No class prefix. The whole dialog lives in Shadow DOM, and internal hooks are plain ids (`host`,
`backdrop`, `modal`, `panel-left`, `panel-right`, `close-btn`, `email-input`, `submit-btn`). Those
ids are shadow-scoped, so they can't collide with host-page ids — but that also means the Lab's
duplicate-id audit won't see them. Left un-namespaced deliberately (2026-09-16): shadow DOM already
provides the isolation the namespacing convention exists for, so a rename would be pure churn.

## Submission

Posts to the `newsletter-signup` CF Pages Function (`/api/subscribe`), not directly to Mailchimp —
a prior JSONP-to-Mailchimp version was silently blocked by Firefox Enhanced Tracking Protection
(zero response, zero console error, indistinguishable from a code bug without checking the Network
tab). Requires a Cloudflare Turnstile token, rendered via explicit mode into the shadow-DOM
container (Turnstile's auto-render can't see into shadow roots). `dataLayer.push()` events fire on
show and submit (`mm_popup_view`, `mm_popup_conversion`).

**Turnstile double-load coordination:** this popup and the WordPress sidebar signup widget
(`#custom_html-6`, article pages) can both try to load Turnstile's `api.js` on the same page. A
shared `window.__turnstileLoading` queue (set the instant either loader starts) makes the second
consumer wait instead of injecting a second script tag — Turnstile doesn't support loading twice on
one page and throws error 110200 if it happens. Fixed and confirmed live 2026-09-16.

## Customization points

- **Copy** — headline, tagline, button label, privacy line, all inline
- **Logo** — hosted on GitHub Pages (`morning-monitor-signup` widget's `assets/` folder)
- **Timings and cooldowns** — the three trigger thresholds and both cooldown windows are constants
  near the top of the script

## Gotchas

- **Focus trap and restoration** are implemented by hand; Escape closes. Re-test both after any
  markup change, since a broken trap on a modal is a WCAG failure, not a cosmetic bug.
- **Exit intent is desktop-only** by design. On mobile only the time and scroll triggers can fire.
- **Two popups are one too many.** Confirm no other interstitial is live on the same pages.
- **Click handling confirmed working on WordPress** (2026-09-15) — the window-capture click
  listener (`composedPath()`-based, for shadow DOM targets) was built defensively against a prior
  CMS's analytics script calling `stopPropagation()`. Close, backdrop, Escape, and submit all
  confirmed working on the WordPress theme.
- **Turnstile hostname allowlist must include the real deploy domain, exactly spelled.** A dashboard
  typo (`www.vpm.og` instead of `www.vpm.org`) caused error 110200 in production for about a day
  before being caught (2026-09-16) — Turnstile's error for "domain not allowed" gives no indication
  it's a spelling issue. Check `wrangler turnstile widget list --json` directly rather than trusting
  a doc's copy of the allowlist if 110200 ever recurs.
- **`prefers-reduced-motion` is respected** (added 2026-09-16) — the mobile slide-up entrance and
  the submit-button loading spinner both disable under the reduced-motion media query.

## Pre-ship status

Ran through `/ship-widget`'s harness, accessibility pass, and convention audit 2026-09-16 — see
that session's report for the scenario-by-scenario results. The harness only partly applies here —
it injects widgets into page slots, and this one injects itself — so trigger and cooldown behavior
still needs periodic re-verification against a real page via `test.html` and cleared site data.
