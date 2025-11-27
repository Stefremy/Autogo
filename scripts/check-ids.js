const fs = require('fs');
const path = require('path');

const ids = [
  "6527064",
  "6411402","6402032","6397603","6358496","6340868","6402080","6400851","6405689","6363162","6138806","6400657","6292021","6324169","6314386",
  "6101533","6086761","6280333","5711442",
  "6381843","6397616","6372941","6232992","6323764",
  "6144348","6400526","6612450","6340414","6299900","6360915",
  "6128543",
  "6410961",
  "6407734","6382625","4354806","6388966","6344401","6299928","6160546","6339108","6249313",
  "6412309","6410765","6405230","6380394",
  "6497865","6497874","6497942","6507257","6507331","6515350","6514098",
  "6260999",
  "6272036","6288798","6497452","6544657",
  "6291912"
];

const filePath = path.resolve(__dirname, '../data/cars.json');
let raw = fs.readFileSync(filePath, 'utf8');
const firstBracket = raw.indexOf('[');
if (firstBracket > 0) raw = raw.slice(firstBracket);
let cars = JSON.parse(raw);
const idSet = new Set(ids);

const found = new Set();
for (const car of cars) {
  if (car && car.id && idSet.has(String(car.id))) {
    found.add(String(car.id));
  }
}

const missing = ids.filter(id => !found.has(id));
console.log('Found', found.size, 'of', ids.length);
if (found.size > 0) console.log('Found IDs:', Array.from(found).join(', '));
if (missing.length > 0) console.log('Missing IDs:', missing.join(', '));
else console.log('No missing IDs.');
