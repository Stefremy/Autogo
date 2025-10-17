// Minimal server-side blob client for Autogo
// - Provides a simple abstraction: getObject, putObject, deleteObject, listObjects
// - For local development (no AUTOGO_BLOB_READ_WRITE_TOKEN) it uses the filesystem under data/blob/<bucket>
// - If you wire up a real provider, set AUTOGO_BLOB_PROVIDER to one of: "vercel" | "s3" and configure
//   provider-specific env vars (see comments below). This file includes example pseudocode for each.

import fs from 'fs';
import path from 'path';

const TOKEN = process.env.AUTOGO_BLOB_READ_WRITE_TOKEN;
const STORE = process.env.AUTOGO_BLOB_STORE_NAME || 'autogo-we9-blob';
const PROVIDER = (process.env.AUTOGO_BLOB_PROVIDER || '').toLowerCase();
const API_BASE = process.env.AUTOGO_BLOB_API_BASE || ''; // e.g. for custom providers

type BlobMeta = { size?: number; contentType?: string; [k: string]: any };

function localBucketPath(bucket: string) {
  return path.join(process.cwd(), 'data', 'blob', bucket);
}

async function ensureLocalDir(bucket: string) {
  const dir = localBucketPath(bucket);
  await fs.promises.mkdir(dir, { recursive: true }).catch(() => {});
  return dir;
}

// Read object. Returns Buffer or throws if not found.
export async function getObject(bucket: string, key: string): Promise<Buffer> {
  if (!TOKEN || PROVIDER === '') {
    // Local fs mode
    const dir = await ensureLocalDir(bucket);
    const file = path.join(dir, key);
    const exists = await fs.promises.stat(file).then(s => s.isFile()).catch(() => false);
    if (!exists) throw new Error('NotFound');
    return fs.promises.readFile(file);
  }

  // Provider mode: try to use a simple HTTP GET. You will likely need to adapt this to the
  // exact blob provider API (Vercel Blob, Supabase Storage, AWS S3, etc.).
  if (PROVIDER === 'vercel') {
    // Vercel Blob: simple GET to the object endpoint to retrieve raw bytes. You may need
    // to request a signed URL first in some setups; adapt if the API returns a redirect.
    const url = `${API_BASE || 'https://api.vercel.com'}/v1/blob/stores/${encodeURIComponent(STORE)}/objects/${encodeURIComponent(bucket + '/' + key)}`;
    const resp = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
    if (resp.status === 404) throw new Error('NotFound');
    if (!resp.ok) throw new Error(`Failed to fetch object: ${resp.status}`);
    const buf = Buffer.from(await resp.arrayBuffer());
    return buf;
  }

  // Generic HTTP provider (user can set AUTOGO_BLOB_API_BASE to a provider that supports GET/PUT/DELETE on /objects/<key>)
  if (API_BASE) {
    const url = `${API_BASE.replace(/\/$/, '')}/objects/${encodeURIComponent(bucket + '/' + key)}`;
    const resp = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
    if (resp.status === 404) throw new Error('NotFound');
    if (!resp.ok) throw new Error(`Failed to fetch object: ${resp.status}`);
    return Buffer.from(await resp.arrayBuffer());
  }

  throw new Error('Blob provider not configured. Set AUTOGO_BLOB_PROVIDER and provider-specific env vars.');
}

// Write object. Accepts Buffer | string. Returns metadata object on success.
export async function putObject(bucket: string, key: string, data: Buffer | string, meta?: BlobMeta) {
  if (!TOKEN || PROVIDER === '') {
    const dir = await ensureLocalDir(bucket);
    const file = path.join(dir, key);
    await fs.promises.mkdir(path.dirname(file), { recursive: true }).catch(() => {});
    if (typeof data === 'string') await fs.promises.writeFile(file, data, 'utf-8');
    else await fs.promises.writeFile(file, data);
    return { key, size: typeof data === 'string' ? Buffer.byteLength(data) : data.length };
  }

  if (PROVIDER === 'vercel') {
    // Simplified: PUT the raw bytes to the object URL. Real Vercel API may require a signed upload URL first.
    const url = `${API_BASE || 'https://api.vercel.com'}/v1/blob/stores/${encodeURIComponent(STORE)}/objects/${encodeURIComponent(bucket + '/' + key)}`;
    const resp = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': meta?.contentType || 'application/octet-stream',
      },
      body: data,
    });
    if (!resp.ok) {
      const txt = await resp.text().catch(() => '');
      throw new Error(`Failed to put object: ${resp.status} ${txt}`);
    }
    return { key, size: (meta && meta.size) || (typeof data === 'string' ? Buffer.byteLength(data) : (data as Buffer).length) };
  }

  if (API_BASE) {
    const url = `${API_BASE.replace(/\/$/, '')}/objects/${encodeURIComponent(bucket + '/' + key)}`;
    const resp = await fetch(url, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': meta?.contentType || 'application/octet-stream' },
      body: data,
    });
    if (!resp.ok) throw new Error(`Failed to put object: ${resp.status}`);
    return { key };
  }

  throw new Error('Blob provider not configured.');
}

export async function deleteObject(bucket: string, key: string) {
  if (!TOKEN || PROVIDER === '') {
    const dir = await ensureLocalDir(bucket);
    const file = path.join(dir, key);
    await fs.promises.unlink(file).catch(() => { throw new Error('NotFound'); });
    return { deleted: true };
  }

  if (PROVIDER === 'vercel') {
    const url = `${API_BASE || 'https://api.vercel.com'}/v1/blob/stores/${encodeURIComponent(STORE)}/objects/${encodeURIComponent(bucket + '/' + key)}`;
    const resp = await fetch(url, { method: 'DELETE', headers: { Authorization: `Bearer ${TOKEN}` } });
    if (resp.status === 404) throw new Error('NotFound');
    if (!resp.ok) {
      const txt = await resp.text().catch(() => '');
      throw new Error(`Failed to delete object: ${resp.status} ${txt}`);
    }
    return { deleted: true };
  }

  if (API_BASE) {
    const url = `${API_BASE.replace(/\/$/, '')}/objects/${encodeURIComponent(bucket + '/' + key)}`;
    const resp = await fetch(url, { method: 'DELETE', headers: { Authorization: `Bearer ${TOKEN}` } });
    if (resp.status === 404) throw new Error('NotFound');
    if (!resp.ok) throw new Error(`Failed to delete object: ${resp.status}`);
    return { deleted: true };
  }

  throw new Error('Blob provider not configured.');
}

// List objects under prefix. Returns array of keys (strings).
export async function listObjects(bucket: string, prefix = ''): Promise<string[]> {
  if (!TOKEN || PROVIDER === '') {
    const dir = await ensureLocalDir(bucket);
    const files = await fs.promises.readdir(dir).catch(() => []);
    return files.filter(f => f.startsWith(prefix));
  }

  if (PROVIDER === 'vercel') {
    // Vercel has an API to list objects. This is a simplified guess — adapt to exact API.
    const url = `${API_BASE || 'https://api.vercel.com'}/v1/blob/stores/${encodeURIComponent(STORE)}/objects?prefix=${encodeURIComponent(bucket + '/' + prefix)}`;
    const resp = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
    if (!resp.ok) throw new Error(`Failed to list objects: ${resp.status}`);
    const json = await resp.json().catch(() => ({ objects: [] }));
    // expected shape: { objects: [ { key: 'cars/123.json' }, ... ] }
    const objs = Array.isArray(json.objects) ? json.objects : [];
    return objs.map((o: any) => String(o.key).replace(new RegExp(`^${bucket}/`), ''));
  }

  if (API_BASE) {
    const url = `${API_BASE.replace(/\/$/, '')}/objects?prefix=${encodeURIComponent(bucket + '/' + prefix)}`;
    const resp = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
    if (!resp.ok) throw new Error(`Failed to list objects: ${resp.status}`);
    const json = await resp.json().catch(() => ({ objects: [] }));
    return (json.objects || []).map((o: any) => String(o.key).replace(new RegExp(`^${bucket}/`), ''));
  }

  throw new Error('Blob provider not configured.');
}

export default {
  getObject,
  putObject,
  deleteObject,
  listObjects,
};
