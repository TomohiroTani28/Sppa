// src/app/tourist/hooks/useTherapistSearch.ts
import { useState, useEffect } from "react";
import { fetchTherapists } from "@/backend/api/graphql/therapists";

// Define the shape of the raw therapist data returned by fetchTherapists
interface RawTherapist {
  id: string;
  name: string;
  services: { service_name: string }[];
  average_rating: number;
  hourly_rate: number;
  working_hours: string[];
}

interface Therapist {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  price: number;
  availability: string[];
}

export const useTherapistSearch = (filters: {
  specialty?: string;
  minRating?: number;
}) => {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Explicitly type the return value of fetchTherapists
        const data: RawTherapist[] = await fetchTherapists({ service: filters.specialty });
        const filtered = data
          .filter((t: RawTherapist) => !filters.minRating || t.average_rating >= filters.minRating)
          .map((t: RawTherapist) => ({
            id: t.id,
            name: t.name,
            specialty: t.services[0]?.service_name || "",
            rating: t.average_rating,
            price: t.hourly_rate,
            availability: t.working_hours || [],
          }));
        setTherapists(filtered);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch therapists"));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters.specialty, filters.minRating]);

  return { therapists, loading, error };
};