#!/usr/bin/env node
// Build stamp for /ship and the drift check. Spec: tools/drift-check/STAMP.md.
// Usage: node tools/drift-check/stamp.mjs <slug> [--dry-run]
// Prints one stamp per pasted HTML block. No dependencies; run from the repo root.

import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const STAMP_ATTR = /\s+data-vpm-(?:build|hash|source)="[^"]*"/g;

// Normalize, then sha256, first 12 hex chars. The drift check must call this on the live copy.
export function normalize(text) {
  return text
    .replace(/^﻿/, '')
    .replace(/\r\n?/g, '\n')
    .replace(STAMP_ATTR, '')
    .split('\n').map((line) => line.replace(/[ \t]+$/, '')).join('\n')
    .trim();
}

export function hash(text) {
  return createHash('sha256').update(normalize(text), 'utf8').digest('hex').slice(0, 12);
}

const read = (p) => readFileSync(p, 'utf8');
const isDir = (p) => existsSync(p) && statSync(p).isDirectory();

// One block set per pasted HTML block: acf-split html*.html (+ css.css, js.js),
// sections/*.html, or a single index.html.
function blockSets(dir) {
  const files = readdirSync(dir);
  const htmls = files.filter((f) => /^html.*\.html$/.test(f)).sort();
  if (htmls.length) {
    const extra = {};
    if (files.includes('css.css')) extra.css = hash(read(join(dir, 'css.css')));
    if (files.includes('js.js')) extra.js = hash(read(join(dir, 'js.js')));
    return htmls.map((f) => ({ file: join(dir, f), parts: { html: hash(read(join(dir, f))), ...extra } }));
  }
  if (isDir(join(dir, 'sections'))) {
    return readdirSync(join(dir, 'sections')).filter((f) => f.endsWith('.html')).sort()
      .map((f) => ({ file: join(dir, 'sections', f), parts: { html: hash(read(join(dir, 'sections', f))) } }));
  }
  const nested = files.filter((f) => isDir(join(dir, f)) && readdirSync(join(dir, f)).some((g) => /^html.*\.html$/.test(g)));
  if (nested.length) return nested.sort().flatMap((f) => blockSets(join(dir, f)));
  if (files.includes('index.html')) return [{ file: join(dir, 'index.html'), parts: { block: hash(read(join(dir, 'index.html'))) } }];
  return [];
}

function main() {
  const [slug, flag] = process.argv.slice(2);
  const dryRun = flag === '--dry-run';
  const kind = isDir(join('widgets', slug ?? '')) ? 'widgets' : isDir(join('pages', slug ?? '')) ? 'pages' : null;
  if (!slug || !kind) {
    console.error('Usage: node tools/drift-check/stamp.mjs <slug> [--dry-run] (run from the repo root)');
    process.exit(1);
  }
  const dir = join(kind, slug);
  const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();

  let build = 'uncommitted';
  if (git('status', '--porcelain', '--', dir)) {
    if (!dryRun) {
      console.error(`${dir} has uncommitted changes. Commit them first so the stamp names a real commit.`);
      process.exit(2);
    }
  } else {
    build = git('log', '-1', '--format=%H', '--', dir).slice(0, 12);
  }

  const readme = join(dir, 'README.md');
  const pasted = existsSync(readme) && /^Placement:\s*pasted\b/im.test(read(readme));
  const source = kind === 'pages' || pasted ? 'page' : 'module';

  const sets = blockSets(dir);
  if (!sets.length) {
    console.error(`No pasteable HTML found in ${dir}.`);
    process.exit(1);
  }
  for (const { file, parts } of sets) {
    const h = Object.entries(parts).map(([k, v]) => `${k}:${v}`).join(';');
    console.log(`${file}\n  data-vpm-build="${build}" data-vpm-hash="${h}" data-vpm-source="${source}"`);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) main();
