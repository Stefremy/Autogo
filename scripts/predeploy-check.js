// Quick pre-deploy checks: ensure cars.json entries are valid and slugs exist and unique
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'data', 'cars.json');
let raw;
try {
  raw = fs.readFileSync(dataPath, 'utf8');
} catch (e) {
  console.error('predeploy-check: cannot read data/cars.json', e.message);
  process.exit(2);
}
let cars;
try {
  cars = JSON.parse(raw);
} catch (e) {
  console.error('predeploy-check: data/cars.json is not valid JSON', e.message);
  process.exit(2);
}
if (!Array.isArray(cars)) {
  console.error('predeploy-check: data/cars.json must be an array');
  process.exit(2);
}
const seenSlugs = new Set();
for (const [i, c] of cars.entries()) {
  if (!c || typeof c !== 'object') {
    console.error(`predeploy-check: invalid car at index ${i}`);
    process.exit(2);
  }
  if (!c.id) {
    console.error(`predeploy-check: car at index ${i} missing id`);
    process.exit(2);
  }
  // slug optional, but if present ensure non-empty
  if (c.slug) {
    const s = String(c.slug).trim();
    if (!s) {
      console.error(`predeploy-check: empty slug for car id=${c.id}`);
      process.exit(2);
    }
    if (seenSlugs.has(s)) {
      console.error(`predeploy-check: duplicate slug '${s}'`);
      process.exit(2);
    }
    seenSlugs.add(s);
  }
}
console.log('predeploy-check: OK');
process.exit(0);
