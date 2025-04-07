// src/i18n/settings.ts
export const fallbackLng = "en";
export const defaultNS = "translation";
export const languages = ["en", "id", "ja", "fr", "de", "zh"] as const;
export type Language = (typeof languages)[number];

export function getOptions(lng = fallbackLng, ns = defaultNS) {
  return {
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
    detection: {
      order: ["cookie", "navigator", "path"],
      caches: ["cookie"],
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  };
}
