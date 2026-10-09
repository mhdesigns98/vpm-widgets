# VPM News Voter Guide 2026 — WordPress Build

ACF Pro flexible-content page template. See `../BRIEF.md` for scope decisions.

## Requirements

- ACF Pro (flexible content field is a Pro feature)
- An "Elections" category on the site (used by the Latest Coverage feed and hero fallback)

## File placement

Copy into your active theme (or child theme):

```
your-theme/
├── functions.php                     ← merge in functions-snippet.php
├── inc/
│   └── voter-guide-data.php
├── page-templates/
│   └── template-voter-guide.php
├── template-parts/
│   └── voter-guide/
│       ├── section-hero.php
│       ├── section-video-coverage.php
│       ├── section-latest-coverage.php
│       ├── section-key-races.php
│       ├── section-regional-races.php
│       ├── section-voter-resources.php
│       ├── section-election-results.php
│       ├── section-faq.php
│       └── section-newsletter.php
├── assets/
│   ├── voter-guide.css
│   └── voter-guide.js
└── acf-json/
    └── acf-field-group-voter-guide.json   ← ACF Local JSON auto-loads from here
```

If your theme already has `inc/`, `assets/`, or `acf-json/` folders in use, just add these files alongside what's there — don't overwrite.

## Setup steps

1. Copy the files per the tree above.
2. Add the contents of `functions-snippet.php` to your theme's `functions.php`.
3. Confirm ACF Pro is active and picks up the field group — it should appear as **"Voter Guide 2026 — Page Sections"** under Custom Fields once the `acf-json` load point is registered (it auto-imports from Local JSON; no manual import needed as long as the file sits in `acf-json/`).
4. Create a new WordPress page (e.g. "Voter Guide"), set its **Template** to **"Voter Guide 2026"** in the Page Attributes panel.
5. Use the **Page Sections** flexible-content field to add sections in order: Hero, Video Coverage, Latest Coverage, Key Virginia Elections, Key Regional Races, Voter Resources Bar, Election Results, Voting FAQ, Newsletter Signup.
6. Fill in the editable fields per section (hero copy, featured video URLs, newsletter form action, etc).
7. Publish and preview.

## What's editable vs. hardcoded

- **Editable in wp-admin**: hero copy + featured stories, video URLs, which category feeds "Latest Coverage" and how many posts, section titles/subtitles, voter resource links, newsletter copy + form action.
- **Hardcoded in `inc/voter-guide-data.php`**: key races, regional races, important dates, election results, FAQ. Per the project brief, these are dev-maintained — update the file and redeploy when the data changes.

## Election results

Ships with placeholder data shaped to match the AP Elections API v3 response (see `vpm_vg_election_results()` in the data file). The results section always renders — no election-week auto-show window, no admin on/off toggle (that control from the original mockup was intentionally dropped). To go live later, replace the function body with a real AP fetch, keeping the same array shape so the template needs no changes.

## Not included here

- Brightspot version (separate build phase, not part of this WordPress delivery)
- Live AP Elections API integration
