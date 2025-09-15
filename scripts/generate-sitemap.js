const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const baseUrl = 'https://autogo.pt';
const outPath = path.join(process.cwd(), 'public', 'sitemap.xml');

function isoDate(d) {
  return new Date(d).toISOString().slice(0, 10);
}

// Read cars
let cars = [];
try {
  cars = require(path.join(process.cwd(), 'data', 'cars.json'));
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

function entry(loc, lastmod, changefreq, priority, alternates) {
  let s = '  <url>\n';
  s += `    <loc>${loc}</loc>\n`;
  if (lastmod) s += `    <lastmod>${lastmod}</lastmod>\n`;
  if (changefreq) s += `    <changefreq>${changefreq}</changefreq>\n`;
  if (priority) s += `    <priority>${priority}</priority>\n`;
  if (alternates && alternates.length) {
    alternates.forEach(a => {
      s += `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${a.href}" />\n`;
    });
  }
  s += '  </url>\n';
  return s;
}

let xml = '';
xml += '<?xml version="1.0" encoding="UTF-8"?>\n';
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

const today = isoDate(new Date());

// Homepage with hreflang alternates for discovered locales
const alternates = locales.map((loc) => {
  // map folder names like 'pt-PT' to same path; english usually 'en'
  const href = loc === 'pt-PT' ? `${baseUrl}/` : `${baseUrl}/${loc.replace('_', '-')}/`;
  const hreflang = loc === 'pt-PT' ? 'pt-PT' : loc;
  return { hreflang, href };
});

xml += entry(`${baseUrl}/`, today, 'daily', '1.0', alternates);
xml += entry(`${baseUrl}/viaturas`, today, 'daily', '0.9', alternates);
xml += entry(`${baseUrl}/blog`, today, 'weekly', '0.8', alternates);

// Cars
cars.forEach((car) => {
  const id = car.id || car.ID || car._id || '';
  if (!id) return;
  const last = car.updatedAt || car.updated || car.date || today;
  xml += entry(`${baseUrl}/cars/${id}`, isoDate(last), 'monthly', '0.7');
});

// Blog posts
blogFiles.forEach((file) => {
  try {
    const content = fs.readFileSync(path.join(blogDir, file), 'utf8');
    const parsed = matter(content);
    const date = (parsed.data && (parsed.data.updated || parsed.data.date)) || today;
    const slug = file.replace(/\.md$/, '');
    xml += entry(`${baseUrl}/blog/${slug}`, isoDate(date), 'monthly', '0.6');
  } catch (e) {
    // ignore
  }
});

xml += '</urlset>\n';

fs.writeFileSync(outPath, xml, 'utf8');
console.log('Generated sitemap at', outPath);
