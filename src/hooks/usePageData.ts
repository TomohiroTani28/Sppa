// src/hooks/usePageData.ts
import { useEffect, useState } from 'react';
import { useAuth } from "@/hooks/api/useAuth";
import { useHomeData } from "./useHomeData";
import { useNotificationsApi } from "@/hooks/api/useNotificationsApi";

// Define AuthState type to match your expected structure
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

  const [authState, setAuthState] = useState<AuthState | null>(null);

  useEffect(() => {
    const fetchAuthState = async () => {
      try {
        const state = await getAuthState();
        // Normalize the state to match local AuthState type
        const normalizedUser = state.user
          ? {
              id: state.user.id,
              name: state.user.name ?? null, // Convert undefined to null
              email: state.user.email ?? null,
              image: state.user.image ?? null,
              role: state.user.role ?? null,
            }
          : null;
        const normalizedState: AuthState = {
          user: normalizedUser,
          token: state.token ?? null, // Normalize to string | null
          role: state.role, // 'any' type accepts anything
          profile_picture: state.profile_picture ?? null, // Normalize to string | null
          loading: state.loading,
        };
        setAuthState(normalizedState);
      } catch (error) {
        console.error('認証状態の取得に失敗しました:', error);
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
  
  const t = (key: string): string => key;
  const languageLoading = false;

  const user = authState?.user || null;
  const authLoading = authState?.loading ?? true;

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