import type { NextApiRequest, NextApiResponse } from 'next';

// Simple server-side image proxy to avoid CORS issues when embedding remote images
// Usage: /api/image-proxy?url=<encoded-url>
// Security: only allow http/https and basic validation to avoid SSRF. This is a minimal implementation.

const ALLOWED_PROTOCOLS = ['http:', 'https:'];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;
  if (!url || Array.isArray(url)) {
    res.status(400).json({ error: 'Missing url parameter' });
    return;
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    res.status(400).json({ error: 'Invalid URL' });
    return;
  }

  if (!ALLOWED_PROTOCOLS.includes(parsed.protocol)) {
    res.status(400).json({ error: 'Unsupported protocol' });
    return;
  }

  // Basic host allowlist could be added here. For now allow any host but limit size and time.

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000); // 10s
    const resp = await fetch(parsed.toString(), { signal: controller.signal });
    clearTimeout(timeout);

    if (!resp.ok) {
      res.status(502).json({ error: 'Upstream fetch failed', status: resp.status });
      return;
    }

    const contentType = resp.headers.get('content-type') || 'application/octet-stream';
    // Limit size to 5MB
    const contentLength = resp.headers.get('content-length');
    if (contentLength && Number(contentLength) > 5_000_000) {
      res.status(413).json({ error: 'Image too large' });
      return;
    }

    const arrayBuffer = await resp.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=3600');
    res.send(buffer);
  } catch (err: any) {
    if (err.name === 'AbortError') {
      res.status(504).json({ error: 'Upstream timeout' });
    } else {
      console.error('image-proxy error', err);
      res.status(500).json({ error: 'Internal proxy error' });
    }
  }
}
