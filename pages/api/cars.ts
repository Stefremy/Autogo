import fs from "fs";
import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";

const carsFile = path.join(process.cwd(), "data/cars.json");
const carsFullFile = path.join(process.cwd(), "data/cars.full.json");
const schemaFile = path.join(process.cwd(), "data/schema/car.schema.json");
const API_KEY = process.env.API_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO; // owner/repo
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

type AnyObject = { [k: string]: any };

function extractToken(req: NextApiRequest) {
  const headerKey = (req.headers['x-api-key'] as string) || undefined;
  const auth = (req.headers.authorization as string) || (req.headers.Authorization as string) || undefined;
  const bearer = auth && auth.startsWith('Bearer ') ? auth.slice(7) : undefined;
  const queryToken = typeof req.query.token === 'string' ? req.query.token : undefined;
  return headerKey || bearer || queryToken;
}

function flattenObject(obj: AnyObject, prefix = '', out: AnyObject = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      flattenObject(v as AnyObject, key, out);
    } else {
      out[key] = v;
    }
  }
  return out;
}

function toCSV(items: AnyObject[]) {
  if (!Array.isArray(items) || items.length === 0) return '';
  const flatItems = items.map(it => flattenObject(it || {}));
  const headerSet = new Set<string>();
  flatItems.forEach(it => Object.keys(it).forEach(k => headerSet.add(k)));
  const headers = Array.from(headerSet);
  const escape = (v: any) => {
    if (v === null || v === undefined) return '';
    const s = typeof v === 'object' ? JSON.stringify(v) : String(v);
    if (s.includes(',') || s.includes('\n') || s.includes('"')) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };
  const rows = flatItems.map(it => headers.map(h => escape(it[h])).join(','));
  return [headers.join(','), ...rows].join('\n');
}

// Defensive file read + optional restore from backup
async function safeReadJson(filePath: string, restoreFrom?: string) {
  try {
    const raw = await fs.promises.readFile(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`safeReadJson: failed to read/parse ${filePath}`, err);
    if (restoreFrom) {
      try {
        const backupRaw = await fs.promises.readFile(restoreFrom, 'utf-8');
        await fs.promises.writeFile(filePath, backupRaw, 'utf-8');
        console.warn(`safeReadJson: restored ${filePath} from ${restoreFrom}`);
        return JSON.parse(backupRaw);
      } catch (err2) {
        console.error(`safeReadJson: failed to restore ${filePath} from ${restoreFrom}`, err2);
      }
    }
    throw err;
  }
}

async function validateAgainstSchema(data: any) {
  // Try to use AJV if available for strict JSON Schema validation
  try {
    // dynamic import so project won't fail if ajv isn't installed
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Ajv = require('ajv');
    const ajv = new Ajv({ allErrors: true, strict: false });
    const schemaRaw = await fs.promises.readFile(schemaFile, 'utf-8');
    const schema = JSON.parse(schemaRaw);
    const validate = ajv.compile(schema);
    const valid = validate(data);
    return { valid, errors: (validate.errors || []).map((e: any) => `${e.instancePath} ${e.message}`) };
  } catch (err) {
    // If AJV not available, perform a minimal defensive validation (best-effort)
    const errors: string[] = [];
    if (!data) errors.push('empty payload');
    if (!data.make) errors.push('missing make');
    if (!data.model) errors.push('missing model');
    if (!data.price) errors.push('missing price');
    const valid = errors.length === 0;
    return { valid, errors };
  }
}

function normalizeMaintenance(items: any[]): any[] {
  if (!Array.isArray(items)) return [];
  return items.map((it) => {
    if (!it) return null;
    if (typeof it === 'object') return it; // already normalized
    const s = String(it || '').trim();
    // Try to extract a leading date like 2023-05-12 or 12/05/2023
    const iso = s.match(/(\d{4}-\d{2}-\d{2})/);
    const euro = s.match(/(\d{2}\/\d{2}\/\d{4})/);
    const date = iso ? iso[1] : euro ? euro[1] : null;
    const desc = s.replace(date || '', '').trim();
    return { date, desc: desc || s };
  }).filter(Boolean);
}

async function commitToGitHub(repo: string, filePathInRepo: string, contentBuffer: Buffer, message = 'Update data') {
  const apiBase = `https://api.github.com/repos/${repo}/contents/${filePathInRepo}`;
  const b64 = contentBuffer.toString('base64');
  // Try GET to obtain existing sha
  const headers = {
    'Authorization': `token ${GITHUB_TOKEN}`,
    'User-Agent': 'autogo-api',
    'Accept': 'application/vnd.github.v3+json',
  };
  let sha: string | undefined = undefined;
  try {
    const getResp = await fetch(apiBase + `?ref=${encodeURIComponent(GITHUB_BRANCH)}`, { headers });
    if (getResp.status === 200) {
      const existing = await getResp.json();
      sha = existing.sha;
    }
  } catch (err) {
    // ignore and attempt create
  }

  const body = {
    message,
    content: b64,
    branch: GITHUB_BRANCH,
    ...(sha ? { sha } : {}),
  } as any;

  const putResp = await fetch(apiBase, {
    method: 'PUT',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const result = await putResp.json();
  if (!putResp.ok) throw new Error(JSON.stringify(result));
  return result;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method || 'GET';
  try {
    // Keep existing GET behavior
    if (method === 'GET') {
      if (API_KEY) {
        const token = extractToken(req);
        if (!token || token !== API_KEY) {
          return res.status(401).json({ error: 'Unauthorized' });
        }
      }
      const fileParam = typeof req.query.file === 'string' ? req.query.file : 'cars';
      const format = typeof req.query.format === 'string' ? req.query.format : 'json';
      const target = fileParam === 'full' ? carsFullFile : carsFile;
      const data = await safeReadJson(target, target === carsFile ? carsFullFile : undefined);
      if (format === 'csv') {
        const csv = toCSV(Array.isArray(data) ? data : [data]);
        res.setHeader('Content-Type', 'text/csv');
        return res.status(200).send(csv);
      }
      return res.status(200).json(data);
    }

    // For write operations require API key
    if (['POST', 'DELETE'].includes(method)) {
      const token = extractToken(req);
      if (!API_KEY || !token || token !== API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
    }

    if (method === 'POST') {
      const body = req.body;
      if (!body || typeof body !== 'object') {
        return res.status(400).json({ error: 'Invalid body' });
      }

      // Validate against JSON Schema (AJV preferred)
      const { valid, errors } = await validateAgainstSchema(body);

      // Normalize maintenance and coercions defensively
      const maintenance = normalizeMaintenance(Array.isArray(body.maintenance) ? body.maintenance : []);

      // Read existing full cars file to compute a new id and to include in commit
      const fullCars = (await safeReadJson(carsFullFile, carsFile)) as AnyObject[];
      const existingIds = new Set(fullCars.map(c => String(c.id)));
      let newId = body.id ? String(body.id) : String(Date.now());
      while (existingIds.has(newId)) newId = String(Date.now() + Math.floor(Math.random() * 10000));

      const newCar = {
        ...body,
        id: newId,
        maintenance,
        unitNumber: body.unitNumber ?? null, // keep for internal use
      };

      // Build envelope
      const schemaRaw = await fs.promises.readFile(schemaFile, 'utf-8').catch(() => '{}');
      let schemaVersion = '1';
      try { const s = JSON.parse(schemaRaw); schemaVersion = s.$id || s.version || schemaVersion; } catch (e) {}
      const envelope: any = { schemaVersion, valid: Boolean(valid), errors: errors || [], car: newCar, summary: '' };

      // If GitHub token + repo configured, attempt to commit to repo
      if (GITHUB_TOKEN && GITHUB_REPO) {
        try {
          // Update full dataset in memory
          const updatedFull = Array.isArray(fullCars) ? [...fullCars, newCar] : [newCar];
          const payload = JSON.stringify(updatedFull, null, 2);
          const commitMsg = `Add car ${newId} via API`;
          const result = await commitToGitHub(GITHUB_REPO, 'data/cars.full.json', Buffer.from(payload, 'utf-8'), commitMsg);
          envelope.summary = `Committed to GitHub repo ${GITHUB_REPO} (${result.content?.path || 'data/cars.full.json'})`;

          // Also update runtime cars.json locally for immediate availability in this environment
          try {
            const slim = Array.isArray(fullCars) ? [...fullCars, newCar] : [newCar];
            await fs.promises.writeFile(carsFullFile, payload, 'utf-8');
            // write a lightweight cars.json (slim) by mapping to existing structure if present
            const existingSlim = (await safeReadJson(carsFile, carsFullFile)) as AnyObject[];
            const newSlim = Array.isArray(existingSlim) ? [...existingSlim, newCar] : [newCar];
            await fs.promises.writeFile(carsFile, JSON.stringify(newSlim, null, 2), 'utf-8');
          } catch (e) {
            // ignore local write errors
            console.warn('Local write after GitHub commit failed', e);
          }

          return res.status(201).json(envelope);
        } catch (err) {
          console.error('GitHub commit failed', err);
          envelope.summary = `GitHub commit failed: ${String(err)}`;
          // Fall through to local write fallback
        }
      }

      // Fallback: write to local files (cars.full.json + cars.json) so site can use data without GitHub
      try {
        const updatedFull = Array.isArray(fullCars) ? [...fullCars, newCar] : [newCar];
        await fs.promises.writeFile(carsFullFile, JSON.stringify(updatedFull, null, 2), 'utf-8');
        const existingSlim = (await safeReadJson(carsFile, carsFullFile)) as AnyObject[];
        const newSlim = Array.isArray(existingSlim) ? [...existingSlim, newCar] : [newCar];
        await fs.promises.writeFile(carsFile, JSON.stringify(newSlim, null, 2), 'utf-8');
        envelope.summary = 'Wrote to local data files (no GitHub commit)';
        return res.status(201).json(envelope);
      } catch (err) {
        console.error('Local write failed', err);
        return res.status(500).json({ error: 'Failed to persist car', details: String(err) });
      }
    }

    if (method === 'DELETE') {
      const idFromQuery = typeof req.query.id === 'string' ? req.query.id : undefined;
      const idFromBody = req.body && (req.body.id || req.body._id) ? String(req.body.id ?? req.body._id) : undefined;
      const id = idFromQuery || idFromBody;
      if (!id) return res.status(400).json({ error: 'Missing car id.' });

      const cars = (await safeReadJson(carsFile, carsFullFile)) as AnyObject[];
      const filtered = cars.filter(c => String(c.id) !== String(id));
      if (filtered.length === cars.length) return res.status(404).json({ error: 'Car not found.' });
      await fs.promises.writeFile(carsFile, JSON.stringify(filtered, null, 2), 'utf-8');
      return res.status(200).json({ success: true });
    }

    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${method} Not Allowed`);
  } catch (err) {
    console.error('API /api/cars error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
