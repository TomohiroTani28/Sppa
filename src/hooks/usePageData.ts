// src/hooks/usePageData.ts
import { useEffect, useState } from 'react';
import { useAuth } from "@/hooks/api/useAuth";
import { useHomeData } from "./useHomeData";
import { useNotificationsApi } from "@/hooks/api/useNotificationsApi";

export const usePageData = () => {
  const { getAuthState } = useAuth();

  // 認証状態を管理するための状態変数
  const [authState, setAuthState] = useState<{
    user: {
      id: string;
      name?: string | null | undefined;
      email?: string | null | undefined;
      image?: string | null | undefined;
      role?: string | undefined;
    } | null;
    token: string | null;
    role: any;
    profile_picture: string | null;
    loading: boolean;
  } | null>(null);

  // コンポーネントがマウントされたときに認証状態を取得
  useEffect(() => {
    const fetchAuthState = async () => {
      try {
        const state = await getAuthState();
        setAuthState(state);
      } catch (error) {
        console.error('認証状態の取得に失敗しました:', error);
        // 必要に応じてエラー処理を追加
      }
    };

    fetchAuthState();
  }, [getAuthState]);

  const { 
    transformedPreferences, 
    userLocation, 
    isLoading: dataLoading, 
    therapists, 
    experiences, 
    events 
  } = useHomeData();
  
  // 簡易的な翻訳関数のフォールバック（useMultiLanguageの代わり）
  const t = (key: string): string => key;
  const languageLoading = false;

  // 認証状態からuserとloadingを抽出
  const user = authState?.user || null;
  const authLoading = authState?.loading || true; // 認証状態が取得されるまではloadingをtrueに

  // user?.id が undefined の場合は空文字列を渡す
  const { notifications, isLoading: notificationLoading } = useNotificationsApi(user?.id || "");

  return {
    user,
    therapists,
    experiences,
    events,
    notifications,
    userLocation,
    transformedPreferences,
    t,
    isLoading: authLoading || dataLoading || languageLoading || notificationLoading
  };
};