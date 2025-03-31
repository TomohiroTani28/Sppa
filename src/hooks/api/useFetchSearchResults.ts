"use client";
// src/hooks/api/useFetchSearchResults.ts
import { useState, useEffect, useCallback } from "react";
import { gql, useQuery } from "@apollo/client";

interface TherapistResult {
  id: string;
  type: "therapist";
  name: string;
  profilePicture?: string;
  rating?: number;
  bio?: string;
  location?: {
    address?: string;
  };
  services?: {
    price: number;
    currency: string;
  }[];
}

interface ExperienceResult {
  id: string;
  type: "experience";
  title: string;
  description?: string;
  thumbnailUrl?: string;
  location?: string;
  category?: string;
}

type SearchResult = TherapistResult | ExperienceResult;

const SEARCH_QUERY = gql`
  query Search($query: String!, $offset: Int!, $limit: Int!) {
    therapists: users(
      where: {
        _or: [
          { name: { _ilike: $query } }
          { therapist_profile: { bio: { _ilike: $query } } }
          { therapist_services: { service_name: { _ilike: $query } } }
        ]
        role: { _eq: "therapist" }
      }
      offset: $offset
      limit: $limit
    ) {
      id
      name
      profile_picture
      therapist_profile {
        bio
        rating
        location
      }
      therapist_services(limit: 1) {
        price
        currency
      }
    }

    experiences: local_experiences(
      where: {
        _or: [
          { title: { _ilike: $query } }
          { description: { _ilike: $query } }
        ]
      }
      offset: $offset
      limit: $limit
    ) {
      id
      title
      description
      location
      thumbnail_url
      local_experience_category {
        name
      }
    }
  }
`;

export const useFetchSearchResults = (query: string) => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [offset, setOffset] = useState(0);
  const limit = 10;
  const searchTerm = `%${query}%`;

  const {
    data,
    loading,
    error,
    fetchMore: apolloFetchMore,
  } = useQuery(SEARCH_QUERY, {
    variables: { query: searchTerm, offset: 0, limit },
    skip: !query,
  });

  useEffect(() => {
    if (data) {
      const therapistResults: TherapistResult[] = (data.therapists || []).map(
        (t: any) => ({
          id: t.id,
          type: "therapist",
          name: t.name,
          profilePicture: t.profile_picture,
          rating: t.therapist_profile?.rating,
          bio: t.therapist_profile?.bio,
          location: t.therapist_profile?.location,
          services: t.therapist_services,
        }),
      );

      const experienceResults: ExperienceResult[] = (
        data.experiences || []
      ).map((e: any) => ({
        id: e.id,
        type: "experience",
        title: e.title,
        description: e.description,
        thumbnailUrl: e.thumbnail_url,
        location: e.location,
        category: e.local_experience_category?.name,
      }));

      setResults([...therapistResults, ...experienceResults]);
    }
  }, [data]);

  const fetchMore = useCallback(() => {
    if (!loading && results.length > 0) {
      const newOffset = offset + limit;
      setOffset(newOffset);

      apolloFetchMore({
        variables: {
          offset: newOffset,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

          return {
            therapists: [...prev.therapists, ...fetchMoreResult.therapists],
            experiences: [...prev.experiences, ...fetchMoreResult.experiences],
          };
        },
      });
    }
  }, [loading, results.length, offset, limit, apolloFetchMore]);

  // Reset results when query changes
  useEffect(() => {
    setResults([]);
    setOffset(0);
  }, [query]);

  return { results, loading, error, fetchMore };
};

export default useFetchSearchResults;
