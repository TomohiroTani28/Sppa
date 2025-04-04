"use client";
// src/hooks/api/useTherapistSearch.ts
import { useState, useCallback, useEffect } from 'react';
import { useQuery, useSubscription, gql, ApolloClient } from '@apollo/client';
import { TherapistProfile } from '@/types/therapist';
import hasuraClient from '@/lib/hasura-client';
import { useTranslation } from 'next-i18next';

interface FilterOptions {
  location?: string;
  languages?: string[];
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  availableNow?: boolean;
}

export interface TherapistSearchResult extends TherapistProfile {
  user: {
    id: string;
    name: string;
    profile_picture?: string;
  };
}

const SEARCH_THERAPISTS_QUERY = gql`
  query SearchTherapists($searchTerm: String, $filters: therapist_profiles_bool_exp) {
    therapist_profiles(where: {
      _and: [
        { _or: [
          { business_name: { _ilike: $searchTerm } },
          { bio: { _ilike: $searchTerm } },
          { location: { _ilike: $searchTerm } }
        ]},
        $filters
      ]
    }, order_by: { last_online_at: desc_nulls_last }) {
      id
      user_id
      bio
      experience_years
      location
      languages
      working_hours
      status
      last_online_at
      price_range_min
      price_range_max
      currency
      business_name
      address
      created_at
      updated_at
      user {
        id
        name
        profile_picture
      }
    }
  }
`;

const THERAPIST_STATUS_SUBSCRIPTION = gql`
  subscription TherapistStatusUpdates($ids: [uuid!]) {
    therapist_profiles(where: { id: { _in: $ids } }) {
      id
      status
      last_online_at
    }
  }
`;

/**
 * Builds filter variables for GraphQL query
 * @param filterOptions Filter options to apply
 * @returns Filter conditions object
 */
const buildFilterVariables = (filterOptions: FilterOptions): any => {
  const filterConditions: any = {};

  if (filterOptions.location) {
    filterConditions.location = { _ilike: `%${filterOptions.location}%` };
  }
  if (filterOptions.languages?.length) {
    filterConditions.languages = { _contains: filterOptions.languages };
  }
  if (filterOptions.minPrice) {
    filterConditions.price_range_min = { _gte: filterOptions.minPrice };
  }
  if (filterOptions.maxPrice) {
    filterConditions.price_range_max = { _lte: filterOptions.maxPrice };
  }
  if (filterOptions.status) {
    filterConditions.status = { _eq: filterOptions.status };
  }
  if (filterOptions.availableNow) {
    filterConditions.status = { _eq: 'online' };
    filterConditions.last_online_at = { 
      _gte: new Date(Date.now() - 5 * 60 * 1000).toISOString()
    };
  }

  return filterConditions;
};

/**
 * Custom hook to handle therapist search functionality
 * @returns Object containing search results, loading state, error, and control functions
 */
export function useTherapistSearch() {
  const { t } = useTranslation('common');
  const [results, setResults] = useState<TherapistSearchResult[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [clientInstance, setClientInstance] = useState<ApolloClient<any> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Initialize Apollo Client instance
  useEffect(() => {
    const fetchClient = async () => {
      const client = await hasuraClient();
      setClientInstance(client);
    };
    fetchClient();
  }, []);

  const searchTherapists = useCallback(async () => {
    if (!clientInstance) return;
    setLoading(true);
    setError(null);

    try {
      const filterVariables = buildFilterVariables(filters);
      const { data } = await clientInstance.query({
        query: SEARCH_THERAPISTS_QUERY,
        variables: { searchTerm: `%${searchTerm}%`, filters: filterVariables },
      });

      setResults(data.therapist_profiles);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [clientInstance, searchTerm, filters]);

  useEffect(() => {
    searchTherapists();
  }, [searchTherapists]);

  return {
    results,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    loading,
    error,
  };
}