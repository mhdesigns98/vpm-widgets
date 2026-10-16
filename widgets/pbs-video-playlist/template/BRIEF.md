# PBS Show Playlist — Brief
*Written: 2026-08-28*

## Problem / Why
VPM manually swaps video code on show pages like Virginia Home Grown week to week. This is maintenance overhead and creates lag between when new episodes air on PBS and when they appear on the site. An API-driven playlist widget pulls the latest episodes automatically.

## User moment
A Virginia Home Grown viewer lands on the show page after watching an episode on TV or seeing a social post. They want to watch that episode (or the latest one) and browse recent episodes they may have missed — without leaving the page.

## What done looks like
- Widget is live on the vpm.org Virginia Home Grown show page
- Latest episode loads automatically as the main player on page load
- 4–5 episode thumbnails (title + thumbnail image) are shown below or beside the player
- Clicking a thumbnail swaps it into the main player
- When an episode ends, the next episode autoplays
- New episodes appear automatically within a reasonable cache window (no code change needed)

## Out of scope (v1)
- Season filtering or navigation
- Shows other than Virginia Home Grown (duplicate widget handles other shows)
- Search or keyword filtering
- Watch history or resume playback
- Full episode archive / pagination beyond 5 most recent

## Deploy target & constraints
WordPress iframe embed on vpm.org show page. Widget HTML hosted on the Widget Lab (GitHub Pages). A new VPM Cloudflare Worker proxies the PBS Media Manager API (credentials in Worker env vars, never client-side). 1-hour cache TTL on the Worker is acceptable.

## Content source & maintenance
PBS Media Manager API, proxied through a new VPM Cloudflare Worker. Episode list updates automatically within the 1-hour cache window. No manual maintenance after launch.

## Open questions
- PBS Media Manager API credentials — Mark is obtaining these (needed before Worker can be deployed and tested)
- Virginia Home Grown show ID / slug in the PBS system — Mark is obtaining this (needed before widget can point at real data; will be hardcoded per-widget instance so other shows get duplicate widgets with their own show ID)
