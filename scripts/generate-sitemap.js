const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const baseUrl = 'https://autogo.pt';
const outPath = path.join(process.cwd(), 'public', 'sitemap.xml');

function isoDate(d) {
  try {
    return new Date(d).toISOString().slice(0, 10);
  } catch (e) {
    return new Date().toISOString().slice(0, 10);
  }
}

// Read cars
let cars = [];
const carsPath = path.join(process.cwd(), 'data', 'cars.json');
let carsFileMtime = null;
try {
  cars = require(carsPath);
  try { carsFileMtime = fs.statSync(carsPath).mtime; } catch (e) { carsFileMtime = null; }
} catch (e) {
  cars = [];
}

// Read blog files
const blogDir = path.join(process.cwd(), 'data', 'blog');
let blogFiles = [];
try {
  blogFiles = fs.readdirSync(blogDir).filter((f) => f.endsWith('.md'));
} catch (e) {
  blogFiles = [];
}

const localesDir = path.join(process.cwd(), 'locales');
let locales = [];
try {
  locales = fs.readdirSync(localesDir).filter((d) => fs.lstatSync(path.join(localesDir, d)).isDirectory());
} catch (e) {
  locales = [];
}

function escapeXml(str) {
  if (!str && str !== 0) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function entry(loc, lastmod, changefreq, priority, alternates) {
  let s = '  <url>\n';
  s += `    <loc>${escapeXml(loc)}</loc>\n`;
  if (lastmod) s += `    <lastmod>${escapeXml(lastmod)}</lastmod>\n`;
  if (changefreq) s += `    <changefreq>${escapeXml(changefreq)}</changefreq>\n`;
  if (priority) s += `    <priority>${escapeXml(priority)}</priority>\n`;
  if (alternates && alternates.length) {
    alternates.forEach(a => {
      s += `    <xhtml:link rel="alternate" hreflang="${escapeXml(a.hreflang)}" href="${escapeXml(a.href)}" />\n`;
    });
  }
  s += '  </url>\n';
  return s;
}

let xml = '';
xml += '<?xml version="1.0" encoding="UTF-8"?>\n';
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

const buildDate = isoDate(new Date());

// Homepage with hreflang alternates for discovered locales
const alternates = locales.length ? locales.map((loc) => {
  const href = loc === 'pt-PT' ? `${baseUrl}/` : `${baseUrl}/${loc.replace('_','-')}/`;
  const hreflang = loc === 'pt-PT' ? 'pt-PT' : loc;
  return { hreflang, href };
}) : [];

xml += entry(`${baseUrl}/`, buildDate, 'daily', '1.0', alternates);
xml += entry(`${baseUrl}/viaturas`, buildDate, 'daily', '0.9', alternates);
xml += entry(`${baseUrl}/blog`, buildDate, 'weekly', '0.8', alternates);
// Add simulador and sobre-nos pages to sitemap
xml += entry(`${baseUrl}/simulador`, buildDate, 'monthly', '0.8', alternates);
xml += entry(`${baseUrl}/sobre-nos`, buildDate, 'monthly', '0.8', alternates);

// Cars
cars.forEach((car) => {
  const id = car.id || car.ID || car._id || '';
  const slug = car.slug || '';
  const urlId = slug || id;
  if (!urlId) return;

  // Prefer explicit timestamps, else fallback to cars.json mtime, else build date
  const rawLast = car.updatedAt || car.updated || car.date || car.lastModified || null;
  let last = null;
  if (rawLast) {
    try {
      const parsed = new Date(rawLast);
      if (!isNaN(parsed.getTime())) last = isoDate(parsed);
    } catch (e) {
      last = null;
    }
  }
  if (!last && carsFileMtime) {
    try { last = isoDate(carsFileMtime); } catch (e) { last = buildDate; }
  }
  if (!last) last = buildDate;

  // hreflang alternates per locale for each car (pointing to localized paths)
  const carAlternates = locales.length ? locales.map((loc) => {
    const href = loc === 'pt-PT' ? `${baseUrl}/cars/${urlId}` : `${baseUrl}/${loc.replace('_','-')}/cars/${urlId}`;
    const hreflang = loc === 'pt-PT' ? 'pt-PT' : loc;
    return { hreflang, href };
  }) : [];

  xml += entry(`${baseUrl}/cars/${urlId}`, last, 'monthly', '0.7', carAlternates);
});

// Blog posts
blogFiles.forEach((file) => {
  try {
    const content = fs.readFileSync(path.join(blogDir, file), 'utf8');
    const parsed = matter(content);
    const dateVal = (parsed.data && (parsed.data.updated || parsed.data.date)) || buildDate;
    let last = buildDate;
    try { const p = new Date(dateVal); if (!isNaN(p.getTime())) last = isoDate(p); } catch (e) { last = buildDate; }
    const slug = file.replace(/\.md$/, '');
    xml += entry(`${baseUrl}/blog/${slug}`, last, 'monthly', '0.6');
  } catch (e) {
    // ignore
  }
});

xml += '</urlset>\n';

fs.writeFileSync(outPath, xml, 'utf8');
console.log('Generated sitemap at', outPath);
