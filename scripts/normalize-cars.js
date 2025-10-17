const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const fullPath = path.join(root, 'data', 'cars.full.json');
const slimPath = path.join(root, 'data', 'cars.json');

function readJSON(p) {
  if (!fs.existsSync(p)) return null;
  const raw = fs.readFileSync(p, 'utf8');
  try {
    return JSON.parse(raw);
  } catch {
    console.error('Failed to parse', p);
    return null;
  }
}

function writeJSON(p, data) {
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function parsePrice(s) {
  if (s == null) return null;
  const cleaned = String(s).replace(/[^0-9.,-]/g, '').replace(/,/g, '.');
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : null;
}

function parseKm(s) {
  if (s == null) return null;
  const cleaned = String(s).replace(/[^0-9]/g, '');
  const n = parseInt(cleaned, 10);
  return Number.isFinite(n) ? n : null;
}

function normalizeMaintenanceEntry(raw) {
  if (typeof raw !== 'string') return raw;
  const parts = raw.split(/\s*—\s*/).map(p => p.trim()).filter(Boolean);
  const obj = { raw };
  if (parts.length > 0) obj.date = parts[0];
  // heuristics: next part often "NNN km"
  if (parts.length > 1) {
    const km = parseKm(parts[1]);
    if (km !== null) obj.km = km;
    else if (!obj.shop) obj.shop = parts[1];
  }
  if (parts.length > 2) {
    // if we already parsed km, parts[2] is shop, else could be description
    if (!obj.km) {
      const maybeKm = parseKm(parts[2]);
      if (maybeKm !== null) obj.km = maybeKm;
      else obj.shop = parts[2];
    } else {
      obj.shop = parts[2];
    }
  }
  if (parts.length > 3) {
    // description or extra
    // the last part often contains price like "€ 273,10"
    const last = parts[parts.length - 1];
    const price = parsePrice(last);
    if (price !== null) {
      obj.price = price;
      // description is everything between known indices (3..last-1)
      const descParts = parts.slice(3, parts.length - 1);
      if (descParts.length > 0) obj.description = descParts.join(' — ');
    } else {
      // no price at end
      const descParts = parts.slice(3);
      if (descParts.length > 0) obj.description = descParts.join(' — ');
    }
  }
  // if only 3 parts and last looks like price
  if (parts.length === 3) {
    const maybePrice = parsePrice(parts[2]);
    if (maybePrice !== null) {
      obj.price = maybePrice;
    }
  }
  // final best-effort: if description missing but there are extra parts
  if (!obj.description && parts.length > 3 && obj.price == null) {
    obj.description = parts.slice(3).join(' — ');
  }
  return obj;
}

function normalizeCarsArray(arr) {
  let changed = false;
  for (const car of arr) {
    if (car.maintenance && Array.isArray(car.maintenance)) {
      const newMaint = car.maintenance.map(m => {
        if (typeof m === 'string') {
          const parsed = normalizeMaintenanceEntry(m);
          return parsed;
        }
        return m;
      });
      // compare
      const orig = JSON.stringify(car.maintenance);
      const updated = JSON.stringify(newMaint);
      if (orig !== updated) {
        car.maintenance = newMaint;
        changed = true;
      }
    }

    // Ensure equipamento_opcoes has consistent object shape (arrays)
    if (car.equipamento_opcoes && typeof car.equipamento_opcoes === 'object') {
      const eo = car.equipamento_opcoes;
      for (const k of Object.keys(eo)) {
        if (!Array.isArray(eo[k])) {
          eo[k] = Array.isArray(eo[k]) ? eo[k] : [String(eo[k])];
          changed = true;
        }
      }
    }
  }
  return changed;
}

function syncFields(fullArr, slimArr) {
  const byIdFull = new Map(fullArr.map(c => [String(c.id), c]));
  const byIdSlim = new Map(slimArr.map(c => [String(c.id), c]));
  let changed = false;
  for (const [id, full] of byIdFull.entries()) {
    const slim = byIdSlim.get(id);
    if (!slim) continue;
    // fields to sync: vin, unitNumber, maintenance, equipamento_opcoes, images
    const fields = ['vin','unitNumber','maintenance','equipamento_opcoes','images'];
    for (const f of fields) {
      const a = JSON.stringify(full[f] ?? null);
      const b = JSON.stringify(slim[f] ?? null);
      if (a !== b) {
        slim[f] = full[f];
        changed = true;
      }
    }
  }
  return changed;
}

(function main(){
  const full = readJSON(fullPath);
  const slim = readJSON(slimPath);
  if (!full) { console.error('Missing or invalid', fullPath); process.exit(1); }
  if (!slim) { console.error('Missing or invalid', slimPath); process.exit(1); }

  let changedFull = normalizeCarsArray(full);
  let changedSlim = normalizeCarsArray(slim);

  const synced = syncFields(full, slim);

  if (changedFull) {
    writeJSON(fullPath, full);
    console.log('Updated', fullPath);
  } else {
    console.log('No changes for', fullPath);
  }

  if (changedSlim || synced) {
    writeJSON(slimPath, slim);
    console.log('Updated', slimPath);
  } else {
    console.log('No changes for', slimPath);
  }

  // Print summary for Audi if present
  const targetId = '6367789';
  const slimById = new Map(slim.map(c => [String(c.id), c]));
  const car = slimById.get(targetId) || full.find(c=>String(c.id)===targetId);
  if (car) {
    console.log('Sample car:', car.make, car.model, 'id', car.id);
    console.log('VIN present?', !!car.vin);
    console.log('maintenance entries:', Array.isArray(car.maintenance) ? car.maintenance.length : 0);
  }
})();
