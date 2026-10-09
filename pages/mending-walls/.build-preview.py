#!/usr/bin/env python3
"""Regenerate preview.html from html.html + css.css + js.js. Run after editing any of them."""
import pathlib
d = pathlib.Path(__file__).parent
html = (d / 'html.html').read_text(encoding='utf-8')
css = (d / 'css.css').read_text(encoding='utf-8')
js = (d / 'js.js').read_text(encoding='utf-8')

CHROME = """
/* ---- Preview chrome only. Approximates wpp-base so the block is judged
       in the conditions it will actually ship into. Not part of the paste. ---- */
html { font-size: 16px; }
body {
  margin: 0;
  font-family: 'Public Sans', 'Helvetica Neue', Arial, sans-serif;
  color: #101820;
  background: #fff;
  line-height: 1.6;
  font-size: 16px;
}
.preview-hero {
  background: linear-gradient(100deg, #101820 0%, #003865 100%);
  color: #fff;
  padding: 56px 0;
}
.preview-hero h1 {
  font-family: 'Oswald', 'Arial Narrow', Arial, sans-serif;
  font-size: 40px;
  line-height: 1.1;
  margin: 0;
}
.preview-hero .container::before {
  content: "";
  display: block;
  width: 44px;
  height: 4px;
  background: #E0E721;
  margin-bottom: 20px;
}
.preview-note {
  background: #E0E721;
  color: #101820;
  font-size: 13px;
  padding: 8px 0;
  text-align: center;
  font-weight: 600;
}
.container { max-width: 1240px; margin: 0 auto; padding: 0 20px; }
.page-code-block { padding: 20px 0 60px; background: #fff; }
"""

out = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Preview — Mending Walls</title>
<!-- GENERATED FILE — edit html.html / css.css / js.js, then run ./.build-preview.py -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600;700&family=Oswald:wght@500;600;700&display=swap" rel="stylesheet">
<style>{CHROME}</style>
<style>
{css}</style>
</head>
<body>

<div class="preview-note">Preview harness — hero, container and 16px root simulate the wpp-base theme. Neither is part of the ACF paste.</div>

<section class="preview-hero">
  <div class="container">
    <h1>Mending Walls</h1>
  </div>
</section>

<section class="page-code-block">
  <div class="container">
{html}
  </div>
</section>

<script>
{js}</script>
</body>
</html>
"""
(d / 'preview.html').write_text(out, encoding='utf-8')
print('wrote preview.html', len(out), 'bytes')
