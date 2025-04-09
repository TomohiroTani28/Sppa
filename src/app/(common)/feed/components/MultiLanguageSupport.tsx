// src/app/(common)/feed/components/MultiLanguageSupport.tsx
"use client";
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

export const useMultiLanguage = () => {
  const { user, token, role, profile_picture, loading } = useAuth(); // 直接プロパティを取得
  const [authState, setAuthState] = useState<AuthState | null>(null);
  const { preferences, isLoading, saveUserPreferences } = useUserPreferences();
  const { t, i18n } = useTranslation();

  // 認証状態を設定
  useEffect(() => {
    if (!loading) {
      setAuthState({
        user: user ? { ...user, role: user.role ?? undefined } : null,
        token,
        role,
        profile_picture,
        loading,
      });
    }
  }, [user, token, role, profile_picture, loading]);  

  useEffect(() => {
    if (!isLoading && preferences?.preferred_languages?.length) {
      const preferredLanguage = preferences.preferred_languages[0];
      i18n.changeLanguage(preferredLanguage);
    } else {
      i18n.changeLanguage("en");
    }
  }, [isLoading, preferences, i18n]);

  return { t, i18n, languageLoading: isLoading };
};