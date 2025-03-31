"use client";
// src/app/components/common/LoadingSpinner.tsx
import React from "react";
import { Spinner } from "@/components/ui/Spinner";

export const LoadingSpinner: React.FC<{ "aria-label"?: string }> = ({ "aria-label": ariaLabel }) => (
  <div className="flex justify-center items-center min-h-screen" aria-label={ariaLabel}>
    <Spinner className="w-8 h-8" />
  </div>
);

// src/app/components/common/MultiLanguageSupport.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type TranslationDict = {
  [key: string]: string;
};

const englishTranslations: TranslationDict = {
  preferences: "Preferences",
  notifications: "Notifications",
  // 他の翻訳を追加
};

const indonesianTranslations: TranslationDict = {
  preferences: "Preferensi",
  notifications: "Notifikasi",
  // 他の翻訳を追加
};

export const useMultiLanguage = () => {
  const [language, setLanguage] = useState<string>("en");
  const [translations, setTranslations] = useState<TranslationDict>(englishTranslations);
  const [languageLoading, setLanguageLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    // ブラウザのロケールまたはユーザー設定からの言語の検出
    const detectLanguage = async () => {
      try {
        // ローカルストレージまたはクッキーから言語設定を取得
        const storedLanguage = localStorage.getItem("userLanguage") || "en";
        setLanguage(storedLanguage);
        
        // 言語に基づいて翻訳を設定
        if (storedLanguage === "id") {
          setTranslations(indonesianTranslations);
        } else {
          setTranslations(englishTranslations);
        }
      } catch (error) {
        console.error("Failed to detect language:", error);
        // デフォルトを英語に設定
        setTranslations(englishTranslations);
      } finally {
        setLanguageLoading(false);
      }
    };

    detectLanguage();
  }, []);

  const changeLanguage = (lang: string) => {
    try {
      localStorage.setItem("userLanguage", lang);
      setLanguage(lang);
      
      if (lang === "id") {
        setTranslations(indonesianTranslations);
      } else {
        setTranslations(englishTranslations);
      }
      
      // 必要に応じて現在のページをリロード
      router.refresh();
    } catch (error) {
      console.error("Failed to change language:", error);
    }
  };

  const t = (key: string): string => {
    return translations[key] || key;
  };

  return { language, changeLanguage, t, languageLoading };
};