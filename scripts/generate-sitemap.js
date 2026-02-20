const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const baseUrl = (process.env.SITEMAP_BASE_URL || 'https://autogo.pt').replace(/\/+$/, '');
const publicDir = path.join(process.cwd(), 'public');
const outPath = path.join(publicDir, 'sitemap.xml');

const buildDate = new Date();

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// TIERED PRIORITY SYSTEM
// ---------------------------------------------------------------------------

// Evergreen guides / high-value SEO content → priority 0.8–0.9, monthly
const GUIDE_SLUGS = new Set([
  'importar-carros-alemanha-guia-completo',
  'isv-na-pratica-simulador-autogo',
  'pedir-matricula-veiculo-importado',
  'iuc-carros-importados-2026',
  // Future guides (add new slugs here when created):
  // 'como-importar-carros-alemanha-portugal',
  // 'isv-2026-guia-completo',
  // 'comprar-carro-importado-vs-usado-portugal',
  // 'melhores-carros-eletricos-importados-2026',
]);

// Car reviews → priority 0.5, yearly
const REVIEW_SLUGS = new Set([
  'bmw-serie3-review',
  'ferrari-f80-review',
  'giulia-quadrifoglio-review',
  'hyundai-santa-fe-review',
  'volvo-xc40-review',
  'volkswagen-golf-r-review',
]);

// News articles → priority 0.4, yearly
const NEWS_SLUGS = new Set([
  'mercedes-classec-news',
  'byd-atto-2-launch',
]);

/**
 * Determine the tier for a blog post based on slug, then frontmatter type.
 * Returns { priority, changefreq }.
 */
function blogTier(slug, frontmatterType) {
  if (GUIDE_SLUGS.has(slug)) {
    return { priority: '0.8', changefreq: 'monthly' };
  }
  if (REVIEW_SLUGS.has(slug)) {
    return { priority: '0.5', changefreq: 'yearly' };
  }
  if (NEWS_SLUGS.has(slug)) {
    return { priority: '0.4', changefreq: 'yearly' };
  }

  // Fallback: use frontmatter type
  const type = String(frontmatterType || '').toLowerCase();
  if (type === 'review') {
    return { priority: '0.5', changefreq: 'yearly' };
  }
  if (type === 'guide') {
    return { priority: '0.8', changefreq: 'monthly' };
  }
  // Default for uncategorized posts (news / other)
  return { priority: '0.6', changefreq: 'monthly' };
}

// ---------------------------------------------------------------------------
// Data sources
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Build XML
// ---------------------------------------------------------------------------

let xml = '';
xml += '<?xml version="1.0" encoding="UTF-8"?>\n';
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

// ---- TIER 1: Money pages ----
const tier1Routes = [
  { path: '/', changefreq: 'daily', priority: '1.0', sources: [['pages', 'index.tsx']] },
  {
    path: '/viaturas',
    changefreq: 'daily',
    priority: '0.9',
    sources: [
      ['pages', 'viaturas.tsx'],
      ['data', 'cars.json'],
    ],
  },
  { path: '/simulador-isv', changefreq: 'weekly', priority: '0.9', sources: [['pages', 'simulador-isv.tsx']] },
  { path: '/simulador-iuc', changefreq: 'weekly', priority: '0.9', sources: [['pages', 'simulador-iuc.tsx']] },
  { path: '/isv-portugal', changefreq: 'monthly', priority: '0.8', sources: [['pages', 'isv-portugal.tsx']] },
];

// ---- TIER 2: Conversion pages ----
const tier2Routes = [
  { path: '/pedido', changefreq: 'monthly', priority: '0.8', sources: [['pages', 'pedido.tsx']] },
  { path: '/como-funciona', changefreq: 'monthly', priority: '0.8', sources: [['pages', 'como-funciona.tsx']] },
  { path: '/contacto', changefreq: 'yearly', priority: '0.7', sources: [['pages', 'contacto.tsx']] },
];

// ---- TIER 3: Blog hub & categories ----
const tier3Routes = [
  {
    path: '/blog',
    changefreq: 'weekly',
    priority: '0.8',
    sources: [['pages', 'blog.tsx']],
  },
];

// ---- TIER 8: Utility pages (low priority) ----
const tier8Routes = [
  { path: '/sobre-nos', changefreq: 'yearly', priority: '0.4', sources: [['pages', 'sobre-nos.tsx']] },
  {
    path: '/politica-de-privacidade',
    changefreq: 'yearly',
    priority: '0.2',
    sources: [['pages', 'politica-de-privacidade.tsx']],
  },
  { path: '/cookie-policy', changefreq: 'yearly', priority: '0.2', sources: [['pages', 'cookie-policy.tsx']] },
];

const allStaticRoutes = [...tier1Routes, ...tier2Routes, ...tier3Routes, ...tier8Routes];

// Process blog posts first (TIER 4–6 based on category)
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

    // Determine tier based on slug + frontmatter type
    const tier = blogTier(slug, parsed.data && parsed.data.type);

    blogPosts.push({ slug, lastDate, lastmod, ...tier });

    // Track category stats for category pages
    const typeValue = (parsed.data && parsed.data.type) ? String(parsed.data.type).toLowerCase() : null;
    const categoryKey = typeValue && typeToCategory[typeValue];
    if (categoryKey) {
      if (!categoryStats[categoryKey]) categoryStats[categoryKey] = [];
      categoryStats[categoryKey].push(lastDate);
    }

    const loc = `${baseUrl}/blog/${slug}`;
    xml += entry(loc, lastmod, tier.changefreq, tier.priority);
  } catch {
    console.warn(`Failed to process blog file ${file}:`);
  }
});

// Blog category pages
Object.entries(categoryStats).forEach(([categorySlug, dates]) => {
  const categoryPath = `/blog/categoria/${categorySlug}`;
  const last = isoDate(latestDate(dates, buildDate));
  xml += entry(`${baseUrl}${categoryPath}`, last, 'weekly', '0.6');
});

// Blog lastmod for hub page
const blogLastDates = blogPosts.map((post) => post.lastDate);
const blogLatestDate = blogLastDates.length ? latestDate(blogLastDates, buildDate) : buildDate;

// Static routes
allStaticRoutes.forEach((route) => {
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

// TIER 7: Car listings (priority 0.6, weekly)
// Only include cars that have a proper SEO slug — bare numeric IDs produce
// low-quality URLs that Semrush (and Google) flag as "incorrect pages in sitemap".
let carSitemapCount = 0;
cars.forEach((car) => {
  const slug = car.slug && String(car.slug).trim();
  // Skip cars without a slug: they will redirect to the slug URL once one exists,
  // so including the bare-ID URL in the sitemap would cause "incorrect page" errors.
  if (!slug) return;

  const rawLast = car.updatedAt || car.updated || car.date || car.lastModified || null;
  const lastDate = latestDate([rawLast, carsFileMtime], buildDate);
  const last = isoDate(lastDate);
  xml += entry(`${baseUrl}/cars/${slug}`, last, 'weekly', '0.6');
  carSitemapCount++;
});

xml += '</urlset>\n';

fs.writeFileSync(outPath, xml, 'utf8');

// Summary
console.log(`Generated sitemap at ${outPath}`);
console.log(`  Blog posts: ${blogPosts.length} (Guides: ${blogPosts.filter((p) => p.priority === '0.8').length}, Reviews: ${blogPosts.filter((p) => p.priority === '0.5').length}, News: ${blogPosts.filter((p) => p.priority === '0.4').length}, Other: ${blogPosts.filter((p) => p.priority === '0.6').length})`);
console.log(`  Static pages: ${allStaticRoutes.length}`);
console.log(`  Car listings (slug only): ${carSitemapCount}`);
console.log(`  Categories: ${Object.keys(categoryStats).length}`);
console.log(`  Total URLs: ${allStaticRoutes.length + blogPosts.length + carSitemapCount + Object.keys(categoryStats).length}`);
