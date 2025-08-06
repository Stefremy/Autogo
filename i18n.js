<<<<<<< HEAD
import NextI18Next from 'next-i18next';
import path from 'path';

const NextI18NextInstance = new NextI18Next({
  defaultLanguage: 'pt-PT',
  otherLanguages: ['en', 'es', 'fr', 'de'],
  localePath: path.resolve('./public/locales'),
});

export default NextI18NextInstance;
export const { appWithTranslation, withTranslation, i18n } = NextI18NextInstance;
=======
import NextI18Next from "next-i18next";
import path from "path";

const NextI18NextInstance = new NextI18Next({
  defaultLanguage: "pt-PT",
  otherLanguages: ["en", "es", "fr", "de"],
  localePath: path.resolve("./public/locales"),
});

export default NextI18NextInstance;
export const { appWithTranslation, withTranslation, i18n } =
  NextI18NextInstance;
>>>>>>> af80f1e (after Cursor 1.0)
