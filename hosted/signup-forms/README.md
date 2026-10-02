# Hosted signup forms (Cloudflare Pages)

Iframe-embeddable versions of `morning-monitor-signup`, `virginia-home-grown-signup` and
`weekly-update-signup`, one page per layout: `<slug>/full.html`, `inline.html`, `sidebar.html`.

**The widget folders stay the source.** `build.mjs` slices each widget's `index.html` into
per-variant pages, so a copy fix in the widget plus `npm run deploy` updates every embed. Never
edit `public/<slug>/` by hand: it is regenerated. (Hand-written: `_headers` at the project root, copied in by the build.)

## Deploy
```
npm run build      # generate public/
npm run dev        # local preview via wrangler
npm run deploy     # Pages project vpm-signup-forms, VPM account
```

## Embed
```html
<iframe src="https://SIGNUP-HOST/morning-monitor-signup/inline.html"
        title="Morning Monitor newsletter signup" loading="lazy"
        style="width:100%;border:0;height:230px"></iframe>
```
Height auto-fit (once per host page, guarded so a re-render can't add it twice):
```html
<script>
if (!window.__vpmEmbedResize) {
  window.__vpmEmbedResize = true;
  addEventListener('message', function (e) {
    if (!e.data || e.data.type !== 'vpm-embed-resize') return;
    document.querySelectorAll('iframe[src*="SIGNUP-HOST"]').forEach(function (f) {
      if (f.contentWindow === e.source) f.style.height = e.data.height + 'px';
    });
  });
}
</script>
```
Without the script the iframe keeps its fixed `height`; set it to fit the layout (about 230px full/inline at desktop width, 440px sidebar).

## Notes
- `_headers` limits framing to vpm.org and subdomains (`frame-ancestors`). Add the CMS preview
  domain there if a staging host needs it.
- Forms still POST to Mailchimp with `target="_blank"` as a no-JS fallback, so that path opens a tab.
- Images are absolute GitHub Pages URLs, so they resolve inside the iframe.
- Not a widget: this is deployment glue, so it has no row in `INDEX.md`.
