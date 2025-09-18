import path from "path";
import NextI18Next from "next-i18next";

const NextI18NextInstance = new NextI18Next({
  defaultLanguage: "pt-PT",
  otherLanguages: ["en", "es", "fr", "de"],
  localePath: path.resolve("./public/locales"),
});

export default NextI18NextInstance;
export const { appWithTranslation, withTranslation, i18n } =
  NextI18NextInstance;
