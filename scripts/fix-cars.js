const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'data', 'cars.json');
const raw = fs.readFileSync(file, 'utf8');
let cars;
try {
  cars = JSON.parse(raw);
} catch {
  console.error('Failed to parse data/cars.json:');
  process.exitCode = 2;
  process.exit();
}

if (!Array.isArray(cars)) {
  console.error('data/cars.json is not an array');
  process.exitCode = 2;
  process.exit();
}

const slugify = (s) =>
  String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const fixed = [];
let removed = 0;
for (const c of cars) {
  if (!c || typeof c !== 'object') {
    removed++;
    continue;
  }
  if (!c.id && !c.slug) {
    // worthless entry
    removed++;
    continue;
  }
  // ensure id exists as string
  if (!c.id) c.id = String(Math.floor(Math.random() * 1e12));
  c.id = String(c.id);

  // ensure slug exists
  if (!c.slug || String(c.slug).trim().length === 0 || c.slug === 'undefined') {
    const base = [c.make || 'car', c.model || '', c.year || ''].join(' ').trim();
    c.slug = `${slugify(base)}-${c.id}`;
  }

  fixed.push(c);
}

fs.writeFileSync(file, JSON.stringify(fixed, null, 2) + '\n', 'utf8');
console.log(`fix-cars: wrote ${fixed.length} entries, removed ${removed} invalid entries.`);
