# Morning Monitor signup popup

Interstitial newsletter signup for VPM News Morning Monitor. Two-panel dialog — navy panel with the
Morning Monitor lockup on the left, email form on the right. Becomes a bottom sheet on mobile.

Copy as built: "Start Your Day with Virginia's Top Stories" / "News from across the commonwealth
every weekday morning." / button "Keep Me Informed" / privacy line "We respect your privacy. Your
information will never be sold. Unsubscribe at any time."

**This is not a CMS block.** It's deployed via GTM and shows itself based on visitor behavior.
That makes it the one widget in the Lab whose correctness depends on *when* it appears, not just
how it looks.

## Format

Single file — `index.html`. `test.html` is a local trigger harness for firing the popup on demand
instead of waiting out the real timers.

## Trigger logic

Three independent triggers, whichever fires first:

- **Time** — 35s on page
- **Scroll** — an upward scroll after 10s on page
- **Exit intent** — pointer leaves the top of the viewport (desktop only)

Suppression is `localStorage`-backed with two cooldowns: 7 days after a dismissal, 30 days after a
successful signup. Verify the cooldown by clearing site data, not by reloading — a reload alone
won't re-show it.

## Namespace

No class prefix. The whole dialog lives in Shadow DOM, and internal hooks are plain ids (`host`,
`backdrop`, `modal`, `panel-left`, `panel-right`, `close-btn`, `email-input`, `submit-btn`). Those
ids are shadow-scoped, so they can't collide with host-page ids — but that also means the Lab's
duplicate-id audit won't see them.

## Submission

Mailchimp JSONP to `vpm.us3.list-manage.com/subscribe/post-json`, with `u` / `id` / `f_id` / `tags`
/ `EMAIL` params — same pattern as the three inline signup widgets. Client-side email validation
before POST. GTM events fire on show, dismiss, and submit.

## Customization points

- **Copy** — headline, subhead, button label, privacy line, all inline
- **Logo** — `assets.vpm.org` (`vpm-mm-logo-web-rev.png`)
- **Mailchimp `tags`** — set the audience tag here, not in Mailchimp, if this popup's signups need
  to be attributable separately from the inline embeds
- **Timings and cooldowns** — the three trigger thresholds and both cooldown windows are constants
  near the top of the script

## Gotchas

- **It deliberately disables the Brightspot player overlay's `pointer-events` while open**, then
  restores them on close. If a future player change breaks that restore, the page is left with a
  dead stream player — check this after any player update.
- **Focus trap and restoration** are implemented by hand; Escape closes. Re-test both after any
  markup change, since a broken trap on a modal is a WCAG failure, not a cosmetic bug.
- **Exit intent is desktop-only** by design. On mobile only the time and scroll triggers can fire.
- **Two popups are one too many.** Confirm no other interstitial is live on the same pages.

## Pre-ship status

Not yet run through `/ship-widget`. The harness only partly applies here — it injects widgets into
page slots, and this one injects itself — so the trigger and cooldown behavior needs verifying
against a real page via `test.html` and cleared site data.
