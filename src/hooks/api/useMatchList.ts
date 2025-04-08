// src/hooks/api/useMatchList.ts
import type { Therapist } from "@/types/therapist";
import { gql, useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";

// GraphQL query to fetch therapists with filters
const GET_THERAPISTS = gql`
  query GetTherapists(
    $limit: Int
    $offset: Int
    $searchTerm: String
    $priceMin: numeric
    $priceMax: numeric
    $serviceCategories: [uuid!]
    $languages: [String!]
    $availability: timestamptz
  ) {
    therapist_profiles(
      limit: $limit
      offset: $offset
      where: {
        _or: [
          { bio: { _ilike: $searchTerm } }
          { user: { name: { _ilike: $searchTerm } } }
        ]
        price_range_min: { _gte: $priceMin }
        price_range_max: { _lte: $priceMax }
        languages: { _contains: $languages }
        _and: [
          {
            user: {
              therapist_services: { category_id: { _in: $serviceCategories } }
            }
          }
          {
            user: {
              therapist_availability: {
                start_time: { _lte: $availability }
                end_time: { _gte: $availability }
                is_available: { _eq: true }
              }
            }
          }
        ]
      }
      order_by: { rating: desc }
    ) {
      id
      user_id
      bio
      experience_years
      location
      languages
      certifications
      working_hours
      status
      last_online_at
      price_range_min
      price_range_max
      currency
      business_name
      address
      rating
      user {
        id
        name
        profile_picture
        therapist_services {
          id
          service_name
          description
          duration
          price
          currency
          category_id
          is_active
        }
        media {
          id
          url
          media_type
          caption
          is_profile_image
          is_service_image
        }
      }
    }
  }
`;

// Interface for filter options
interface TherapistFilters {
  searchTerm?: string;
  priceRange?: [number, number];
  serviceCategories?: string[];
  languages?: string[];
  availability?: Date;
  limit?: number;
  offset?: number;
}

// Main hook for fetching therapists
export const useFetchTherapists = (initialFilters?: TherapistFilters) => {
  const [filters, setFilters] = useState<TherapistFilters>(
    initialFilters || {
      searchTerm: "",
      priceRange: [0, 1000000],
      serviceCategories: [],
      languages: [],
      limit: 10,
      offset: 0,
    },
  );

  const [fetchTherapists, { loading, error, data, fetchMore }] = useLazyQuery(
    GET_THERAPISTS,
    {
      variables: {
        limit: filters.limit,
        offset: filters.offset,
        searchTerm: filters.searchTerm ? `%${filters.searchTerm}%` : "%",
        priceMin: filters.priceRange?.[0] || 0,
        priceMax: filters.priceRange?.[1] || 1000000,
        serviceCategories: filters.serviceCategories?.length
          ? filters.serviceCategories
          : null,
        languages: filters.languages?.length ? filters.languages : null,
        availability: filters.availability
          ? filters.availability.toISOString()
          : null,
      },
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
    },
  );

  // Apply filters and fetch therapists
  const applyFilters = (newFilters: Partial<TherapistFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      offset: 0, // Reset offset when applying new filters
    }));
  };

  // Load more therapists
  const loadMore = () => {
    if (data?.therapist_profiles) {
      fetchMore({
        variables: {
          offset: data.therapist_profiles.length,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            therapist_profiles: [
              ...prev.therapist_profiles,
              ...fetchMoreResult.therapist_profiles,
            ],
          };
        },
      });
    }
  };

  // Transform the data to our Therapist model
  const therapists: Therapist[] =
    data?.therapist_profiles.map((profile: any) => ({
      id: profile.user_id,
      name: profile.user.name,
      profilePicture: profile.user.profile_picture,
      bio: profile.bio,
      experienceYears: profile.experience_years,
      location: profile.location,
      languages: profile.languages || [],
      certifications: profile.certifications,
      workingHours: profile.working_hours,
      status: profile.status,
      lastOnlineAt: profile.last_online_at,
      priceRangeMin: profile.price_range_min,
      priceRangeMax: profile.price_range_max,
      currency: profile.currency,
      businessName: profile.business_name,
      address: profile.address,
      rating: profile.rating,
      services:
        profile.user.therapist_services?.filter((s: any) => s.is_active) || [],
      media: profile.user.media || [],
    })) || [];

  // Fetch therapists when filters change
  useEffect(() => {
    fetchTherapists();
  }, [fetchTherapists, filters]);

  return {
    therapists,
    loading,
    error,
    filters,
    applyFilters,
    loadMore,
    hasMore: data?.therapist_profiles?.length === filters.limit,
  };
};

export default useFetchTherapists;
