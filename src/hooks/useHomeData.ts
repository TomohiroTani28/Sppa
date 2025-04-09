// src/hooks/useHomeData.ts
"use client";
import { useAuth } from "@/hooks/api/useAuth";
import { useFetchEvents } from "@/hooks/api/useFetchEvents";
import { useFetchLocalExperiences } from "@/hooks/api/useFetchLocalExperiences";
import { useFetchTherapists } from "@/hooks/api/useFetchTherapists";
import { useLocationService } from "@/hooks/useLocationService";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { useEffect, useMemo, useState } from "react";

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null; // Changed to allow null
}

// Separate hook for user data
const useUser = () => {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const authState = await auth.getAuthState();
      if (authState.user) {
        const userData = {
          id: authState.user.id,
          name: authState.user.name ?? null,
          email: authState.user.email ?? null,
          image: authState.user.image ?? null,
          role: authState.user.role ?? null
        };
        setUser(userData);
      } else {
        setUser(null);
      }
    };
    fetchUser();
  }, [auth]);

  return user;
};

// Separate hook for language preferences
const useLanguagePreference = (preferences: any) => {
  const [preferredLanguage, setPreferredLanguage] = useState("en");

  useEffect(() => {
    const languages = preferences?.preferred_languages ?? [];
    if (languages && languages.length > 0) {
      setPreferredLanguage(languages[0] ?? 'en');
    }
  }, [preferences]);

  return preferredLanguage;
};

// Separate hook for experiences based on location
const useLocationBasedExperiences = (userLocation: any, fetchExperiences: any) => {
  useEffect(() => {
    if (userLocation) {
      const locationParams = {
        lat: userLocation.lat,
        lng: userLocation.lng,
        radius: 10,
      };
      fetchExperiences({ where: locationParams, limit: 10 }).catch((err: Error) =>
        console.error("Error fetching experiences:", err)
      );
    }
  }, [fetchExperiences, userLocation]);
};

// Transform preferences to the required format
const transformPreferences = (preferences: any) => {
  return {
    categories: preferences?.preferred_services ?? [],
    languages: preferences?.preferred_languages ?? [],
    budget: preferences?.preferred_budget,
    gender: preferences?.gender_preference,
    amenities: preferences?.amenities_preference ?? {},
  };
};

// Main hook with reduced complexity
export const useHomeData = () => {
  const user = useUser();
  const { preferences, isLoading: preferencesLoading } = useUserPreferences();
  const { userLocation, loading: locationLoading } = useLocationService();
  const { experiences, loading: experiencesLoading, fetchExperiences } = useFetchLocalExperiences();
  const { therapists, loading: therapistsLoading } = useFetchTherapists();
  const { events, loading: eventsLoading } = useFetchEvents();

  const preferredLanguage = useLanguagePreference(preferences);
  
  // Set up location-based experiences
  useLocationBasedExperiences(userLocation, fetchExperiences);

  const isLoading = useMemo(
    () =>
      preferencesLoading ||
      locationLoading ||
      experiencesLoading ||
      therapistsLoading ||
      eventsLoading,
    [preferencesLoading, locationLoading, experiencesLoading, therapistsLoading, eventsLoading]
  );

  const transformedPreferences = useMemo(
    () => transformPreferences(preferences),
    [preferences]
  );

  return {
    user,
    transformedPreferences,
    userLocation,
    experiences,
    therapists,
    events,
    preferredLanguage,
    isLoading,
  };
};