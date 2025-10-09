const { i18n } = require("./next-i18next.config");

// ---- redirects de carros (como já estava) ----
let carRedirects = [];
try {
  const cars = require("./data/cars.json");
  if (Array.isArray(cars)) {
    const slugged = cars.filter((c) => c && c.slug && String(c.slug).trim().length > 0);
    carRedirects = slugged.map((c) => ({
      source: `/cars/${c.id}`,
      destination: `/cars/${c.slug}`,
      permanent: true,
    }));
    if (i18n && Array.isArray(i18n.locales)) {
      for (const locale of i18n.locales) {
        for (const c of slugged) {
          carRedirects.push({
            source: `/${locale}/cars/${c.id}`,
            destination: `/${locale}/cars/${c.slug}`,
            permanent: true,
          });
        }
      }
    }
  }
} catch (e) {
  console.warn("next.config.js: could not load ./data/cars.json for redirects:", e && e.message);
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n,
  async redirects() {
    // ⚠️ apenas os redirects de carros – SEM regra por host aqui
    return [...carRedirects];
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.vercel.app' },
      { protocol: 'https', hostname: '**.unsplash.com' },
      { protocol: 'https', hostname: '**.envato.com' },
      { protocol: 'https', hostname: '**.pexels.com' },
      { protocol: 'https', hostname: '**.pixabay.com' },
    ],
  },
};

module.exports = nextConfig;
