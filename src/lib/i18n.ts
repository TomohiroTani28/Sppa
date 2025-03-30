// src/app/lib/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "@/app/locales/en.json";
import id from "@/app/locales/id.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    id: { translation: id },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
