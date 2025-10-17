const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const baseUrl = (process.env.SITEMAP_BASE_URL || 'https://autogo.pt').replace(/\/+$/, '');
const publicDir = path.join(process.cwd(), 'public');
const outPath = path.join(publicDir, 'sitemap.xml');

const buildDate = new Date();

function toDate(value) {
  if (!value) return null;
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? null : parsed;
}

function isoDate(value) {
  const date = toDate(value);
  if (!date) return null;
  return date.toISOString().slice(0, 10);
}

function latestDate(candidates, fallback = buildDate) {
  const valid = candidates.map(toDate).filter(Boolean);
  if (!valid.length) return fallback;
  return valid.reduce((acc, cur) => (cur > acc ? cur : acc), valid[0]);
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

function entry(loc, lastmod, changefreq, priority) {
  let s = '  <url>\n';
  s += `    <loc>${escapeXml(loc)}</loc>\n`;
  if (lastmod) s += `    <lastmod>${escapeXml(lastmod)}</lastmod>\n`;
  if (changefreq) s += `    <changefreq>${escapeXml(changefreq)}</changefreq>\n`;
  if (priority) s += `    <priority>${escapeXml(priority)}</priority>\n`;
  s += '  </url>\n';
  return s;
}

function fileStatDate(...segments) {
  try {
    return fs.statSync(path.join(process.cwd(), ...segments)).mtime;
  } catch {
    return null;
  }
}

// Read cars
let cars = [];
const carsPath = path.join(process.cwd(), 'data', 'cars.json');
let carsFileMtime = fileStatDate('data', 'cars.json');
try {
  cars = require(carsPath);
} catch {
  cars = [];
  carsFileMtime = null;
}

// Read blog files
const blogDir = path.join(process.cwd(), 'data', 'blog');
let blogFiles = [];
try {
  blogFiles = fs.readdirSync(blogDir).filter((f) => f.endsWith('.md'));
} catch {
  blogFiles = [];
}

let xml = '';
xml += '<?xml version="1.0" encoding="UTF-8"?>\n';
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

const staticRoutes = [
  { path: '/', changefreq: 'daily', priority: '1.0', sources: [['pages', 'index.tsx']] },
  {
    path: '/viaturas',
    changefreq: 'daily',
    priority: '0.8',
    sources: [
      ['pages', 'viaturas.tsx'],
      ['data', 'cars.json'],
    ],
  },
  {
    path: '/blog',
    changefreq: 'weekly',
    priority: '0.7',
    sources: [
      ['pages', 'blog.tsx'],
    ],
  },
  { path: '/como-funciona', changefreq: 'yearly', priority: '0.5', sources: [['pages', 'como-funciona.tsx']] },
  { path: '/pedido', changefreq: 'yearly', priority: '0.5', sources: [['pages', 'pedido.tsx']] },
  { path: '/simulador', changefreq: 'yearly', priority: '0.7', sources: [['pages', 'simulador.tsx']] },
  { path: '/sobre-nos', changefreq: 'yearly', priority: '0.5', sources: [['pages', 'sobre-nos.tsx']] },
  { path: '/contacto', changefreq: 'yearly', priority: '0.5', sources: [['pages', 'contacto.tsx']] },
  {
    path: '/politica-de-privacidade',
    changefreq: 'yearly',
    priority: '0.3',
    sources: [['pages', 'politica-de-privacidade.tsx']],
  },
  { path: '/cookie-policy', changefreq: 'yearly', priority: '0.3', sources: [['pages', 'cookie-policy.tsx']] },
];

const blogPosts = [];
const categoryStats = {};
const typeToCategory = {
  news: 'noticias',
  review: 'reviews',
};

blogFiles.forEach((file) => {
  const filePath = path.join(blogDir, file);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const parsed = matter(content);
    const slug = file.replace(/\.md$/, '');
    const frontmatterDate = parsed.data && (parsed.data.updated || parsed.data.date);
    const fileMtime = fileStatDate('data', 'blog', file);
    const lastDate = latestDate([frontmatterDate, fileMtime], buildDate);
    const lastmod = isoDate(lastDate);
    const changefreq = 'monthly';
    const priority = '0.6';
    const loc = `${baseUrl}/blog/${slug}`;
    blogPosts.push({ slug, lastDate, lastmod, changefreq, priority });

    const typeValue = (parsed.data && parsed.data.type) ? String(parsed.data.type).toLowerCase() : null;
    const categoryKey = typeValue && typeToCategory[typeValue];
    if (categoryKey) {
      if (!categoryStats[categoryKey]) categoryStats[categoryKey] = [];
      categoryStats[categoryKey].push(lastDate);
    }

    xml += entry(loc, lastmod, changefreq, priority);
  } catch {
    console.warn(`Failed to process blog file ${file}:`);
  }
});

const blogLastDates = blogPosts.map((post) => post.lastDate);
const blogLatestDate = blogLastDates.length ? latestDate(blogLastDates, buildDate) : buildDate;

staticRoutes.forEach((route) => {
  const normalizedPath = route.path.startsWith('/') ? route.path : `/${route.path}`;
  const loc = normalizedPath === '/' ? `${baseUrl}/` : `${baseUrl}${normalizedPath}`;
  const sourceDates = (route.sources || []).map((segments) => fileStatDate(...segments)).filter(Boolean);
  if (normalizedPath === '/viaturas' && carsFileMtime) {
    sourceDates.push(carsFileMtime);
  }
  if (normalizedPath === '/blog') {
    sourceDates.push(blogLatestDate);
  }
  const last = isoDate(latestDate(sourceDates.length ? sourceDates : [buildDate], buildDate));
  xml += entry(loc, last, route.changefreq, route.priority);
});

Object.entries(categoryStats).forEach(([categorySlug, dates]) => {
  const categoryPath = `/blog/categoria/${categorySlug}`;
  const last = isoDate(latestDate(dates, buildDate));
  xml += entry(
    `${baseUrl}${categoryPath}`,
    last,
    'weekly',
    '0.6',
  );
});

cars.forEach((car) => {
  const id = car.id || car.ID || car._id || '';
  const slug = car.slug || '';
  const urlId = slug || id;
  if (!urlId) return;

  const rawLast = car.updatedAt || car.updated || car.date || car.lastModified || null;
  const lastDate = latestDate([rawLast, carsFileMtime], buildDate);
  const last = isoDate(lastDate);
  const carPath = `/cars/${urlId}`;
  xml += entry(
    `${baseUrl}${carPath}`,
    last,
    'monthly',
    '0.6',
  );
});

xml += '</urlset>\n';

fs.writeFileSync(outPath, xml, 'utf8');
console.log('Generated sitemap at', outPath);
