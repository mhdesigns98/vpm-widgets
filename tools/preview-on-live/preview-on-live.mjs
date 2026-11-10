#!/usr/bin/env node
// Preview a CMS paste on the live vpm.org page, in your own browser only.
//
// Turns a paste (the HTML you'd put in a Code Block) into a console snippet and copies it
// to the clipboard. Open the live page, open the console (Cmd+Option+J), paste, Enter: the
// block on the page is swapped for your paste, with the real site CSS, CMS rows and Stream
// Player around it. Nothing is saved. Refresh to get the live version back.
//
//   node tools/preview-on-live/preview-on-live.mjs paste.html
//   some-copy-script --print | node tools/preview-on-live/preview-on-live.mjs
//
// Options:
//   --replace "<css selector>"  the live element to swap out. Default: the element with the
//                               same classes as the paste's first top-level element (so
//                               <div class="vpm-vg vg-header"> replaces .vpm-vg.vg-header).
//   --print                     print the snippet instead of copying it.
//
// <style> and <script> tags in the paste are inserted where they sit, so the paste behaves
// as it would after the live block's own <style>. Scripts run as fresh scripts.

import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const args = process.argv.slice(2);
let replace = null, print = false, file = null;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--replace') replace = args[++i];
  else if (args[i] === '--print') print = true;
  else if (args[i] === '-h' || args[i] === '--help') {
    console.log(readFileSync(new URL(import.meta.url)).toString().split('\n').filter(l => l.startsWith('//')).map(l => l.slice(3)).join('\n'));
    process.exit(0);
  } else file = args[i];
}

const paste = readFileSync(file ?? 0, 'utf8');
if (!paste.trim()) { console.error('preview-on-live: the paste is empty.'); process.exit(1); }

// Runs in the page. Kept as plain ES2017 so it pastes into any current browser console.
function inject(html, selector) {
  var t = document.createElement('template');
  t.innerHTML = html;
  var frag = t.content;
  var first = Array.prototype.find.call(frag.children, function (n) { return !/^(STYLE|SCRIPT|LINK)$/.test(n.tagName); });
  if (!selector) {
    if (!first || !first.classList.length) { console.warn('[preview] The paste has no classed top-level element; rerun with --replace "<selector>".'); return; }
    selector = '.' + Array.prototype.map.call(first.classList, function (c) { return CSS.escape(c); }).join('.');
  }
  var old = document.querySelector(selector);
  if (!old) { console.warn('[preview] Nothing on this page matches ' + selector + '. Wrong page, or rerun with --replace "<selector>".'); return; }
  // A rerun replaces the last preview, not just the root: drop the extra nodes it added.
  document.querySelectorAll('[data-preview-on-live]').forEach(function (n) { if (n !== old) n.remove(); });
  // Parsed scripts never run; swap each for a fresh one, which runs once it's in the page.
  frag.querySelectorAll('script').forEach(function (s) {
    var n = document.createElement('script');
    Array.prototype.forEach.call(s.attributes, function (a) { n.setAttribute(a.name, a.value); });
    n.textContent = s.textContent;
    s.replaceWith(n);
  });
  Array.prototype.forEach.call(frag.children, function (n) { n.setAttribute('data-preview-on-live', ''); });
  old.replaceWith(frag);
  if (document.title.indexOf('[PREVIEW] ') !== 0) document.title = '[PREVIEW] ' + document.title;
  console.info('[preview] Swapped ' + selector + '. Only you see this; refresh to get the live page back. Rerunning after an edit works, but refresh first for a clean test of scripts.');
}

const snippet = `(${inject.toString()})(${JSON.stringify(paste)}, ${JSON.stringify(replace)});`;

if (print) { process.stdout.write(snippet + '\n'); process.exit(0); }
execSync('pbcopy', { input: snippet });
console.log(`Preview snippet copied (${snippet.length} characters). Open the live page, press Cmd+Option+J, paste, press Enter. Refresh to undo.`);
