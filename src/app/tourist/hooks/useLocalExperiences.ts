// src/app/tourist/hooks/useLocalExperiences.ts
import { useState, useEffect } from "react";
import { getLocalExperiencesAPI } from "@/backend/api/graphql/local-experiences"; // Adjust path if moved

interface LocalExperience {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number; // Note: This field isn’t in the query; adjust as needed
  media: string[]; // Note: This field isn’t in the query; adjust as needed
}

/**
 * Custom hook to fetch local experiences via API.
 * @returns {Object} Object containing experiences, loading state, and error.
 */
export const useLocalExperiences = () => {
  const [experiences, setExperiences] = useState<LocalExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getLocalExperiencesAPI();
        setExperiences(response.data.local_experiences || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch experiences"));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { experiences, loading, error };
};