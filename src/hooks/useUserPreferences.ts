// src/hooks/useUserPreferences.ts
"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/hooks/api/useUser";
import useAuth from "@/hooks/api/useAuth";

export interface UserPreferences {
  preferred_services?: string[];
  preferred_duration?: number;
  preferred_budget?: number;
  preferred_languages?: string[];
  gender_preference?: "male" | "female" | "any";
  amenities_preference?: {
    [key: string]: boolean;
  };
  timeZone?: string;
  language?: string;
  currency?: string;
  notifications?: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

interface UserProfile {
  id: string;
  // Add other fields as needed based on useUser/useAuth return type
  preferences?: UserPreferences;
  timeZone?: string;
  language?: string;
  currency?: string;
}

/**
 * Custom hook to manage user preferences.
 * @returns Object with preferences, loading state, error, and save function.
 */
export const useUserPreferences = () => {
  const { user: authUser, loading: authLoading } = useAuth();
  // authUser?.id の可能性を考慮して、undefined の場合は空文字列を渡す
  const { user, loading: userLoading, error: userError } = useUser(authUser?.id || "");
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const userData = user as Record<string, any>;
    const userPrefs = userData.preferences || userData.user_preferences;

    if (userPrefs) {
      setPreferences({
        preferred_services: userPrefs.preferred_services || [],
        preferred_duration: userPrefs.preferred_duration,
        preferred_budget: userPrefs.preferred_budget,
        preferred_languages: userPrefs.preferred_languages || [],
        gender_preference: userPrefs.gender_preference || "any",
        amenities_preference: userPrefs.amenities_preference || {},
        timeZone: userData.timeZone || userData.time_zone || "Asia/Bali",
        language: userData.language || "en",
        currency: userData.currency || "IDR",
        notifications: {
          email: true,
          push: true,
          sms: false,
        },
      });
    }
  }, [user]);

  const updatePreferencesData = (data: any) => {
    console.log("Updating user preferences:", data);
    return Promise.resolve(true);
  };

  const refreshUserData = async () => {
    console.log("Refreshing user data");
    return Promise.resolve();
  };

  const saveUserPreferences = async (newPreferences: Partial<UserPreferences>) => {
    if (!authUser) {
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
        newPreferences.timeZone ||
          newPreferences.language ||
          newPreferences.currency,
      );
      if (hasAdditionalSettings) {
        console.log("Would update user settings:", {
          timeZone: newPreferences.timeZone,
          language: newPreferences.language,
          currency: newPreferences.currency,
        });
      }

      await refreshUserData();
      setPreferences((prev) =>
        prev ? { ...prev, ...newPreferences } : newPreferences,
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
    error: error || userError,
    saveUserPreferences,
  };
};
