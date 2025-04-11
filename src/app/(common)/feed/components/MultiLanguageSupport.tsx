// src/app/(common)/feed/components/MultiLanguageSupport.tsx
"use client";
import { useAuth } from "@/hooks/api/useAuth";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { AuthState } from "@/types/auth"; // 正しい型をインポート
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// ローカルのAuthState型定義を削除し、正しいインポートを使用

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
        // 型変換を明示的に行って安全に割り当て
        setAuthState(state as AuthState);
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