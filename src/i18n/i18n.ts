// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  fallbackLng: 'ja',
  lng: 'ja',
  interpolation: {
    escapeValue: false,
  },
  resources: {
    ja: {
      translation: {
        welcome: "ようこそ",
        // ...
      },
    },
  },
});

export default i18n;
