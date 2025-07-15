module.exports = {
  i18n: {
    defaultLocale: 'pt-PT',
    locales: ['pt-PT', 'es', 'en', 'fr', 'de'],
    localeDetection: true,
  },
  localePath: typeof window === 'undefined'
    ? require('path').resolve('./public/locales')
    : '/locales',
};
