// src/app/tourist/components/MultiLanguageSupport.tsx
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useUserPreferences } from "@/app/tourist/hooks/useUserPreferences";
import { useAuth } from "@/app/hooks/api/useAuth";

// 多言語対応のカスタムフック
export const useMultiLanguage = () => {
  const { user } = useAuth();
  const { preferences, isLoading, saveUserPreferences } = useUserPreferences();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (!isLoading && preferences?.preferred_languages?.length) {
      // ユーザーの優先言語を設定（配列の最初の言語を使用）
      const preferredLanguage = preferences.preferred_languages[0];
      i18n.changeLanguage(preferredLanguage);
    } else {
      // デフォルト言語（英語）を設定
      i18n.changeLanguage("en");
    }
  }, [isLoading, preferences, i18n]);

  return { t, i18n, languageLoading: isLoading };
};

// i18n初期化設定（別ファイルでの設定を想定）
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// 翻訳リソースのインポート（プロジェクトの構成に応じて調整）
import enTranslation from "@/app/locales/en.json";
import idTranslation from "@/app/locales/id.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslation },
    id: { translation: idTranslation },
  },
  lng: "en", // デフォルト言語
  fallbackLng: "en", // フォールバック言語
  interpolation: {
    escapeValue: false, // Reactではエスケープ不要
  },
});

export default i18n;
