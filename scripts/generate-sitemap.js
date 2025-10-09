const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// ✅ domínio canónico
const baseUrl = 'https://www.autogo.pt';
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
  try {
    carsFileMtime = fs.statSync(carsPath).mtime;
  } catch (e) {
    carsFileMtime = null;
  }
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

// Discover locales (folder names under /locales)
const localesDir = path.join(process.cwd(), 'locales');
let locales = [];
try {
  locales = fs
    .readdirSync(localesDir)
    .filter((d) => fs.lstatSync(path.join(localesDir, d)).isDirectory());
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
    alternates.forEach((a) => {
      s += `    <xhtml:link rel="alternate" hreflang="${escapeXml(
        a.hreflang
      )}" href="${escapeXml(a.href)}" />\n`;
    });
  }
  s += '  </url>\n';
  return s;
}

let xml = '';
xml += '<?xml version="1.0" encoding="UTF-8"?>\n';
xml +=
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

const buildDate = isoDate(new Date());

// Helper: build alternates array (adds x-default)
function buildAlternatesFor(pathSuffix = '') {
  const arr = locales.length
    ? locales.map((loc) => {
        const lang = loc.replace('_', '-');
        const isPt = lang === 'pt-PT';
        const href =
          isPt
            ? `${baseUrl}${pathSuffix}`
            : `${baseUrl}/${lang}${pathSuffix}`;
        const hreflang = isPt ? 'pt-PT' : lang;
        return { hreflang, href };
      })
    : [];
  // x-default -> versão “genérica”
  if (arr.length) {
    const href =
      pathSuffix === '/' ? `${baseUrl}/` : `${baseUrl}${pathSuffix}`;
    arr.push({ hreflang: 'x-default', href });
  }
  return arr;
}

// Static pages (ajuste os paths conforme o site real)
xml += entry(`${baseUrl}/`, buildDate, 'daily', '1.0', buildAlternatesFor('/'));
xml += entry(
  `${baseUrl}/viaturas`,
  buildDate,
  'daily',
  '0.9',
  buildAlternatesFor('/viaturas')
);
xml += entry(
  `${baseUrl}/blog`,
  buildDate,
  'weekly',
  '0.8',
  buildAlternatesFor('/blog')
);
xml += entry(
  `${baseUrl}/simulador`,
  buildDate,
  'monthly',
  '0.8',
  buildAlternatesFor('/simulador')
);
xml += entry(
  `${baseUrl}/sobre-nos`,
  buildDate,
  'monthly',
  '0.8',
  buildAlternatesFor('/sobre-nos')
);

// Cars
cars.forEach((car) => {
  const id = car.id || car.ID || car._id || '';
  const slug = car.slug || '';
  const urlId = slug || id;
  if (!urlId) return;

  // Prefer explicit timestamps, else file mtime, else build date
  const rawLast =
    car.updatedAt || car.updated || car.date || car.lastModified || null;
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
    try {
      last = isoDate(carsFileMtime);
    } catch (e) {
      last = buildDate;
    }
  }
  if (!last) last = buildDate;

  const carPath = `/cars/${urlId}`;
  const carAlternates = buildAlternatesFor(carPath);

  xml += entry(`${baseUrl}${carPath}`, last, 'monthly', '0.7', carAlternates);
});

// Blog posts
blogFiles.forEach((file) => {
  try {
    const content = fs.readFileSync(path.join(blogDir, file), 'utf8');
    const parsed = matter(content);
    const dateVal =
      (parsed.data && (parsed.data.updated || parsed.data.date)) || buildDate;
    let last = buildDate;
    try {
      const p = new Date(dateVal);
      if (!isNaN(p.getTime())) last = isoDate(p);
    } catch (e) {
      last = buildDate;
    }
    const slug = file.replace(/\.md$/, '');
    xml += entry(
      `${baseUrl}/blog/${slug}`,
      last,
      'monthly',
      '0.6',
      buildAlternatesFor(`/blog/${slug}`)
    );
  } catch (e) {
    // ignore file read errors
  }
});

xml += '</urlset>\n';

fs.writeFileSync(outPath, xml, 'utf8');
console.log('Generated sitemap at', outPath);
