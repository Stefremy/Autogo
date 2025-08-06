module.exports = {
  i18n: {
<<<<<<< HEAD
    defaultLocale: 'pt-PT',
    locales: ['pt-PT', 'es', 'en', 'fr', 'de'],
    localeDetection: false,
  },
  localePath: typeof window === 'undefined'
    ? require('path').resolve('./public/locales')
    : '/locales',
=======
    defaultLocale: "pt-PT",
    locales: ["pt-PT", "es", "en", "fr", "de"],
    localeDetection: false,
  },
  localePath:
    typeof window === "undefined"
      ? require("path").resolve("./public/locales")
      : "/locales",
>>>>>>> af80f1e (after Cursor 1.0)
};
