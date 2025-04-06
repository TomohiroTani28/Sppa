// src/hooks/useHomeData.ts
"use client";
import { useEffect, useMemo, useState } from "react";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { useLocationService } from "@/hooks/useLocationService";
import { useFetchLocalExperiences } from "@/hooks/api/useFetchLocalExperiences";
import { useFetchTherapists } from "@/hooks/api/useFetchTherapists";
import { useFetchEvents } from "@/hooks/api/useFetchEvents";
import { useAuth } from "@/hooks/api/useAuth";

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
}

export const useHomeData = () => {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const authState = await auth.getAuthState();
      setUser(authState.user);
    };
    fetchUser();
  }, [auth]);

  const { preferences, isLoading: preferencesLoading } = useUserPreferences();
  const { userLocation, loading: locationLoading } = useLocationService();
  const { experiences, loading: experiencesLoading, fetchExperiences } = useFetchLocalExperiences();
  const { therapists, loading: therapistsLoading } = useFetchTherapists();
  const { events, loading: eventsLoading } = useFetchEvents();

  const [preferredLanguage, setPreferredLanguage] = useState("en");

  useEffect(() => {
    const languages = preferences?.preferred_languages ?? [];
    if (languages.length > 0) {
      setPreferredLanguage(languages[0]);
    }
  }, [preferences]);

  useEffect(() => {
    if (userLocation) {
      const locationParams = {
        lat: userLocation.lat,
        lng: userLocation.lng,
        radius: 10,
      };
      fetchExperiences({ where: locationParams, limit: 10 }).catch((err) =>
        console.error("Error fetching experiences:", err)
      );
    }
  }, [fetchExperiences, userLocation]);

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
    () => ({
      categories: preferences?.preferred_services || [],
      languages: preferences?.preferred_languages || [],
      budget: preferences?.preferred_budget,
      gender: preferences?.gender_preference,
      amenities: preferences?.amenities_preference || {},
    }),
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