"use client";
// src/i18n/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  lng: 'en',
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: {
      translation: {
        welcome: "Welcome to Sppa",
        retry: "Retry",
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
      },
    },
    id: {
      translation: {
        welcome: "Selamat Datang di Sppa",
        retry: "Coba Lagi",
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
      },
    },
  },
});

export default i18n;
