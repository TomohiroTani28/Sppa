// src/hooks/usePageData.ts
import { useEffect, useState } from 'react';
import { useAuth } from "@/hooks/api/useAuth";
import { useHomeData } from "./useHomeData";
import { useNotificationsApi } from "@/hooks/api/useNotificationsApi";

// Define AuthState type to match the actual return from getAuthState()
type AuthState = {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    role: string | null;
  } | null;
  token: string | null;
  role: any;
  profile_picture: string | null;
  loading: boolean;
};

export const usePageData = () => {
  const { getAuthState } = useAuth();

  // Fixed the type definition to match what getAuthState returns
  const [authState, setAuthState] = useState<AuthState | null>(null);

  // Fetch auth state when component mounts
  useEffect(() => {
    const fetchAuthState = async () => {
      try {
        const state = await getAuthState();
        setAuthState(state);
      } catch (error) {
        console.error('認証状態の取得に失敗しました:', error);
        // Error handling can be expanded here if needed
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
  
  // Simple translation function fallback (instead of useMultiLanguage)
  const t = (key: string): string => key;
  const languageLoading = false;

  // Extract user and loading from auth state
  const user = authState?.user || null;
  const authLoading = authState?.loading ?? true; // Use nullish coalescing instead of logical OR

  // Use nullish coalescing here too
  const { notifications, isLoading: notificationLoading } = 
    useNotificationsApi(user?.id ?? "");

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