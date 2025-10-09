const { NextResponse } = require('next/server');

// Redirect autogo.pt -> www.autogo.pt
function middleware(req) {
  const url = req.nextUrl;
  if (url.hostname === 'autogo.pt') {
    url.hostname = 'www.autogo.pt';
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

const config = {
  matcher: ['/((?!_next/|api/|assets/|favicon.ico|robots.txt|sitemap.xml).*)'],
};

module.exports = { middleware, config };
