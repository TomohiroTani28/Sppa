// src/hooks/useTherapistSearch.ts
import { fetchTherapists } from "@/backend/api/graphql/therapists";
import { useEffect, useState } from "react";

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
        // serviceが未定義の場合、nullを渡す
        const queryVars: TherapistsQueryVariables = {
          service: filters.specialty || null
        };
        const data: RawTherapist[] = await fetchTherapists(queryVars);
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