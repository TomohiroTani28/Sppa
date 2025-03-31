// src/hooks/api/useFetchServices.ts
import { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { useRealtimeAvailability } from "@/realtime/useRealtimeAvailability";

const FETCH_SERVICES = gql`
  query FetchServices {
    therapist_services(where: { is_active: { _eq: true } }) {
      id
      therapist_id
      service_name
      description
      duration
      price
      currency
      category
      is_active
      updated_at
    }
  }
`;

interface Service {
  id: string;
  therapist_id: string;
  service_name: string;
  description: string;
  duration: number;
  price: number;
  currency: string;
  category: string;
  is_active: boolean;
  updated_at: string;
}

export function useFetchServices() {
  const [services, setServices] = useState<Service[]>([]);
  const { data, loading, error } = useQuery(FETCH_SERVICES, {
    fetchPolicy: "network-only",
  });

  // Set up real-time updates for the "therapist_services" table
  useRealtimeAvailability("therapist_services");

  // Update services state when query data changes
  useEffect(() => {
    if (data?.therapist_services) {
      setServices(data.therapist_services);
    }
  }, [data]);

  return { services, loading, error };
}
