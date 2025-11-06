const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DATA = path.join(ROOT, 'data', 'cars.json');

const idsToRemove = [
  '6370869','6295741','6367733','6414302','6288798','6408771','6417386',
  '6373440','6340773','6404807','6260999','6390830','6400876','6381117',
  '6375854','6417485','6318325','6417342','6381543','6401815','6359320',
  '6402013','6402011'
];

function readJson(p){
  try{ return JSON.parse(fs.readFileSync(p,'utf8')); }catch(err){
    console.error('Failed to read/parse',p,err.message); process.exit(2);
  }
}

function writeBackup(original){
  const ts = Math.floor(Date.now()/1000);
  const bak = path.join(ROOT, 'data', `cars.json.removed.${ts}.bak.json`);
  fs.writeFileSync(bak, JSON.stringify(original, null, 2), 'utf8');
  return bak;
}

(function main(){
  const cars = readJson(DATA);
  if(!Array.isArray(cars)){
    console.error('cars.json is not an array'); process.exit(2);
  }
  const idsSet = new Set(idsToRemove.map(String));
  const before = cars.length;
  const removedIdsFound = new Set();
  const filtered = cars.filter(c => {
    try{
      const id = c && (c.id != null ? String(c.id) : null);
      const unit = c && (c.unitNumber != null ? String(c.unitNumber) : null);
      const slug = c && (c.slug != null ? String(c.slug) : null);
      // match if id or unitNumber equals target OR slug contains the id token
      for(const target of idsSet){
        if(id === target || unit === target) { removedIdsFound.add(target); return false; }
        if(slug && slug.indexOf(target) !== -1) { removedIdsFound.add(target); return false; }
      }
      return true;
    }catch{
      return true;
    }
  });
  const after = filtered.length;
  if(after === before){
    console.log('No matching ids found. No changes made.');
    process.exit(0);
  }
  const bak = writeBackup(cars);
  fs.writeFileSync(DATA + '.tmp', JSON.stringify(filtered, null, 2), 'utf8');
  fs.renameSync(DATA + '.tmp', DATA);
  console.log(`Removed ${before-after} entries for ids: ${Array.from(removedIdsFound).join(', ')}. Wrote backup to ${bak}. New cars.json length: ${after}`);
})();
