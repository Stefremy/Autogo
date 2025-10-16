import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs/promises'
import path from 'path'

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
    const raw = await fs.readFile(filePath, 'utf8')
    const items = JSON.parse(raw || '[]') as any[]

    const idStr = String(id)
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
