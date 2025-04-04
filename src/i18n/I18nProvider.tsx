"use client";
// src/i18n/I18nProvider.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import i18next from "i18next";
import { initReactI18next, useTranslation as useI18nextTranslation } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Updated translation data including keys for treatment, chat, booking, profile
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
  treatment: {
    title: "Treatment Details",
    instant_booking: "Instant Booking",
    description: "Service Description & Features",
  },
  chat: {
    title: "Chat",
    type_message: "Type your message...",
    translate: "Translate",
  },
  booking: {
    title: "Booking Management",
    upcoming: "Upcoming Bookings",
    past: "Past Bookings",
    cancel: "Cancel Booking",
  },
  profile: {
    title: "Profile",
    edit_profile: "Edit Profile",
    settings: "Settings",
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
  treatment: {
    title: "Detail Perawatan",
    instant_booking: "Pesan Sekarang",
    description: "Deskripsi Layanan & Fitur",
  },
  chat: {
    title: "Obrolan",
    type_message: "Ketik pesan Anda...",
    translate: "Terjemahkan",
  },
  booking: {
    title: "Manajemen Reservasi",
    upcoming: "Reservasi Mendatang",
    past: "Reservasi Lama",
    cancel: "Batalkan Reservasi",
  },
  profile: {
    title: "Profil",
    edit_profile: "Edit Profil",
    settings: "Pengaturan",
  },
};

// i18next initialization for client-side
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

// Create I18n context
interface I18nContextType {
  locale: string;
  setLocale: (locale: string) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// I18n Provider component
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

// Custom hook for accessing i18n context
export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used within an I18nProvider");
  return context;
}

export function useTranslation() {
  return useI18nextTranslation();
}
