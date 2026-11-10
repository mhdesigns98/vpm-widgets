#!/usr/bin/env node
// Preview a CMS paste on the live vpm.org page, in your own browser only.
//
// Quickest way: the "Preview paste" bookmarklet (index.html). Copy the paste, open the live
// page, click the bookmark. This script is the console route, for when you need --replace:
// it turns a paste into a console snippet and copies it. Open the live page, open the
// console (Cmd+Option+J), paste, Enter. Refresh to get the live version back.
//
//   node tools/preview-on-live/preview-on-live.mjs paste.html
//   some-copy-script --print | node tools/preview-on-live/preview-on-live.mjs
//
// Options:
//   --replace "<css selector>"  the live element to swap out. Default: the element with the
//                               same classes as the paste's first top-level element (so
//                               <div class="vpm-vg vg-header"> replaces .vpm-vg.vg-header).
//   --print                     print the snippet instead of copying it.

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

const inject = readFileSync(new URL('./inject.js', import.meta.url), 'utf8');
const snippet = `(function(){${inject}\nconsole.info('[preview] ' + previewOnLive(${JSON.stringify(paste)}, ${JSON.stringify(replace)}));})();`;

if (print) { process.stdout.write(snippet + '\n'); process.exit(0); }
// UTF-8 locale, or pbcopy reads the bytes as Mac Roman and — becomes ,Äî.
execSync('pbcopy', { input: snippet, env: { ...process.env, LC_CTYPE: 'en_US.UTF-8', LANG: 'en_US.UTF-8' } });
console.log(`Preview snippet copied (${snippet.length} characters). Open the live page, press Cmd+Option+J, paste, press Enter. Refresh to undo.`);
