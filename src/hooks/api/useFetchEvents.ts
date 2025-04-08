// src/hooks/api/useFetchEvents.ts
import type { Event } from "@/types/event";
import { gql, useQuery } from "@apollo/client";

const FETCH_EVENTS = gql`
  query FetchEvents {
    api_events {
      id
      therapistId
      title
      description
      startDate
      endDate
      imageUrl
      discountPercentage
      location
      createdAt
      updatedAt
    }
  }
`;

export function useFetchEvents() {
  const { data, loading, error } = useQuery(FETCH_EVENTS);
  
  // データをEvent型に変換
  const events: Event[] = data?.api_events?.map((event: any) => ({
    id: event.id,
    therapistId: event.therapistId,
    title: event.title,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    imageUrl: event.imageUrl,
    discountPercentage: event.discountPercentage,
    location: event.location,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
  })) || [];
  
  return {
    events,
    loading,
    error,
  };
}
