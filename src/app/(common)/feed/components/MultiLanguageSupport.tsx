// src/app/(common)/feed/components/MultiLanguageSupport.tsx
"use client"; // クライアントサイドであることを明示（必要に応じて）
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { useAuth } from "@/hooks/api/useAuth";

// 認証状態の型を定義
interface AuthState {
  user: { id: string; name?: string | null; email?: string | null; image?: string | null; role?: string } | null;
  token?: string | null;
  role?: string | null;
  profile_picture?: string | null;
  loading: boolean;
}

// 多言語対応のカスタムフック
export const useMultiLanguage = () => {
  const { getAuthState } = useAuth(); // getAuthState を使用
  const [authState, setAuthState] = useState<AuthState | null>(null);
  const { preferences, isLoading, saveUserPreferences } = useUserPreferences();
  const { t, i18n } = useTranslation();

  // 認証状態を非同期で取得
  useEffect(() => {
    const fetchAuthState = async () => {
      try {
        const state = await getAuthState();
        setAuthState(state);
      } catch (error) {
        console.error("Failed to fetch auth state:", error);
        setAuthState(null);
      }
    };
    fetchAuthState();
  }, [getAuthState]);

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
import enTranslation from "@/locales/en.json";
import idTranslation from "@/locales/id.json";

// 重複インポートを避けるため、ここで一度だけ初期化
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslation },
    id: { translation: idTranslation },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;