#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'data', 'cars.json');
const raw = fs.readFileSync(file, 'utf8');
let cars;
try {
  cars = JSON.parse(raw);
} catch {
  console.error('Failed to parse data/cars.json:');
  process.exit(1);
}

function parsePriceField(v) {
  if (v == null || v === '') return { price: null, priceDisplay: null };
  if (typeof v === 'number' && Number.isFinite(v)) return { price: v, priceDisplay: v.toString() };
  // try to extract numbers
  const digits = String(v).replace(/[^0-9.,-]/g, '').replace(/,/g, '.');
  const n = parseFloat(digits);
  if (!Number.isNaN(n) && Number.isFinite(n)) return { price: n, priceDisplay: n.toString() };
  // fallback: keep display string and null numeric
  return { price: null, priceDisplay: String(v) };
}

let changed = false;
const out = cars.map((c) => {
  const copy = { ...c };
  const orig = c.price;
  const parsed = parsePriceField(orig);
  if (parsed.price !== copy.price || parsed.priceDisplay !== copy.priceDisplay) {
    copy.price = parsed.price === undefined ? null : parsed.price;
    copy.priceDisplay = parsed.priceDisplay === undefined ? null : parsed.priceDisplay;
    changed = true;
  }
  return copy;
});

if (changed) {
  fs.writeFileSync(file, JSON.stringify(out, null, 2) + '\n', 'utf8');
  console.log('Normalized prices in data/cars.json');
} else {
  console.log('No changes needed (prices already normalized)');
}
