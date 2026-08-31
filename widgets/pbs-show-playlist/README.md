# PBS Show Playlist

API-driven video playlist widget for a PBS show. Loads the 5 most recent episodes from the PBS Media Manager API (via a VPM Cloudflare Worker proxy), renders them in a thumbnail strip, and plays the selected episode in an embedded PBS partner player. Autoplays the next episode on completion.

**Deploy target:** WordPress iframe embed on the vpm.org show page (hosted on Widget Lab / GitHub Pages).

## Usage

Embed as an iframe in WordPress. An iframe has no natural aspect ratio to size
itself by, so the widget posts its real content height to the parent page —
paste both the iframe and the small listener script together in the ACF code
block:
```html
<iframe src="https://mhdesigns98.github.io/vpm-widgets/widgets/pbs-show-playlist/" width="100%" height="500" style="border:0;display:block;" title="Virginia Home Grown Episodes"></iframe>
<script>
(function () {
  window.addEventListener("message", function (e) {
    if (!e.data || typeof e.data.vpmPspHeight !== "number") return;
    document.querySelectorAll('iframe[src*="pbs-show-playlist"]').forEach(function (f) {
      if (f.contentWindow === e.source) f.style.height = e.data.vpmPspHeight + "px";
    });
  });
})();
</script>
```
The `height="500"` is just a reasonable placeholder shown before the first resize message arrives — the script immediately replaces it with the widget's real height.

For a different show, duplicate this widget folder and update `SHOW_ID` at the top of `index.html`.

## Cloudflare Worker

Live at `https://pbs-api.vpm-e01.workers.dev` (source: `~/Projects/vpm/pbs-api/`). It:

1. Accepts `GET /episodes?show-id={id}&page-size={n}`
2. Forwards to `https://media.services.pbs.org/api/v1/assets/?show-id={id}&type=full_length&page-size={n}&sort=-encored_on` with HTTP Basic Auth (`PBS_API_KEY:PBS_API_SECRET`)
3. Returns the raw PBS JSON response
4. Sets `Cache-Control: public, max-age=3600` and a permissive CORS header (`Access-Control-Allow-Origin: *`)

Credentials are stored as CF Worker secrets, never hard-coded.

## Config values to update

In `index.html`:
- `SHOW_ID` — PBS Media Manager show ID for the target show
- `WORKER_URL` — CF Worker URL once deployed
