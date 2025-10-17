/*
 Simple three-way merge for data/cars.json conflict resolution.
 Strategy:
 - Load base, ours, theirs arrays (JSON array of car objects).
 - Build maps by `id` for each.
 - For each id present in any, choose fields:
   - If ours has `price` or `priceDisplay` use ours (prefer normalized local changes).
   - Else use theirs.
 - For ids only in theirs or only in ours, include them.
 - Keep ordering: start with base order, then append new ids from ours and theirs (in that preference).
 - Write resolved JSON to stdout or file.

 Usage: node scripts/merge-cars-conflict.js /tmp/cars-merge/base.json /tmp/cars-merge/ours.json /tmp/cars-merge/theirs.json > data/cars.json
*/

const fs = require('fs');

function read(path){
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

const [,, basePath, oursPath, theirsPath] = process.argv;
if(!basePath || !oursPath || !theirsPath){
  console.error('Usage: node merge-cars-conflict.js base.json ours.json theirs.json');
  process.exit(2);
}

const base = read(basePath);
const ours = read(oursPath);
const theirs = read(theirsPath);

function toMap(arr){
  const m = new Map();
  for(const o of arr) m.set(String(o.id), o);
  return m;
}

const baseMap = toMap(base);
const oursMap = toMap(ours);
const theirsMap = toMap(theirs);

const allIds = new Set([...baseMap.keys(), ...oursMap.keys(), ...theirsMap.keys()]);
void allIds;

// Start with base order
const result = [];
const seen = new Set();
for(const item of base){
  const id = String(item.id);
  if(seen.has(id)) continue;
  seen.add(id);
  const o = oursMap.get(id);
  const t = theirsMap.get(id);
  if(o && t){
    // merge fields: prefer ours for price/priceDisplay, otherwise prefer theirs if ours missing
    const merged = Object.assign({}, t, o);
    // ensure we keep normalized fields from ours if present
    if(o.hasOwnProperty('price')) merged.price = o.price;
    if(o.hasOwnProperty('priceDisplay')) merged.priceDisplay = o.priceDisplay;
    result.push(merged);
  } else if(o){
    result.push(o);
  } else if(t){
    result.push(t);
  } else {
    result.push(item);
  }
}

// Append any remaining ids from ours then theirs
function appendRemaining(map){
  for(const [id, obj] of map){
    if(seen.has(id)) continue;
    seen.add(id);
    result.push(obj);
  }
}
appendRemaining(oursMap);
appendRemaining(theirsMap);

// Write with 2-space indent
fs.writeFileSync('data/cars.json', JSON.stringify(result, null, 2), 'utf8');
console.log('Wrote data/cars.json with', result.length, 'entries');
