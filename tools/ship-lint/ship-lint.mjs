#!/usr/bin/env node
// ship-lint: the mechanical half of /ship. Reads a build's pasted files and checks the
// SHIP-CHECKLIST.md items that need no browser. /ship runs it first, then does the
// judgment and browser checks. Usage and the check list: tools/ship-lint/README.md.
//
//   node tools/ship-lint/ship-lint.mjs <slug|path> [--prefix vpm-x-] [--json]
//
// Exit 0 = no fails (warns are leads for /ship to check by hand), 1 = fails, 2 = usage error.

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

// ---------- args ----------

const args = process.argv.slice(2);
const json = args.includes('--json');
const prefixArg = args.includes('--prefix') ? args[args.indexOf('--prefix') + 1] : null;
const target = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--prefix');

if (!target) {
  console.error('Usage: node tools/ship-lint/ship-lint.mjs <slug|path> [--prefix vpm-x-] [--json]');
  process.exit(2);
}

function locate(t) {
  const direct = resolve(ROOT, t);
  if (existsSync(direct) && statSync(direct).isDirectory() && /\/(widgets|pages)\//.test(direct + '/')) return direct;
  const hits = ['widgets', 'pages'].map((k) => join(ROOT, k, t)).filter((p) => existsSync(p));
  if (hits.length === 1) return hits[0];
  if (hits.length > 1) fatal(`"${t}" exists under both widgets/ and pages/; pass the path instead.`);
  fatal(`No widgets/${t}/ or pages/${t}/.`);
}

function fatal(msg) {
  console.error(`ship-lint: ${msg}`);
  process.exit(2);
}

const dir = locate(target);
const rel = relative(ROOT, dir);
const kind = rel.startsWith('pages/') ? 'page' : 'widget';
const read = (p) => readFileSync(p, 'utf8');
const readme = existsSync(join(dir, 'README.md')) ? read(join(dir, 'README.md')) : '';

// ---------- which files get pasted ----------

let shape;
let files;
if (/^#.*\((merged|moved)\)/.test(readme.split('\n')[0])) {
  if (json) console.log(JSON.stringify({ build: rel, kind, shape: 'stub', prefixes: [], files: [], checks: {}, findings: [] }, null, 2));
  else console.log(`ship-lint ${rel}: stub folder (README title says merged/moved); nothing is pasted from it.`);
  process.exit(0);
}
// ACF split: html.html, or several html-*.html fields (impact-report-2025).
const htmlFields = readdirSync(dir).filter((f) => /^html(-[\w-]+)?\.html$/.test(f));
if (htmlFields.length) {
  shape = 'acf-split';
  files = readdirSync(dir).filter((f) => htmlFields.includes(f) || f === 'js.js' || f.endsWith('.css'));
} else if (existsSync(join(dir, 'sections'))) {
  shape = 'sections';
  files = readdirSync(join(dir, 'sections')).filter((f) => f.endsWith('.html')).map((f) => `sections/${f}`);
} else if (existsSync(join(dir, 'index.html'))) {
  shape = 'single';
  files = ['index.html'];
} else {
  fatal(`${rel} has no html.html, sections/ or index.html; nothing to check.`);
}
files.sort();
const subBuilds = readdirSync(dir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && !['sections', 'demo', 'reference', 'src', 'assets'].includes(d.name))
  .filter((d) => ['index.html', 'html.html'].some((f) => existsSync(join(dir, d.name, f))))
  .map((d) => `${rel}/${d.name}`);

// An iframe embed is pasted as an <iframe> pointing at the build, so the build is its own
// document: duplicate ids and page-wide queries can't collide with the host or a second copy.
const iframeEmbed = /iframe embed/i.test(readme);

// ---------- parsing ----------

// Blank out comments while keeping offsets, so findings keep their line numbers.
const blank = (s) => s.replace(/[^\n]/g, ' ');
const stripCssComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, blank);
const stripHtmlComments = (s) => s.replace(/<!--[\s\S]*?-->/g, blank);
const stripJsComments = (s) =>
  s.replace(/(^|[^:\\])\/\/[^\n]*/g, (m, p) => p + blank(m.slice(p.length))).replace(/\/\*[\s\S]*?\*\//g, blank);

const lineAt = (text, offset) => text.slice(0, offset).split('\n').length;

// Each source: { file, text (full file), kind: 'html'|'css'|'js', chunks: [{ code, start }] }
const sources = files.map((f) => {
  const text = read(join(dir, f));
  if (f.endsWith('.css')) return { file: f, text, css: [{ code: stripCssComments(text), start: 0 }], js: [], html: '' };
  if (f.endsWith('.js')) return { file: f, text, css: [], js: [{ code: stripJsComments(text), start: 0 }], html: '' };
  const html = stripHtmlComments(text);
  const css = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => ({
    code: stripCssComments(m[1]),
    start: m.index + m[0].indexOf('>') + 1,
  }));
  const js = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter((m) => !/\bsrc=/i.test(m[1]) && !/type=["']?(application\/(ld\+)?json|text\/template)/i.test(m[1]))
    .map((m) => ({ code: stripJsComments(m[2]), start: m.index + m[0].indexOf('>') + 1 }));
  // Markup with <style>/<script> bodies blanked, so tag scans don't match inside them.
  const markup = html.replace(/(<(style|script)\b[^>]*>)([\s\S]*?)(<\/\2>)/gi, (m, a, _t, body, b) => a + blank(body) + b);
  return { file: f, text, css, js, html: markup };
});

// Flat CSS rules: { selector, body, at (enclosing at-rules), offset (in file) }.
function cssRules(code, base) {
  const out = [];
  const walk = (s, from, to, at) => {
    let i = from;
    while (i < to) {
      const open = s.indexOf('{', i);
      if (open === -1 || open >= to) break;
      const head = s.slice(i, open);
      const semi = head.lastIndexOf(';'); // skip at-statements such as @import ...;
      const prelude = (semi === -1 ? head : head.slice(semi + 1)).trim();
      const preludeStart = semi === -1 ? i : i + semi + 1;
      let depth = 1;
      let j = open + 1;
      while (j < to && depth) {
        if (s[j] === '{') depth++;
        else if (s[j] === '}') depth--;
        j++;
      }
      const body = s.slice(open + 1, j - 1);
      if (prelude.startsWith('@')) {
        if (/^@(media|supports|container|layer)\b/i.test(prelude)) walk(s, open + 1, j - 1, [...at, prelude]);
        else out.push({ selector: null, body, at: [...at, prelude], offset: base + open + 1 });
      } else if (body.includes('{')) {
        // CSS nesting: treat the block's own declarations as one rule, then walk children.
        out.push({ selector: prelude, body: body.replace(/[^;{}]*\{[\s\S]*?\}/g, ''), at, offset: base + preludeStart });
        walk(s, open + 1, j - 1, at);
      } else {
        out.push({ selector: prelude, body, at, offset: base + preludeStart + (head.length - head.trimStart().length) });
      }
      i = j;
    }
  };
  walk(code, 0, code.length, []);
  return out;
}

const allRules = sources.flatMap((s) => s.css.flatMap((c) => cssRules(c.code, c.start).map((r) => ({ ...r, src: s }))));
const allCss = sources.flatMap((s) => s.css.map((c) => c.code)).join('\n');
const allJs = sources.flatMap((s) => s.js.map((c) => c.code)).join('\n');
const allMarkup = sources.map((s) => s.html).join('\n');

// ---------- findings ----------

const findings = [];
const add = (group, check, sev, src, offset, msg) =>
  findings.push({ group, check, sev, file: src ? `${rel}/${src.file}` : rel, line: src && offset != null ? lineAt(src.text, offset) : null, msg });
const ran = { core: [], widget: [], page: [] };
const run = (group, check) => ran[group].push(check);

// Namespace: --prefix wins, then the namespace INDEX.md gives this path, then every vpm-xxx class
// root the CSS uses. Roots drop the trailing dash so BEM blocks (.vpm-feedrail, .vpm-feedrail__x) match.
const index = existsSync(join(ROOT, 'INDEX.md')) ? read(join(ROOT, 'INDEX.md')) : '';
const indexRow = index.split('\n').find((l) => l.includes(`\`${rel}/\``) || l.includes(`\`${rel}\``)) || '';
const fromIndex = [...indexRow.matchAll(/namespace `(vpm-[a-z0-9-]+)`/g)].map((m) => m[1]);
const prefixes = (prefixArg ? [prefixArg] : fromIndex.length ? fromIndex : [...new Set([...allCss.matchAll(/\.(vpm-[a-z0-9]+)/g)].map((m) => m[1]))])
  .map((p) => p.replace(/-$/, ''));

// ===== Core =====

// Deliberate host overrides opt out of one check with a comment: `/* ship-lint: allow <check> */`
// covers the next rule; `/* ship-lint: allow <check> start */` … `/* ship-lint: end */` covers a run of
// rules. Allowed hits are reported as warns, so /ship still reviews them.
const allowed = (r, check) => {
  const before = r.src.text.slice(0, r.offset);
  const tail = before.slice(before.lastIndexOf('}') + 1);
  if (tail.includes(`ship-lint: allow ${check}`)) return true;
  const start = before.lastIndexOf(`ship-lint: allow ${check} start`);
  return start !== -1 && before.lastIndexOf('ship-lint: end') < start;
};
// Styles inside a shadow root can't reach the host page.
const shadow = /attachShadow\s*\(/.test(allJs);

run('core', 'unscoped-selector');
if (shadow || iframeEmbed) {
  // Shadow roots and iframe documents can't style the host page; nothing to check.
} else if (!prefixes.length) {
  add('core', 'unscoped-selector', 'fail', null, null, 'No vpm- namespace in the CSS or INDEX.md; every class needs a build-specific prefix (pass --prefix if it has one).');
} else {
  const esc = (p) => p.replace(/[-]/g, '\\-');
  const scoped = (sel) => prefixes.some((p) => new RegExp(`[.#"'=]${esc(p)}(?![a-z0-9])`).test(sel));
  for (const r of allRules) {
    if (!r.selector || r.at.some((a) => /^@(keyframes|font-face|page|property)/i.test(a))) continue;
    for (const raw of r.selector.split(',')) {
      const sel = raw.trim();
      if (!sel || sel.startsWith(':host') || /^(from|to|\d+%)$/.test(sel) || sel.startsWith('&')) continue;
      if (!scoped(sel) && allowed(r, 'unscoped-selector')) add('core', 'unscoped-selector', 'warn', r.src, r.offset, `\`${sel}\` is unscoped by design (ship-lint: allow); confirm it only reaches what it means to.`);
      else if (!scoped(sel)) add('core', 'unscoped-selector', 'fail', r.src, r.offset, `\`${sel}\` has no ${prefixes.join(' / ')} class; it will style the host page.`);
    }
  }
}

run('core', 'hex-outside-token');
run('core', 'rem-unit');
for (const r of allRules) {
  for (const m of r.body.matchAll(/([-\w]+)\s*:\s*([^;]+)/g)) {
    const [, prop, value] = m;
    const off = r.offset + r.body.indexOf(m[0]) + (r.selector ? r.selector.length + 1 : 0);
    if (!prop.startsWith('--') && /#[0-9a-f]{3,8}\b/i.test(value)) {
      // A hex only as a var() fallback still renders if the token is missing, so it's a lead, not a fail.
      const fallbackOnly = !/#[0-9a-f]{3,8}\b/i.test(value.replace(/var\([^()]*\)/g, ''));
      if (fallbackOnly) add('core', 'hex-outside-token', 'warn', r.src, off, `\`${prop}: ${value.trim()}\` has a hex var() fallback; check it matches the token.`);
      else add('core', 'hex-outside-token', 'fail', r.src, off, `\`${prop}: ${value.trim()}\` hard-codes a hex; use a scoped token from tokens.css.`);
    }
    if (/(^|[\s(,])-?\d*\.?\d+rem\b/.test(value)) {
      add('core', 'rem-unit', 'fail', r.src, off, `\`${prop}: ${value.trim()}\` uses rem; use px (rem follows the host's root size).`);
    }
  }
}
for (const s of sources) {
  for (const m of s.html.matchAll(/\bstyle\s*=\s*"([^"]*)"/gi)) {
    if (/#[0-9a-f]{3,8}\b/i.test(m[1]) && !/^\s*--/.test(m[1])) add('core', 'hex-outside-token', 'fail', s, m.index, `Inline style \`${m[1].trim()}\` hard-codes a hex.`);
    if (/\d\.?\d*rem\b/.test(m[1])) add('core', 'rem-unit', 'fail', s, m.index, `Inline style \`${m[1].trim()}\` uses rem.`);
  }
}

run('core', 'img-alt');
run('core', 'iframe-title');
run('core', 'heading-order');
for (const s of sources) {
  for (const m of s.html.matchAll(/<img\b[^>]*>/gi)) {
    if (!/\balt\s*=/i.test(m[0])) add('core', 'img-alt', 'fail', s, m.index, '<img> has no alt (use alt="" if decorative).');
  }
  for (const m of s.html.matchAll(/<iframe\b[^>]*>/gi)) {
    if (!/\btitle\s*=\s*["'][^"']+/i.test(m[0])) add('core', 'iframe-title', 'fail', s, m.index, '<iframe> has no title.');
  }
  let prev = null;
  for (const m of s.html.matchAll(/<h([1-6])\b/gi)) {
    const lvl = Number(m[1]);
    if (prev && lvl > prev + 1) add('core', 'heading-order', 'fail', s, m.index, `<h${lvl}> follows <h${prev}>; heading levels skip.`);
    prev = lvl;
  }
}

run('core', 'reduced-motion');
{
  const hasQuery = /prefers-reduced-motion/.test(allCss + allJs);
  const animates = /@keyframes|\banimation(-name)?\s*:\s*(?!none)/i.test(allCss) || /\.animate\(|behavior\s*:\s*['"]smooth/.test(allJs) || /scroll-behavior\s*:\s*smooth/.test(allCss);
  const transitions = /\btransition(-property)?\s*:\s*(?!none)/i.test(allCss);
  if (animates && !hasQuery) add('core', 'reduced-motion', 'fail', null, null, 'Animates (keyframes, smooth scroll or WAAPI) with no prefers-reduced-motion handling.');
  else if (transitions && !hasQuery) add('core', 'reduced-motion', 'warn', null, null, 'Has transitions but no prefers-reduced-motion query; fine for color/opacity, not for movement. Check which.');
}

// Host rules like `span,em{font-size:30px}` reach any inline element the build doesn't size itself.
run('core', 'inline-font-size');
{
  const sized = allRules.filter((r) => /font(-size)?\s*:/.test(r.body)).map((r) => r.selector || '');
  for (const s of sources) {
    for (const m of s.html.matchAll(/<(em|span|strong|small|i|b)\b([^>]*)>/gi)) {
      const tag = m[1].toLowerCase();
      const cls = (m[2].match(/class\s*=\s*["']([^"']+)/i) || [])[1];
      const covered = sized.some((sel) =>
        sel.split(',').some((x) => {
          const last = x.trim().split(/[\s>+~]+/).pop() || '';
          return (cls && cls.split(/\s+/).some((c) => last.includes(`.${c}`))) || new RegExp(`(^|[^-\\w])${tag}(?![-\\w])`).test(last);
        })
      );
      if (!covered) add('core', 'inline-font-size', 'warn', s, m.index, `<${tag}> has no rule setting its font-size; a host \`${tag}{font-size:…}\` rule will resize it.`);
    }
  }
}

run('core', 'dated-content');
{
  const months = 'Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|June?|July?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (const s of sources) {
    const text = s.html.replace(/<[^>]+>/g, (t) => blank(t));
    for (const m of text.matchAll(new RegExp(`\\b(${months})\\.? (\\d{1,2}),? (20\\d\\d)\\b`, 'g'))) {
      const d = new Date(`${m[1].slice(0, 3)} ${m[2]} ${m[3]}`);
      if (!isNaN(d) && d < today) add('core', 'dated-content', 'warn', s, m.index, `"${m[0]}" is in the past; check it isn't an upcoming-event date.`);
    }
    for (const m of text.matchAll(/\bTBD\b/g)) add('core', 'dated-content', 'warn', s, m.index, '"TBD" in visible text.');
  }
}

run('core', 'external-stylesheet');
for (const s of sources) {
  for (const m of s.html.matchAll(/<link\b[^>]*rel\s*=\s*["']?stylesheet[^>]*>/gi)) {
    const fonts = /fonts\.googleapis\.com/.test(m[0]);
    add('core', 'external-stylesheet', fonts ? 'warn' : 'fail', s, m.index, fonts ? 'Loads a Google Fonts stylesheet; confirm the host doesn\'t already.' : 'Links an external stylesheet; builds must be self-contained.');
  }
  for (const m of (s.css.map((c) => c.code).join('\n')).matchAll(/@import\b/g)) add('core', 'external-stylesheet', 'fail', s, null, '@import in CSS; builds must be self-contained.');
}

// ===== Widget only =====

if (kind === 'widget') {
  run('widget', 'id-attribute');
  for (const s of sources) {
    for (const m of s.html.matchAll(/<[a-z][\w-]*\b[^>]*\bid\s*=\s*["']([^"']+)/gi)) {
      if (iframeEmbed) continue;
      add('widget', 'id-attribute', 'fail', s, m.index, `id="${m[1]}" duplicates when the block is placed twice; use a class.`);
    }
  }

  run('widget', 'page-wide-query');
  if (!iframeEmbed) {
    for (const s of sources) {
      for (const c of s.js) {
        for (const m of c.code.matchAll(/document\.(querySelector(All)?|getElementById|getElementsByClassName|getElementsByTagName)\s*\(\s*([^)]*)\)/g)) {
          if (/script\[src|currentScript/.test(m[3])) continue; // load-once guards are fine
          add('widget', 'page-wide-query', 'warn', s, c.start + m.index, `\`${m[0]}\` searches the whole page; a second copy will grab the first one's elements. Scope to the widget's container.`);
        }
      }
    }
  }

  run('widget', 'third-party-script');
  for (const s of sources) {
    for (const m of s.html.matchAll(/<script\b[^>]*\bsrc\s*=\s*["']?(https?:)?\/\/[^"'\s>]+/gi)) {
      add('widget', 'third-party-script', 'fail', s, m.index, 'Bare <script src> re-runs on every re-render and placement; load it once behind a querySelector guard.');
    }
    for (const c of s.js) {
      if (/createElement\(\s*['"]script['"]\s*\)/.test(c.code) && !/querySelector\([^)]*script\[src/.test(c.code)) {
        add('widget', 'third-party-script', 'warn', s, c.start + c.code.search(/createElement\(\s*['"]script/), 'Injects a <script> with no visible `script[src…]` guard; confirm it loads once per page.');
      }
    }
  }

  if (shape === 'single') {
    run('widget', 'relative-css-url');
    for (const r of allRules) {
      for (const m of r.body.matchAll(/url\(\s*['"]?([^'")]+)/g)) {
        if (!/^(https?:|data:|#|\/\/)/.test(m[1])) add('widget', 'relative-css-url', 'fail', r.src, r.offset, `url(${m[1]}) is relative; use an absolute URL.`);
      }
    }
  }
}

// ===== Page only =====

const usesWidgets = [...readme.matchAll(/^\s*[-*]?\s*Uses widget:\s*`?([\w/-]+)`?/gim)].map((m) => m[1]);

if (kind === 'page') {
  run('page', 'jump-link');
  const ids = new Set(sources.flatMap((s) => [...s.html.matchAll(/\b(?:id|name)\s*=\s*["']([^"']+)/gi)].map((m) => m[1])));
  const widgetIds = new Set();
  for (const w of usesWidgets) {
    const wd = join(ROOT, 'widgets', w);
    if (!existsSync(wd)) continue;
    for (const f of readdirSync(wd).filter((f) => f.endsWith('.html'))) {
      for (const m of read(join(wd, f)).matchAll(/\bid\s*=\s*["']([^"']+)/gi)) widgetIds.add(m[1]);
    }
  }
  for (const s of sources) {
    for (const m of s.html.matchAll(/\bhref\s*=\s*["']#([^"']+)["']/gi)) {
      const id = m[1];
      if (ids.has(id)) continue;
      if (widgetIds.has(id)) add('page', 'jump-link', 'warn', s, m.index, `#${id} is supplied by a consumed widget; click-check it in the composite.`);
      else if (readme.includes(id)) add('page', 'jump-link', 'warn', s, m.index, `#${id} isn't in the build; the README mentions it (an anchor the editor adds?). Click-check it in the composite.`);
      else add('page', 'jump-link', 'fail', s, m.index, `#${id} points at an anchor that doesn't exist in the build, its consumed widgets or the README.`);
    }
  }

  run('page', 'paste-order');
  if (shape === 'sections') {
    const po = [join(dir, 'PASTE-ORDER.md'), join(dir, 'sections', 'PASTE-ORDER.md')].find((p) => existsSync(p));
    if (!po) add('page', 'paste-order', 'fail', null, null, 'sections/ build has no PASTE-ORDER.md.');
    else {
      const text = read(po);
      for (const f of files) if (!text.includes(basename(f))) add('page', 'paste-order', 'fail', null, null, `${f} isn't listed in PASTE-ORDER.md.`);
      // Only the order table / numbered list counts; prose may mention other files.
      const listed = text.split('\n').filter((l) => /^\s*(\||\d+\.)/.test(l)).join('\n');
      for (const m of listed.matchAll(/([\w.-]+\.html)/g)) {
        if (!existsSync(join(dir, 'sections', m[1]))) add('page', 'paste-order', 'fail', null, null, `PASTE-ORDER.md lists ${m[1]}, which isn't in sections/.`);
      }
    }
  } else if (usesWidgets.length && !/paste order/i.test(readme)) {
    add('page', 'paste-order', 'fail', null, null, 'Consumes a widget but README.md has no paste order.');
  }

  run('page', 'consumed-widget');
  for (const w of usesWidgets) {
    if (!existsSync(join(ROOT, 'widgets', w))) add('page', 'consumed-widget', 'fail', null, null, `README says "Uses widget: ${w}" but widgets/${w}/ doesn't exist.`);
  }
}

// ---------- report ----------

const fails = findings.filter((f) => f.sev === 'fail');
const warns = findings.filter((f) => f.sev === 'warn');

if (json) {
  console.log(JSON.stringify({ build: rel, kind, shape, prefixes, iframeEmbed, files, checks: ran, findings }, null, 2));
} else {
  console.log(`ship-lint ${rel}  (${kind}, ${shape}${iframeEmbed ? ', iframe embed' : ''}; prefix ${prefixes.join(', ') || 'none found'})`);
  console.log(`files: ${files.join(', ')}${shadow ? ' (shadow DOM: scoping n/a)' : iframeEmbed ? ' (iframe embed: scoping and ids n/a)' : ''}`);
  if (subBuilds.length) console.log(`note: sub-builds ${subBuilds.join(', ')}; lint each one too.`);
  console.log('');
  for (const group of ['core', 'widget', 'page']) {
    if (!ran[group].length) continue;
    console.log(`${group[0].toUpperCase() + group.slice(1)}`);
    for (const check of ran[group]) {
      const hits = findings.filter((f) => f.group === group && f.check === check);
      const status = hits.some((f) => f.sev === 'fail') ? 'FAIL' : hits.length ? 'warn' : 'pass';
      console.log(`  ${status.padEnd(4)}  ${check}`);
      for (const f of hits) console.log(`        ${f.sev === 'fail' ? '✗' : '!'} ${f.file}${f.line ? `:${f.line}` : ''}  ${f.msg}`);
    }
    console.log('');
  }
  console.log(`${fails.length} fail, ${warns.length} warn. ${fails.length ? 'Not ship-ready.' : 'No mechanical fails; /ship still runs the browser and judgment checks.'}`);
}
process.exit(fails.length ? 1 : 0);
