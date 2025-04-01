"use client";
// src/i18n/I18nProvider.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import i18next from "i18next";
import { initReactI18next, useTranslation as useI18nextTranslation } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// 翻訳データ
const enTranslations = {
  common: {
    error_loading_feed: "Error loading feed. Please try again.",
    loading: "Loading...",
    try_again: "Try Again",
  },
  home: {
    feed_title: "Your Feed",
    welcome_message: "Welcome to Sppa!",
    search_placeholder: "Search therapists or experiences",
  },
  navigation: {
    home: "Home",
    search: "Search",
    bookings: "Bookings",
    chat: "Chat",
    profile: "Profile",
  },
};

const idTranslations = {
  common: {
    error_loading_feed: "Kesalahan memuat feed. Silakan coba lagi.",
    loading: "Memuat...",
    try_again: "Coba Lagi",
  },
  home: {
    feed_title: "Feed Anda",
    welcome_message: "Selamat Datang di Sppa!",
    search_placeholder: "Cari terapis atau pengalaman",
  },
  navigation: {
    home: "Beranda",
    search: "Cari",
    bookings: "Reservasi",
    chat: "Obrolan",
    profile: "Profil",
  },
};

// i18next 初期化
if (!i18next.isInitialized) {
  i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: enTranslations },
        id: { translation: idTranslations },
      },
      fallbackLng: "en",
      interpolation: { escapeValue: false },
      detection: { order: ["localStorage", "navigator"], caches: ["localStorage"] },
    })
    .catch((error) => console.error("i18next initialization failed", error));
}

// Context 作成
interface I18nContextType {
  locale: string;
  setLocale: (locale: string) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Provider コンポーネント
interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [locale, setLocaleState] = useState(i18next.language || "en");
  const router = useRouter();

  const setLocale = (newLocale: string) => {
    i18next.changeLanguage(newLocale);
    setLocaleState(newLocale);
    localStorage.setItem("i18nextLng", newLocale);
  };

  useEffect(() => {
    const handleLanguageChanged = (lng: string) => setLocaleState(lng);
    i18next.on("languageChanged", handleLanguageChanged);
    return () => i18next.off("languageChanged", handleLanguageChanged);
  }, []);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t: i18next.t }}>
      {children}
    </I18nContext.Provider>
  );
}

// カスタムフック
export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used within an I18nProvider");
  return context;
}

export function useTranslation() {
  return useI18nextTranslation();
}
