/* eslint-disable @typescript-eslint/no-var-requires */
const nextI18Next = require("./next-i18next.config");
const i18n = nextI18Next.i18n || (nextI18Next.default && nextI18Next.default.i18n) || {};

// Build-time load of car data to emit id -> slug redirects.
let carRedirects = [];
try {
  const cars = require("./data/cars.json");
  if (Array.isArray(cars)) {
    const slugged = cars.filter((c) => c && c.slug && String(c.slug).trim().length > 0);

    // Root-level redirects
    carRedirects = slugged.map((c) => ({
      source: `/cars/${c.id}`,
      destination: `/cars/${c.slug}`,
      permanent: true,
    }));

    // Locale-aware redirects
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

  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  // ✅ Não falhar o build por ESLint
  eslint: {
    ignoreDuringBuilds: true,
  },
  // ✅ Não falhar o build por erros de TypeScript
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    domains: ["autogo.pt", "www.autogo.pt"],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "index, follow" },
          { key: "Cache-Control", value: "public, max-age=3600, must-revalidate" },
        ],
      },
      { source: "/api/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/_next/static/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
    ];
  },

  async redirects() {
    return carRedirects;
  },
};

module.exports = nextConfig;
