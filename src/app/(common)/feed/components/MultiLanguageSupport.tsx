// src/app/(common)/feed/components/MultiLanguageSupport.tsx
"use client";
import { useAuth } from "@/hooks/api/useAuth";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// 認証状態の型を定義
interface AuthState {
  user: { id: string; name?: string | null; email?: string | null; image?: string | null; role?: string } | null;
  token?: string | null;
  role?: string | null;
  profile_picture?: string | null;
  loading: boolean;
}

export const useMultiLanguage = () => {
  const { session, status, jwtToken, isLoadingToken, getAuthState } = useAuth();
  const [authState, setAuthState] = useState<AuthState | null>(null);
  const { preferences, isLoading, saveUserPreferences } = useUserPreferences();
  const { t, i18n } = useTranslation();

  // 認証状態を設定
  useEffect(() => {
    const updateAuthState = async () => {
      if (status !== "loading" && !isLoadingToken) {
        const state = await getAuthState();
        setAuthState(state);
      }
    };
    
    updateAuthState();
  }, [status, isLoadingToken, getAuthState]);

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