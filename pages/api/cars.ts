import fs from "fs";
import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";
import { spawn } from 'child_process';

const carsFile = path.join(process.cwd(), "data/cars.json");
const carsFullFile = path.join(process.cwd(), "data/cars.full.json");
const schemaFile = path.join(process.cwd(), "data/schema/car.schema.json");
const API_KEY = process.env.API_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO; // owner/repo
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';
const ADMIN_REVALIDATE_TOKEN = process.env.ADMIN_REVALIDATE_TOKEN;

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

// Helper: spawn normalization/sync scripts in background (non-blocking)
function runBackgroundScripts() {
  try {
    const node = process.execPath;
    const scripts = [
      path.join(process.cwd(), 'scripts', 'normalize-cars.js'),
      path.join(process.cwd(), 'scripts', 'sync-car-data.js'),
    ];
    scripts.forEach((s) => {
      if (!fs.existsSync(s)) return;
      const child = spawn(node, [s], {
        detached: true,
        stdio: 'ignore',
      });
      child.unref();
    });
  } catch (err) {
    console.warn('runBackgroundScripts error', err);
  }
}

async function commitSlimWithRetry(repo: string, filePathInRepo: string, newCar: AnyObject, message = 'Update data', maxAttempts = 5) {
  const apiBase = `https://api.github.com/repos/${repo}/contents/${filePathInRepo}`;
  const headers = {
    'Authorization': `token ${GITHUB_TOKEN}`,
    'User-Agent': 'autogo-api',
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  };

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      // Fetch current remote file (if exists)
      const getResp = await fetch(apiBase + `?ref=${encodeURIComponent(GITHUB_BRANCH)}`, { headers });
      let remoteArr: AnyObject[] = [];
      let sha: string | undefined;
      if (getResp.status === 200) {
        const existing = await getResp.json();
        sha = existing.sha;
        try {
          const raw = Buffer.from(existing.content || '', existing.encoding || 'base64').toString('utf-8');
          const parsed = JSON.parse(raw);
          remoteArr = Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          // if parse fails, treat as empty array
          remoteArr = [];
        }
      } else if (getResp.status === 404) {
        remoteArr = [];
      } else {
        // unexpected status, throw to trigger retry
        const txt = await getResp.text().catch(() => '');
        throw new Error(`Failed to fetch remote file: status ${getResp.status} ${txt}`);
      }

      // Merge new car (dedupe by id)
      const id = String(newCar.id);
      const idx = remoteArr.findIndex((c: AnyObject) => String(c.id) === id);
      if (idx >= 0) {
        remoteArr[idx] = { ...remoteArr[idx], ...newCar };
      } else {
        remoteArr.push(newCar);
      }

      const payload = JSON.stringify(remoteArr, null, 2);
      const b64 = Buffer.from(payload, 'utf-8').toString('base64');

      const body: any = { message, content: b64, branch: GITHUB_BRANCH };
      if (sha) body.sha = sha;

      const putResp = await fetch(apiBase, { method: 'PUT', headers, body: JSON.stringify(body) });
      const putResult = await putResp.json().catch(() => ({}));
      if (putResp.ok) return putResult;

      // If the error suggests a sha conflict or remote changed, retry
      const errMsg = JSON.stringify(putResult || {});
      if (putResp.status === 409 || errMsg.includes('sha') || errMsg.includes('merge')) {
        const backoff = Math.min(2000 * attempt, 10000);
        await sleep(backoff + Math.floor(Math.random() * 200));
        continue; // retry loop
      }

      // Non-retryable error
      throw new Error(`GitHub PUT failed: ${putResp.status} ${errMsg}`);
    } catch (err) {
      if (attempt === maxAttempts) throw err;
      const backoff = Math.min(500 * attempt, 3000);
      await sleep(backoff + Math.floor(Math.random() * 100));
      // continue to next attempt
    }
  }
}

async function commitArrayWithRetry(repo: string, filePathInRepo: string, items: AnyObject[], message = 'Update data', maxAttempts = 5) {
  const apiBase = `https://api.github.com/repos/${repo}/contents/${filePathInRepo}`;
  const headers = {
    'Authorization': `token ${GITHUB_TOKEN}`,
    'User-Agent': 'autogo-api',
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  };
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const getResp = await fetch(apiBase + `?ref=${encodeURIComponent(GITHUB_BRANCH)}`, { headers });
      let remoteArr: AnyObject[] = [];
      let sha: string | undefined;
      if (getResp.status === 200) {
        const existing = await getResp.json();
        sha = existing.sha;
        try {
          const raw = Buffer.from(existing.content || '', existing.encoding || 'base64').toString('utf-8');
          const parsed = JSON.parse(raw);
          remoteArr = Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          remoteArr = [];
        }
      } else if (getResp.status === 404) {
        remoteArr = [];
      } else {
        const txt = await getResp.text().catch(() => '');
        throw new Error(`Failed to fetch remote file: status ${getResp.status} ${txt}`);
      }

      // Merge items into remoteArr by id (replace or append)
      const byId = new Map<string, AnyObject>();
      remoteArr.forEach((r) => { if (r && r.id) byId.set(String(r.id), r); });
      items.forEach((it) => { if (it && it.id) {
        const id = String(it.id);
        const existing = byId.get(id) || {};
        byId.set(id, { ...existing, ...it });
      }});
      const merged = Array.from(byId.values());

      const payload = JSON.stringify(merged, null, 2);
      const b64 = Buffer.from(payload, 'utf-8').toString('base64');

      const body: any = { message, content: b64, branch: GITHUB_BRANCH };
      if (sha) body.sha = sha;

      const putResp = await fetch(apiBase, { method: 'PUT', headers, body: JSON.stringify(body) });
      const putResult = await putResp.json().catch(() => ({}));
      if (putResp.ok) return { result: putResult, attempts: attempt };

      const errMsg = JSON.stringify(putResult || {});
      if (putResp.status === 409 || errMsg.includes('sha') || errMsg.includes('merge')) {
        const backoff = Math.min(2000 * attempt, 10000);
        await sleep(backoff + Math.floor(Math.random() * 200));
        continue; // retry
      }

      throw new Error(`GitHub PUT failed: ${putResp.status} ${errMsg}`);
    } catch (err) {
      if (attempt === maxAttempts) throw err;
      const backoff = Math.min(500 * attempt, 3000);
      await sleep(backoff + Math.floor(Math.random() * 100));
    }
  }
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

      // Read existing slim cars file to compute a new id and to include in commit/write
      let existingSlim = [] as AnyObject[];
      try { existingSlim = (await safeReadJson(carsFile, carsFullFile)) || []; } catch (e) { existingSlim = []; }
      const existingIds = new Set(existingSlim.map(c => String(c.id)));

      // If client supplied an explicit id, block the request when that id already exists.
      // This prevents accidental overwrites or silent merges when a caller tries to create
      // a new car with an id that is already present. Return HTTP 409 Conflict.
      if (body.id) {
        const requestedId = String(body.id);
        if (existingIds.has(requestedId)) {
          return res.status(409).json({ error: 'Duplicate id', message: `Car with id ${requestedId} already exists` });
        }
      }

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

      // Prepare slim payload to use for local write and optional GitHub commit
      const updatedSlimLocal = Array.isArray(existingSlim) ? [...existingSlim, newCar] : [newCar];
      const payloadSlimLocal = JSON.stringify(updatedSlimLocal, null, 2);

      // Always write runtime slim file first so Next.js runtime sees the new car immediately
      let localWritten = false;
      try {
        await fs.promises.writeFile(carsFile, payloadSlimLocal, 'utf-8');
        envelope.summary = 'Wrote to local slim data file (data/cars.json)';
        localWritten = true;
      } catch (e) {
        console.warn('Initial local write to data/cars.json failed', e);
      }

      // If GitHub token + repo configured, attempt to commit only the slim file to repo using a merge-and-retry approach
      if (GITHUB_TOKEN && GITHUB_REPO) {
        try {
          const commitMsg = `Add car ${newId} via API`;
          const resultSlim = await commitSlimWithRetry(GITHUB_REPO, 'data/cars.json', newCar, commitMsg, 5);
          envelope.summary = `Committed merged car to GitHub repo ${GITHUB_REPO} (data/cars.json)`;

          // Ensure runtime local file exists (in case commit path was used earlier)
          try {
            if (!localWritten) {
              await fs.promises.writeFile(carsFile, payloadSlimLocal, 'utf-8');
              localWritten = true;
            }
          } catch (e) {
            console.warn('Local write after GitHub commit failed', e);
          }

          // Run normalization/sync in background only if explicitly enabled via env
          if (process.env.RUN_NORMALIZE_ON_WRITE === 'true') runBackgroundScripts();

          // Attempt secure revalidation if ADMIN_REVALIDATE_TOKEN provided and matches header
          try {
            const revalidateHeader = (req.headers['x-admin-revalidate'] as string) || '';
            if (ADMIN_REVALIDATE_TOKEN && revalidateHeader === ADMIN_REVALIDATE_TOKEN) {
              try {
                await (res as any).revalidate(`/cars/${newCar.slug || newCar.id}`);
                await (res as any).revalidate('/viaturas');
                envelope.revalidated = true;
              } catch (e) {
                envelope.revalidateError = String(e);
              }
            } else {
              envelope.revalidated = false;
            }
          } catch (e) {
            envelope.revalidateError = String(e);
          }

          return res.status(201).json(envelope);
        } catch (err) {
          console.error('GitHub commit (merge+retry) failed', err);
          envelope.summary = `GitHub commit failed: ${String(err)}`;
          // Fall through to return local-written result or attempt fallback write
        }
      }

      // If we already wrote locally above return success; otherwise attempt local fallback write to slim file
      if (localWritten) {
        // Run normalization/sync in background only if explicitly enabled via env
        if (process.env.RUN_NORMALIZE_ON_WRITE === 'true') runBackgroundScripts();

        // Revalidation attempt (secure)
        try {
          const revalidateHeader = (req.headers['x-admin-revalidate'] as string) || '';
          if (ADMIN_REVALIDATE_TOKEN && revalidateHeader === ADMIN_REVALIDATE_TOKEN) {
            try {
              await (res as any).revalidate(`/cars/${newCar.slug || newCar.id}`);
              await (res as any).revalidate('/viaturas');
              envelope.revalidated = true;
            } catch (e) {
              envelope.revalidateError = String(e);
            }
          } else {
            envelope.revalidated = false;
          }
        } catch (e) {
          envelope.revalidateError = String(e);
        }

        return res.status(201).json(envelope);
      }

      // Fallback: write to local slim file (cars.json) so site can use data without GitHub
      try {
        const existing = (await safeReadJson(carsFile, carsFullFile)) as AnyObject[];
        const newSlim = Array.isArray(existing) ? [...existing, newCar] : [newCar];
        await fs.promises.writeFile(carsFile, JSON.stringify(newSlim, null, 2), 'utf-8');
        envelope.summary = 'Wrote to local slim data file (no GitHub commit)';

        // Run background scripts and attempt revalidation as above (conditional)
        if (process.env.RUN_NORMALIZE_ON_WRITE === 'true') runBackgroundScripts();
        try {
          const revalidateHeader = (req.headers['x-admin-revalidate'] as string) || '';
          if (ADMIN_REVALIDATE_TOKEN && revalidateHeader === ADMIN_REVALIDATE_TOKEN) {
            try {
              await (res as any).revalidate(`/cars/${newCar.slug || newCar.id}`);
              await (res as any).revalidate('/viaturas');
              envelope.revalidated = true;
            } catch (e) {
              envelope.revalidateError = String(e);
            }
          } else {
            envelope.revalidated = false;
          }
        } catch (e) {
          envelope.revalidateError = String(e);
        }

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

      // Remove from slim runtime file
      const cars = (await safeReadJson(carsFile, carsFullFile)) as AnyObject[];
      const filtered = cars.filter(c => String(c.id) !== String(id));
      if (filtered.length === cars.length) return res.status(404).json({ error: 'Car not found.' });

      // Write updated slim file locally
      try {
        await fs.promises.writeFile(carsFile, JSON.stringify(filtered, null, 2), 'utf-8');
      } catch (e) {
        console.error('Failed to write slim cars file on delete', e);
        return res.status(500).json({ error: 'Failed to update slim dataset', details: String(e) });
      }

      // Soft-delete in full dataset: add status and removed metadata
      try {
        const full = (await safeReadJson(carsFullFile)) as AnyObject[];
        const idx = (full || []).findIndex((c: AnyObject) => String(c.id) === String(id));
        let fullUpdated = full || [];
        const removedByHeader = (req.headers['x-removed-by'] as string) || (req.headers['x-deleted-by'] as string) || 'api';
        const removedAt = new Date().toISOString();
        if (idx >= 0) {
          // mark existing entry as removed (preserve original data)
          const updated = { ...(fullUpdated[idx] || {}), status: 'removed', removedAt, removedBy: removedByHeader } as AnyObject;
          fullUpdated = [...fullUpdated];
          fullUpdated[idx] = updated;
        } else {
          // if not present in full, create a minimal removed record
          fullUpdated = [...fullUpdated, { id, status: 'removed', removedAt, removedBy: removedByHeader }];
        }

        // write full locally
        await fs.promises.writeFile(carsFullFile, JSON.stringify(fullUpdated, null, 2), 'utf-8');

        const responseEnvelope: any = { success: true, deletedId: id, summary: 'Removed from slim and soft-marked in full dataset' };

        // If GitHub configured, attempt to commit both files (full + slim)
        if (GITHUB_TOKEN && GITHUB_REPO) {
          try {
            // Commit full dataset using merge+retry so we don't clobber remote changes
            let fullCommitInfo: any = null;
            try {
              fullCommitInfo = await commitArrayWithRetry(GITHUB_REPO, 'data/cars.full.json', fullUpdated, `Soft-remove car ${id} in full dataset via API`, 5);
            } catch (e) {
              responseEnvelope.fullCommitError = String(e);
            }

            // Commit slim dataset using existing commitSlimWithRetry (merge+retry for slim)
            let slimCommitInfo: any = null;
            try {
              slimCommitInfo = await commitSlimWithRetry(GITHUB_REPO, 'data/cars.json', null as any, `Remove car ${id} from slim dataset via API`, 5);
              // Note: commitSlimWithRetry expects a car object to merge; for deletes we supply null to trigger a fetch+write of filtered content below
            } catch (e) {
              // Fallback: perform a direct commit of the filtered slim array using commitArrayWithRetry
              try {
                slimCommitInfo = await commitArrayWithRetry(GITHUB_REPO, 'data/cars.json', filtered, `Remove car ${id} from slim dataset via API`, 5);
              } catch (ee) {
                responseEnvelope.slimCommitError = String(ee);
              }
            }

            if (fullCommitInfo || slimCommitInfo) {
              responseEnvelope.summary = `Committed updates to ${GITHUB_REPO}`;
              responseEnvelope.committed = true;
              if (fullCommitInfo) responseEnvelope.fullCommitAttempts = fullCommitInfo.attempts || 1;
              if (slimCommitInfo) responseEnvelope.slimCommitAttempts = slimCommitInfo.attempts || 1;
            } else {
              responseEnvelope.committed = false;
            }
          } catch (e) {
            console.error('GitHub commit during delete failed', e);
            responseEnvelope.commitError = String(e);
            responseEnvelope.committed = false;
          }
        }

        // Run background scripts
        runBackgroundScripts();

        // Attempt secure revalidation
        try {
          const revalidateHeader = (req.headers['x-admin-revalidate'] as string) || '';
          if (ADMIN_REVALIDATE_TOKEN && revalidateHeader === ADMIN_REVALIDATE_TOKEN) {
            try {
              await (res as any).revalidate('/viaturas');
              // Also revalidate list endpoints or index if present
              responseEnvelope.revalidated = true;
            } catch (e) {
              responseEnvelope.revalidateError = String(e);
            }
          } else {
            responseEnvelope.revalidated = false;
          }
        } catch (e) {
          responseEnvelope.revalidateError = String(e);
        }

        return res.status(200).json(responseEnvelope);
      } catch (err) {
        console.error('Failed to update full dataset on delete', err);
        return res.status(500).json({ error: 'Failed to update full dataset', details: String(err) });
      }
    }

    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${method} Not Allowed`);
  } catch (err) {
    console.error('API /api/cars error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
