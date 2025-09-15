#!/usr/bin/env node
const path = require('path');
const fs = require('fs');

const dataPath = path.resolve(__dirname, '..', 'data', 'cars.json');
if (!fs.existsSync(dataPath)) {
  console.error('ERROR: data/cars.json not found');
  process.exit(2);
}
const cars = require(dataPath);
if (!Array.isArray(cars)) {
  console.error('ERROR: data/cars.json does not export an array');
  process.exit(2);
}

const missing = cars.filter(c => !c.slug || String(c.slug).trim() === '');
if (missing.length) {
  console.error(`ERROR: ${missing.length} cars are missing a slug`);
  missing.slice(0,10).forEach(c => console.error(` - id=${c.id} make=${c.make} model=${c.model}`));
}

const slugs = cars.map(c => c.slug).filter(Boolean);
const dupes = slugs.reduce((acc, s) => {
  acc[s] = (acc[s] || 0) + 1; return acc;
}, {});
const duplicates = Object.entries(dupes).filter(([,count]) => count > 1);
if (duplicates.length) {
  console.error('ERROR: duplicate slugs found:');
  duplicates.forEach(([s, count]) => console.error(` - ${s}: ${count}`));
}

if (missing.length || duplicates.length) process.exit(2);
console.log('OK: slugs present and unique');
process.exit(0);
