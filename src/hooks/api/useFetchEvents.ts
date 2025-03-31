// src/hooks/api/useFetchEvents.ts
import { useQuery } from "@apollo/client";
import { gql } from "graphql-tag";

const FETCH_EVENTS = gql`
  query FetchEvents {
    api_events {
      id
      title
      description
      start_date
      end_date
      discount_percentage
    }
  }
`;

export function useFetchEvents() {
  const { data, loading, error } = useQuery(FETCH_EVENTS);
  return {
    events: data ? data.api_events : [],
    loading,
    error,
  };
}
