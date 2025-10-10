/* eslint-disable @typescript-eslint/no-var-requires */
const { i18n } = require("./next-i18next.config");

// Build-time load of car data to emit id -> slug redirects.
// We prefer slug-based URLs for SEO; if a car has no slug we skip creating a redirect.
let carRedirects = [];
try {
  // require is synchronous and resolved at build time
  const cars = require("./data/cars.json");
  if (Array.isArray(cars)) {
    const slugged = cars.filter((c) => c && c.slug && String(c.slug).trim().length > 0);

    // Root-level redirects
    carRedirects = slugged.map((c) => ({
      source: `/cars/${c.id}`,
      destination: `/cars/${c.slug}`,
      permanent: true,
    }));

    // Locale-aware redirects (if i18n.locales is defined)
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
  // If the data file isn't present at build-time, just emit no redirects.
  // This keeps next.config.js resilient in dev or CI where the file might be missing.
  console.warn("next.config.js: could not load ./data/cars.json for redirects:", e && e.message);
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n,

  // Boas práticas gerais
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  // Ajuste os domínios de imagem conforme seu projeto
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "autogo.pt" },
      { protocol: "https", hostname: "www.autogo.pt" },
      // adicione aqui CDNs que você use, ex.:
      // { protocol: "https", hostname: "images.ctfassets.net" },
      // { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },

  // SEO técnico + performance via headers
  async headers() {
    return [
      // Padrão: permitir indexação
      {
        source: "/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "index, follow" },
          { key: "Cache-Control", value: "public, max-age=3600, must-revalidate" }, // 1h
        ],
      },
      // Não indexar APIs (e painéis internos, se houver)
      {
        source: "/api/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      // Cache agressivo para assets estáticos gerados pelo Next
      {
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      // Cache agressivo para imagens e ícones públicos
      {
        source: "/:all*(svg|jpg|jpeg|png|gif|webp|avif|ico)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      // XMLs (sitemap/robots) sem cache longo para sempre servir versão atual
      {
        source: "/:all*(xml)",
        headers: [{ key: "Cache-Control", value: "public, max-age=600, must-revalidate" }], // 10 min
      },
    ];
  },

  async redirects() {
    return carRedirects;
  },
};

module.exports = nextConfig;
