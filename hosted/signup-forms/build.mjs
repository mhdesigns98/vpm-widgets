// Generates public/<slug>/<variant>.html from each signup widget's index.html, so the
// widget folder stays the single source of truth. Run: npm run build
import { readFileSync, writeFileSync, copyFileSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const widgets = join(here, '..', '..', 'widgets');
const out = join(here, 'public');

const FORMS = [
  { slug: 'morning-monitor-signup', prefix: 'vpm-mm' },
  { slug: 'virginia-home-grown-signup', prefix: 'vpm-vhg' },
  { slug: 'weekly-update-signup', prefix: 'vpm-wu' },
];
const VARIANTS = ['full', 'inline', 'sidebar'];

// Iframe-only additions: transparent page, room for the card shadow, and a resizer that
// reports the content height to the parent (the host listens for 'vpm-embed-resize').
const HOSTED_CSS = `<style>
  html, body { background: transparent; }
  body { padding: 8px 8px 28px; }
  .PFX__section-label { display: none; }
</style>`;
const RESIZER = `<script>
(function () {
  var last = 0;
  function send() {
    var h = document.documentElement.getBoundingClientRect().height;
    h = Math.ceil(h);
    if (h === last) return;
    last = h;
    parent.postMessage({ type: 'vpm-embed-resize', height: h }, '*');
  }
  if ('ResizeObserver' in window) new ResizeObserver(send).observe(document.body);
  window.addEventListener('load', send);
  window.addEventListener('resize', send);
  send();
})();
</script>`;

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
copyFileSync(join(here, '_headers'), join(out, '_headers'));

for (const { slug, prefix } of FORMS) {
  const src = readFileSync(join(widgets, slug, 'index.html'), 'utf8');
  const label = new RegExp(`<div class="${prefix}__section-label">[^<]*</div>\\n`, 'g');
  const marks = [...src.matchAll(label)];
  if (marks.length !== VARIANTS.length) throw new Error(`${slug}: expected 3 section labels, found ${marks.length}`);
  const tailStart = src.indexOf('\n<!--', marks[2].index);
  if (tailStart < 0) throw new Error(`${slug}: no trailing comment marker`);

  const head = src.slice(0, marks[0].index).replace('</head>', `${HOSTED_CSS.replaceAll('PFX', prefix)}\n</head>`);
  const tail = src.slice(tailStart).replace('</body>', `${RESIZER}\n</body>`);

  mkdirSync(join(out, slug), { recursive: true });
  VARIANTS.forEach((variant, i) => {
    const end = i < 2 ? marks[i + 1].index : tailStart;
    const block = src.slice(marks[i].index + marks[i][0].length, end);
    writeFileSync(join(out, slug, `${variant}.html`), head + block + tail);
  });
  console.log(`${slug}: ${VARIANTS.join(', ')}`);
}

// Embed cheat sheet at the site root.
const rows = FORMS.flatMap(({ slug }) => VARIANTS.map((v) => `${slug}/${v}.html`));
const snippet = (p) => `&lt;iframe src="https://SIGNUP-HOST/${p}" title="Newsletter signup" loading="lazy" style="width:100%;border:0;height:230px"&gt;&lt;/iframe&gt;`;
writeFileSync(join(out, 'index.html'), `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>VPM signup forms (hosted)</title>
<style>body{font:16px/1.5 system-ui,sans-serif;max-width:52rem;margin:2rem auto;padding:0 1rem;color:#101820}code,pre{font-size:13px;background:#f2f4f5;padding:2px 4px;overflow-x:auto}pre{padding:12px;display:block}li{margin:.75rem 0}</style></head>
<body><h1>VPM signup forms (hosted)</h1>
<p>Iframe embeds. Replace <code>SIGNUP-HOST</code> with this site's domain. Add the resizer once per host page (see README).</p>
<ul>${rows.map((p) => `<li><a href="${p}">${p}</a><pre>${snippet(p)}</pre></li>`).join('')}</ul></body></html>
`);
