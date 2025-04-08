// src/i18n/server.ts
import { getOptions } from "@/i18n/settings";
import { createInstance } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { cookies, headers } from "next/headers";
import { initReactI18next } from "react-i18next/initReactI18next";

// Get language from cookies or accept-language header
export async function getLangFromHeaders() {
  const cookieStore = await cookies();
  const langCookie = cookieStore.get("NEXT_LOCALE");

  if (langCookie?.value) {
    return langCookie.value;
  }

  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language");

  if (acceptLanguage) {
    const preferredLang = acceptLanguage.split(",")[0]?.split("-")[0] || "en";
    if (["en", "id"].includes(preferredLang)) {
      return preferredLang;
    }
  }

  return "en";
}

// Server-side i18n instance creator
export async function initI18next(lng: string, ns: string = "translation") {
  const currentLng = lng || (await getLangFromHeaders());
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`../locales/${language}/${namespace}.json`),
      ),
    )
    .init({
      ...getOptions(currentLng, ns),
      lng: currentLng,
      ns,
      interpolation: {
        escapeValue: false,
      },
    });

  return i18nInstance;
}

// Helper function for server components
export async function getTranslation(lng: string, ns: string = "translation") {
  const currentLng = lng || (await getLangFromHeaders());
  const i18nextInstance = await initI18next(currentLng, ns);
  return {
    t: i18nextInstance.getFixedT(currentLng, ns),
    i18n: i18nextInstance,
  };
}
