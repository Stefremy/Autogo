import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// Redirects autogo.pt → www.autogo.pt (canonical domain)
export function middleware(req: NextRequest) {
  const url = req.nextUrl

  if (url.hostname === 'autogo.pt') {
    url.hostname = 'www.autogo.pt'
    return NextResponse.redirect(url, 308)
  }

  return NextResponse.next()
}

// Optional: exclude static files and assets from middleware
export const config = {
  matcher: ['/((?!_next/|api/|assets/|favicon.ico|robots.txt|sitemap.xml).*)'],
}
