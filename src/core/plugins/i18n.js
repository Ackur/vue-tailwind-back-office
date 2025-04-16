import { createI18n } from "vue-i18n";
const langsModules = import.meta.glob(["@/locales/*/translation.json"], { eager: true });

const messages = Object.entries(langsModules).reduce((acc, [key, value]) => {
  const regex = /locales\/(?<lang>\w+)\/translation/;
  const name = regex.exec(key).groups.lang;
  acc[name] = { ...value };
  return acc;
}, {});

const initLang = Object.keys(messages).find((lang) => lang === sessionStorage.getItem("lang"));

const i18n = createI18n({
  // legacy: false,
  allowComposition: true,
  locale: initLang || "en",
  fallbackLocale: "en",
  messages
});

export default i18n;
