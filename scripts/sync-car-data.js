#!/usr/bin/env node
// Sync certain fields from the slim `data/cars.json` into other data files
// (cars.full.json and cars.json.tmp) so maintenance, vin and unitNumber stay consistent.

const fs = require('fs').promises;
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const files = {
  slim: path.join(ROOT, 'data', 'cars.json'),
  full: path.join(ROOT, 'data', 'cars.full.json'),
  tmp: path.join(ROOT, 'data', 'cars.json.tmp'),
};

async function readJson(file) {
  try {
    const t = await fs.readFile(file, 'utf8');
    return JSON.parse(t);
  } catch {
    return null;
  }
}

async function writeJson(file, obj) {
  const sorted = obj; // keep original order
  const out = JSON.stringify(sorted, null, 2) + '\n';
  await fs.writeFile(file, out, 'utf8');
}

function pickFields(src) {
  const res = {};
  if ('unitNumber' in src) res.unitNumber = src.unitNumber;
  if ('vin' in src) res.vin = src.vin;
  if ('maintenance' in src) res.maintenance = src.maintenance;
  return res;
}

async function sync() {
  const slim = await readJson(files.slim);
  if (!slim) {
    console.error('Could not read', files.slim);
    process.exit(1);
  }

  const map = new Map();
  for (const c of slim) {
    if (!c || !c.id) continue;
    map.set(String(c.id), pickFields(c));
  }

  // target files
  const targets = [files.full, files.tmp];

  for (const tgt of targets) {
    const arr = await readJson(tgt);
    if (!arr) {
      console.warn('Skipping missing or unreadable file', tgt);
      continue;
    }
    let changed = 0;
    for (const r of arr) {
      const id = String(r.id);
      if (!map.has(id)) continue;
      const updates = map.get(id);
      // only copy when present in source
      for (const k of Object.keys(updates)) {
        const newVal = updates[k];
        const oldVal = r[k];
        // crude deep-equality for arrays/strings
        const equal = JSON.stringify(oldVal) === JSON.stringify(newVal);
        if (!equal) {
          r[k] = newVal;
          changed++;
        }
      }
    }
    if (changed > 0) {
      await writeJson(tgt, arr);
      console.log(`Updated ${changed} fields in ${path.relative(ROOT, tgt)}`);
    } else {
      console.log(`No changes for ${path.relative(ROOT, tgt)}`);
    }
  }
}

sync().catch(() => {
  console.error('sync-car-data: failed');
  process.exit(1);
});
