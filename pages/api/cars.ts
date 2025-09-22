import fs from "fs";
import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";

const carsFile = path.join(process.cwd(), "data/cars.json");
const carsFullFile = path.join(process.cwd(), "data/cars.full.json");
const API_KEY = process.env.API_KEY;

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method || 'GET';
  try {
    // Decide which file to operate on for GET reads (allows returning the full backup)
    if (method === 'GET') {
      // If an API_KEY is set on the server, require a token for GET as well
      if (API_KEY) {
        const token = extractToken(req);
        if (!token || token !== API_KEY) {
          return res.status(401).json({ error: 'Unauthorized' });
        }
      }
      const fileParam = typeof req.query.file === 'string' ? req.query.file : 'cars';
      const format = typeof req.query.format === 'string' ? req.query.format : 'json';
      const target = fileParam === 'full' ? carsFullFile : carsFile;
      const raw = await fs.promises.readFile(target, 'utf-8');
      const data = JSON.parse(raw);
      if (format === 'csv') {
        const csv = toCSV(Array.isArray(data) ? data : [data]);
        res.setHeader('Content-Type', 'text/csv');
        return res.status(200).send(csv);
      }
      return res.status(200).json(data);
    }

    // For write operations require a valid token
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
      const raw = await fs.promises.readFile(carsFile, 'utf-8');
      const cars = JSON.parse(raw) as AnyObject[];
      // ensure unique id
      const existingIds = new Set(cars.map(c => String(c.id)));
      let newId = body.id ? String(body.id) : String(Date.now());
      while (existingIds.has(newId)) newId = String(Date.now() + Math.floor(Math.random() * 10000));
      const newCar = { ...body, id: newId, status: body.status ?? '' };
      cars.push(newCar);
      await fs.promises.writeFile(carsFile, JSON.stringify(cars, null, 2), 'utf-8');
      return res.status(201).json(newCar);
    }

    if (method === 'DELETE') {
      // accept id in query or JSON body
      const idFromQuery = typeof req.query.id === 'string' ? req.query.id : undefined;
      const idFromBody = req.body && (req.body.id || req.body._id) ? String(req.body.id ?? req.body._id) : undefined;
      const id = idFromQuery || idFromBody;
      if (!id) return res.status(400).json({ error: 'Missing car id.' });

      const raw = await fs.promises.readFile(carsFile, 'utf-8');
      const cars = JSON.parse(raw) as AnyObject[];
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
