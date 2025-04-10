// src/hooks/useUserPreferences.ts
"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/hooks/api/useUser";
import { useAuth } from "@/hooks/api/useAuth";
import { AuthState } from '@/types/auth'; // インポートを追加

// UserPreferences と UserProfile のインターフェースはそのまま使用
export interface UserPreferences {
  preferred_services?: string[];
  preferred_duration?: number;
  preferred_budget?: number;
  preferred_languages?: string[];
  gender_preference?: "male" | "female" | "any";
  amenities_preference?: { [key: string]: boolean };
  timeZone?: string;
  language?: string;
  currency?: string;
  notifications?: { email: boolean; push: boolean; sms: boolean };
}

interface UserProfile {
  id: string;
  preferences?: UserPreferences;
  timeZone?: string;
  language?: string;
  currency?: string;
}

export const useUserPreferences = () => {
  const { getAuthState } = useAuth();

  // Authentication state
  const [authState, setAuthState] = useState<AuthState | null>(null);

  // Fetch auth state
  useEffect(() => {
    const fetchAuthState = async () => {
      try {
        const state = await getAuthState();
        setAuthState(state);
      } catch (err) {
        console.error("Failed to fetch auth state:", err);
      }
    };
    fetchAuthState();
  }, [getAuthState]);

  const userId = authState?.user?.id ?? "";
  const authLoading = authState?.loading ?? true;

  // User data from useUser hook
  const { user, loading: userLoading, error: userError } = useUser(userId);

  // Local state for preferences, loading, and error
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync preferences when user data changes
  useEffect(() => {
    if (!user) return;

    const userData = user as Record<string, any>;
    const userPrefs = userData.preferences ?? userData.user_preferences;

    if (userPrefs) {
      setPreferences({
        preferred_services: userPrefs.preferred_services ?? [],
        preferred_duration: userPrefs.preferred_duration,
        preferred_budget: userPrefs.preferred_budget,
        preferred_languages: userPrefs.preferred_languages ?? [],
        gender_preference: userPrefs.gender_preference ?? "any",
        amenities_preference: userPrefs.amenities_preference ?? {},
        timeZone: userData.timeZone ?? userData.time_zone ?? "Asia/Bali",
        language: userData.language ?? "en",
        currency: userData.currency ?? "IDR",
        notifications: {
          email: true,
          push: true,
          sms: false,
        },
      });
    }
  }, [user]);

  // Placeholder functions for updating data (replace with actual API calls)
  const updatePreferencesData = (data: any) => {
    console.log("Updating user preferences:", data);
    return Promise.resolve(true);
  };

  const refreshUserData = async () => {
    console.log("Refreshing user data");
    return Promise.resolve();
  };

  // Save preferences function
  const saveUserPreferences = async (newPreferences: Partial<UserPreferences>) => {
    if (!authState?.user) {
      setError("User not logged in");
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const preferencesUpdate = {
        preferred_services: newPreferences.preferred_services,
        preferred_duration: newPreferences.preferred_duration,
        preferred_budget: newPreferences.preferred_budget,
        preferred_languages: newPreferences.preferred_languages,
        gender_preference: newPreferences.gender_preference,
        amenities_preference: newPreferences.amenities_preference,
      };

      await updatePreferencesData({
        preferences: preferencesUpdate,
        user_preferences: preferencesUpdate,
      });

      const hasAdditionalSettings = Boolean(
        newPreferences.timeZone ?? newPreferences.language ?? newPreferences.currency
      );
      if (hasAdditionalSettings) {
        console.log("Would update user settings:", {
          timeZone: newPreferences.timeZone,
          language: newPreferences.language,
          currency: newPreferences.currency,
        });
      }

      await refreshUserData();
      setPreferences((prev: UserPreferences | null) =>
        prev ? { ...prev, ...newPreferences } : newPreferences
      );
      return true;
    } catch (err) {
      console.error("Error saving preferences:", err);
      setError("Failed to save preferences");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    preferences,
    isLoading: isLoading || userLoading || authLoading,
    error: error ?? userError,
    saveUserPreferences,
  };
};