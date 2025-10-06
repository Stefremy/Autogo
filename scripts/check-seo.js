#!/usr/bin/env node
/**
 * Quick heuristic SEO audit for Next.js pages.
 *
 * The goal is to statically inspect page components and report
 * whether common SEO elements exist in each file.
 *
 * Since the pages are React components, this script uses simple
 * regular-expression heuristics to look for specific tags and
 * attributes inside the file contents. It is not meant to replace
 * a runtime audit (Lighthouse, etc.), but it provides a fast check
 * that can be executed in CI to prevent accidental regressions.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PAGES_DIR = path.join(ROOT, 'pages');

const IGNORED_FILES = new Set([
  '_app.tsx',
  '_document.tsx',
  '_error.tsx',
]);

const IGNORED_DIRS = new Set(['api', 'cars']);

const CHECKS = [
  {
    id: 'title',
    label: '<title>',
    hint: 'Use <Head><title>…</title></Head> to define the page title.',
    pattern: /<title>[^<]+<\/title>/i,
  },
  {
    id: 'metaDescription',
    label: 'meta description',
    hint: 'Include <meta name="description" content="…" />.',
    pattern: /<meta\s+name=["']description["'][^>]*>/i,
  },
  {
    id: 'canonical',
    label: 'canonical link',
    hint: 'Add <link rel="canonical" href="…" /> to avoid duplicate content.',
    pattern: /<link[^>]+rel=["']canonical["'][^>]*>/i,
  },
  {
    id: 'ogTitle',
    label: 'og:title',
    hint: 'Add Open Graph title for social sharing.',
    pattern: /<meta[^>]+property=["']og:title["'][^>]*>/i,
  },
  {
    id: 'ogDescription',
    label: 'og:description',
    hint: 'Add Open Graph description for social sharing.',
    pattern: /<meta[^>]+property=["']og:description["'][^>]*>/i,
  },
  {
    id: 'ogImage',
    label: 'og:image',
    hint: 'Add <meta property="og:image" …> with an absolute URL.',
    pattern: /<meta[^>]+property=["']og:image["'][^>]*>/i,
  },
  {
    id: 'twitterCard',
    label: 'twitter:card',
    hint: 'Add <meta name="twitter:card" content="summary_large_image" />.',
    pattern: /<meta[^>]+name=["']twitter:card["'][^>]*>/i,
  },
  {
    id: 'h1',
    label: '<h1>',
    hint: 'Each page should have a single <h1> heading.',
    pattern: /<h1\b/i,
  },
];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (IGNORED_DIRS.has(entry.name)) continue;
      files.push(...walk(path.join(dir, entry.name)));
    } else if (entry.isFile()) {
      if (!entry.name.endsWith('.tsx')) continue;
      if (IGNORED_FILES.has(entry.name)) continue;
      files.push(path.join(dir, entry.name));
    }
  }
  return files;
}

function relativePagePath(filePath) {
  return path.relative(PAGES_DIR, filePath);
}

function evaluatePage(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const missing = [];
  let score = 0;

  for (const check of CHECKS) {
    const ok = check.pattern.test(content);
    if (!ok) missing.push(check);
    else score += 1;
  }

  return {
    file: relativePagePath(filePath),
    score,
    maxScore: CHECKS.length,
    missing,
  };
}

function formatResult(result) {
  const pct = ((result.score / result.maxScore) * 100).toFixed(0);
  const status = result.score === result.maxScore ? '✅' : result.score >= result.maxScore / 2 ? '⚠️' : '❌';
  const missingIds = result.missing.map((m) => m.label).join(', ') || '—';
  return `${status} ${result.file.padEnd(28)} ${String(result.score).padStart(2)}/${result.maxScore} (${pct}%): missing ${missingIds}`;
}

function printSummary(results) {
  const totalScore = results.reduce((acc, r) => acc + r.score, 0);
  const totalPossible = results.reduce((acc, r) => acc + r.maxScore, 0);
  const pct = totalPossible === 0 ? 0 : ((totalScore / totalPossible) * 100).toFixed(1);
  console.log('\nOverall SEO heuristics score:', `${totalScore}/${totalPossible} (${pct}%)`);
}

function printHints(results) {
  const missingMap = new Map();
  for (const { missing } of results) {
    for (const check of missing) {
      if (!missingMap.has(check.id)) missingMap.set(check.id, check);
    }
  }
  if (!missingMap.size) return;
  console.log('\nHints to improve:');
  for (const check of missingMap.values()) {
    console.log(`- ${check.label}: ${check.hint}`);
  }
}

function main() {
  if (!fs.existsSync(PAGES_DIR)) {
    console.error('Could not find pages directory at', PAGES_DIR);
    process.exit(1);
  }

  const pageFiles = walk(PAGES_DIR);
  if (!pageFiles.length) {
    console.warn('No page files (.tsx) found to audit.');
    return;
  }

  console.log('SEO heuristics audit for Next.js pages');
  console.log('Checks:', CHECKS.map((c) => c.label).join(', '));
  console.log('\nResults:');

  const results = pageFiles
    .map(evaluatePage)
    .sort((a, b) => a.file.localeCompare(b.file));

  for (const result of results) {
    console.log(formatResult(result));
  }

  printSummary(results);
  printHints(results);
}

main();
