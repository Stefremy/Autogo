import fs from 'fs/promises'
import path from 'path'
import type { NextApiRequest, NextApiResponse } from 'next'
import blob from '../../../lib/blob';

const BLOB_BUCKET = process.env.AUTOGO_BLOB_BUCKET || 'cars';

type Data = { ok?: boolean; id?: string; error?: string }

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { id } = req.query

  if (!id) return res.status(400).json({ error: 'Missing id' })

  if (req.method !== 'DELETE') {
    res.setHeader('Allow', 'DELETE')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const filePath = path.join(process.cwd(), 'data', 'cars.json')

  try {
    const idStr = String(id);

    // If blob token present try deleting the per-car object first (preferred for production)
    if (process.env.AUTOGO_BLOB_READ_WRITE_TOKEN) {
      try {
        await blob.deleteObject(BLOB_BUCKET, `${idStr}.json`);
        // Try to update local slim index if present so runtime reflects removal
        try {
          const raw = await fs.readFile(filePath, 'utf8').catch(() => '[]');
          const items = JSON.parse(raw || '[]') as any[];
          const filtered = items.filter((it) => String(it.id) !== idStr);
          if (filtered.length !== items.length) {
            const tmp = `${filePath}.tmp`;
            await fs.writeFile(tmp, JSON.stringify(filtered, null, 2), 'utf8').catch(() => {});
            await fs.rename(tmp, filePath).catch(() => {});
          }
        } catch {
          // non-fatal
        }
        return res.status(200).json({ ok: true, id: idStr });
      } catch (err: any) {
        // If blob reports not found, return 404; otherwise fall through to filesystem path
        if (String(err).toLowerCase().includes('notfound') || String(err).includes('NotFound') || (err && err.message && err.message.includes('NotFound'))) {
          return res.status(404).json({ error: 'Not found' });
        }
        console.warn('Blob delete failed, falling back to filesystem delete', err);
        // continue to filesystem delete below
      }
    }

    // Filesystem fallback (existing behavior)
    const raw = await fs.readFile(filePath, 'utf8')
    const items = JSON.parse(raw || '[]') as any[]

    const filtered = items.filter((it) => String(it.id) !== idStr)

    if (filtered.length === items.length) {
      return res.status(404).json({ error: 'Not found' })
    }

    // atomic write
    const tmp = `${filePath}.tmp`
    await fs.writeFile(tmp, JSON.stringify(filtered, null, 2), 'utf8')
    await fs.rename(tmp, filePath)

    return res.status(200).json({ ok: true, id: idStr })
  } catch (err: any) {
    console.error('DELETE /api/cars/[id] error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
