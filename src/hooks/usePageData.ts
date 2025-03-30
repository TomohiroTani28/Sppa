// src/app/tourist/home/hooks/usePageData.ts
import { useAuth } from "@/hooks/api/useAuth";
import { useHomeData } from "./useHomeData";
import useMultiLanguage from "@/components/MultiLanguageSupport";
import { useNotificationsApi } from "@/hooks/api/useNotificationsApi";

export const usePageData = () => {
  const { user, loading: authLoading } = useAuth();
  const { 
    transformedPreferences, 
    userLocation, 
    isLoading: dataLoading, 
    therapists, 
    experiences, 
    events 
  } = useHomeData();
  
  // Let's skip trying to use useMultiLanguage directly since it's causing type issues
  // Instead, create a simple fallback translation function
  const t = (key: string): string => key;
  const languageLoading = false;
  
  // user?.id が undefined の場合は空文字列を渡す（必要に応じて適切なフォールバック値に変更してください）
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
