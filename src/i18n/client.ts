"use client";
// src/i18n/client.ts
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { getOptions } from "@/i18n/settings";

// Initialize i18next for client side with fallback "en" and support for "en" & "id"
i18next
  .use(initReactI18next)
  .use(
    resourcesToBackend(
      (language: string, namespace: string) =>
        import(`../locales/${language}/${namespace}.json`),
    ),
  )
  .init({
    ...getOptions(),
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18next;
