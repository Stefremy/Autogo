const { i18n } = require("./next-i18next.config");

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n,
  images: {
    formats: ["image/avif", "image/webp"],
    // tamanhos responsivos (podes ajustar depois)
    deviceSizes: [360, 640, 768, 1024, 1280, 1536],
    imageSizes: [16, 24, 32, 48, 64, 96, 128, 256],
    // permite imagens externas que usas no site (avatares/artigos)
    remotePatterns: [
      { protocol: "https", hostname: "randomuser.me" },
      { protocol: "https", hostname: "hips.hearstapps.com" },
      { protocol: "https", hostname: "*.mm.bing.net" }, // ex: tse2.mm.bing.net
    ],
  },
};

module.exports = nextConfig;
