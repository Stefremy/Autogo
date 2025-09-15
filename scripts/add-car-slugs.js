#!/usr/bin/env node
/*
  scripts/add-car-slugs.js
  - Reads data/cars.json
  - Adds a slug field to any car missing it using make+model+year
  - Writes file back if any changes
  - Optionally commits the change with `--commit`

  Usage:
    node scripts/add-car-slugs.js
    node scripts/add-car-slugs.js --commit
*/

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const carsPath = path.join(__dirname, '..', 'data', 'cars.json');

function slugify(str) {
  return String(str)
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function main() {
  const args = process.argv.slice(2);
  const doCommit = args.includes('--commit');

  if (!fs.existsSync(carsPath)) {
    console.error('data/cars.json not found at', carsPath);
    process.exit(2);
  }

  const raw = fs.readFileSync(carsPath, 'utf8');
  let cars;
  try {
    cars = JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse data/cars.json:', err.message);
    process.exit(2);
  }

  if (!Array.isArray(cars)) {
    console.error('Expected data/cars.json to contain an array');
    process.exit(2);
  }

  let changed = false;
  const updated = cars.map((c) => {
    if (c && (!c.slug || typeof c.slug !== 'string' || c.slug.trim() === '')) {
      const seed = [c.make, c.model, c.year].filter(Boolean).join(' ');
      const newSlug = slugify(seed || c.id || Math.random().toString(36).slice(2, 8));
      c.slug = newSlug;
      changed = true;
      console.log(`Added slug for id=${c.id || '<no-id>'}: ${newSlug}`);
    }
    return c;
  });

  if (!changed) {
    console.log('No missing slugs found. Nothing to do.');
    return;
  }

  const pretty = JSON.stringify(updated, null, 2) + '\n';
  fs.writeFileSync(carsPath, pretty, 'utf8');
  console.log('Wrote updated data/cars.json');

  if (doCommit) {
    console.log('Committing changes...');
    const added = spawnSync('git', ['add', 'data/cars.json'], { stdio: 'inherit' });
    if (added.status !== 0) {
      console.error('git add failed');
      process.exit(1);
    }
    const msg = 'chore: add missing slugs to data/cars.json';
    const commit = spawnSync('git', ['commit', '-m', msg], { stdio: 'inherit' });
    if (commit.status !== 0) {
      console.error('git commit failed');
      process.exit(1);
    }
    console.log('Committed updated data/cars.json');
  }
}

main();
