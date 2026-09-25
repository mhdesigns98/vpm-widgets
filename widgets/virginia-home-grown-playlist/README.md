# Virginia Home Grown Playlist

Same widget as `pbs-show-playlist` — API-driven video playlist loading the 5 most recent
episodes from the PBS Media Manager API (via the shared `pbs-api` Cloudflare Worker proxy),
rendered as a thumbnail strip with an embedded PBS partner player, autoplay to next episode
on completion — but restyled to Virginia Home Grown's green sub-brand (`--vhg-green` /
`--vhg-green-dark`, leaf-pattern background, `.vpm-vhgp__*` namespace) at the Show Producer's
request. This widget **replaces** `pbs-show-playlist` on the live Virginia Home Grown show
page; `pbs-show-playlist` remains the generic template other PBS shows duplicate from.

**Deploy target:** WordPress iframe embed on the vpm.org Virginia Home Grown show page
(hosted on Widget Lab / GitHub Pages).

## Usage

Embed as an iframe in WordPress. An iframe has no natural aspect ratio to size
itself by, so the widget posts its real content height to the parent page —
paste both the iframe and the small listener script together in the ACF code
block:
```html
<iframe src="https://mhdesigns98.github.io/vpm-widgets/widgets/virginia-home-grown-playlist/" width="100%" height="500" style="border:0;display:block;" title="Virginia Home Grown Episodes"></iframe>
<script>
(function () {
  window.addEventListener("message", function (e) {
    if (e.origin !== "https://mhdesigns98.github.io") return;
    if (!e.data || typeof e.data.vpmVhgpHeight !== "number") return;
    document.querySelectorAll('iframe[src*="virginia-home-grown-playlist"]').forEach(function (f) {
      if (f.contentWindow === e.source) f.style.height = e.data.vpmVhgpHeight + "px";
    });
  });
})();
</script>
```
The `height="500"` is just a reasonable placeholder shown before the first resize message arrives — the script immediately replaces it with the widget's real height.

## Cloudflare Worker

Shares the same Worker as `pbs-show-playlist`, live at `https://pbs-api.vpm-e01.workers.dev`
(source: `~/Projects/vpm/pbs-api/`) — see that widget's README for the Worker's request/response
details. No Worker changes needed for this rebrand.

## Config values to update

In `index.html`:
- `SHOW_ID` — PBS Media Manager show ID (already set to Virginia Home Grown's)
- `WORKER_URL` — CF Worker URL (shared, already set)

## Brand assets

`assets/leaf-pattern.svg` — copied from `virginia-home-grown-signup/assets/`, kept local to this
widget's own folder rather than referenced cross-folder, so this widget stays self-contained.
