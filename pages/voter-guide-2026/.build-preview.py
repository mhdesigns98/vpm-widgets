#!/usr/bin/env python3
"""Regenerate preview.html from sections/, in the order sections/PASTE-ORDER.md gives.

Run after editing any fragment or the paste order. This is the "concatenate the fragments in
paste order" check PASTE-ORDER.md describes, kept as a file so the page can be previewed (and
shared) as it will actually be pasted, rather than via the older demo/.

Stand-ins, which are preview only and never pasted:
  - the live Article List block, as the markup PASTE-ORDER.md documents for it, so the
    LIVE BLOCK OVERRIDES in header-section.html style it the way they style the real one;
  - the 970x90 leaderboard row between blocks 3 and 4.
The two 300px ads sit in 2-column builder rows beside blocks 1 and 4; they're left out.
"""
import pathlib
import re
import sys

d = pathlib.Path(__file__).parent
sections = d / 'sections'
order_md = (sections / 'PASTE-ORDER.md').read_text(encoding='utf-8')

# Rows of the "Paste order" table: | # | Block | File |, where File is `x.html` or "—".
rows = re.findall(r'^\|\s*(\d+)\s*\|(.*?)\|\s*(`[^`]+\.html`|—[^|]*)\s*\|\s*$', order_md, re.M)
if not rows:
    sys.exit('No paste-order rows found in sections/PASTE-ORDER.md -- has the table format changed?')

LIVE_BLOCK = '\n'.join([
    '<!-- PREVIEW STAND-IN (not pasted): live CMS Article List block, Featured Stories -->',
    '<section class="page-article-grid cols-3">',
    '  <div class="container">',
    '    <div class="page-article-grid-inner">',
] + [f'''      <article class="page-article-card PromoA">
        <div class="page-article-card-media"><a class="bsm-img-ph" href="#" aria-label="Placeholder story {n}"></a></div>
        <div class="page-article-category">{cat}</div>
        <h3 class="page-article-title"><a href="#">Placeholder headline for a featured election story</a></h3>
        <div class="page-article-byline">Reporter Name</div>
        <p class="page-article-excerpt">Excerpt text; hidden by the page CSS.</p>
      </article>''' for n, cat in ((1, 'Elections'), (2, 'Politics'), (3, 'Government'))] + [
    '    </div>',
    '  </div>',
    '</section>',
])

LEADERBOARD = ('<!-- PREVIEW STAND-IN (not pasted): 970x90 leaderboard, its own builder row -->\n'
               '<div class="preview-ad"><span>Ad · 970×90 leaderboard (separate builder row)</span></div>')

parts = []
for num, block, file in rows:
    if file.startswith('`'):
        name = file.strip('`')
        path = sections / name
        if not path.exists():
            sys.exit(f'PASTE-ORDER.md row {num} names {name}, which is not in sections/')
        parts.append(f'<!-- ===== Block {num}: {name} ===== -->\n' + path.read_text(encoding='utf-8'))
    elif 'Article List' in block:
        parts.append(f'<!-- ===== Block {num}: live Article List (stand-in) ===== -->\n' + LIVE_BLOCK)
    else:
        sys.exit(f'PASTE-ORDER.md row {num} has no file and is not the Article List; update this script')
    if num == '3':
        parts.append(LEADERBOARD)

CHROME = """
/* ---- Preview chrome only. Approximates the theme the fragments ship into (16px root, the
       theme's fonts, its .container). Not part of the paste. ---- */
html { font-size: 16px; }
/* White like the theme, so a gap at a seam between blocks shows up as the white strip it
   would be on the live page. */
body { margin: 0; background: #fff; }
.container { max-width: 1240px; margin: 0 auto; padding: 0 20px; }
.preview-note {
  background: #E0E721;
  color: #101820;
  font: 600 13px/1.4 'Inter', 'Helvetica Neue', Arial, sans-serif;
  padding: 8px 20px;
  text-align: center;
}
.preview-ad {
  max-width: 970px;
  height: 90px;
  margin: 24px auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #B2B4B2;
  color: #5A6470;
  font: 12px 'Inter', 'Helvetica Neue', Arial, sans-serif;
  letter-spacing: 0.04em;
}
"""

out = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Preview — VPM News Voter Guide 2026</title>
<!-- GENERATED FILE — edit sections/*.html or sections/PASTE-ORDER.md, then run ./.build-preview.py -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>{CHROME}</style>
</head>
<body>

<div class="preview-note">Preview harness — sections pasted in PASTE-ORDER.md order. Featured Stories (a live CMS block) and the leaderboard ad are stand-ins; the two 300px ads are left out.</div>

{chr(10).join(parts)}

</body>
</html>
"""

(d / 'preview.html').write_text(out, encoding='utf-8')
print(f'wrote preview.html from {len(rows)} paste-order rows')
