// src/hooks/api/useUser.ts
import { useState, useEffect } from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client";

// GraphQL query to fetch user data
const GET_USER = gql`
  query GetUser($userId: uuid!) {
    users_by_pk(id: $userId) {
      id
      name
      email
      profile_picture
      phone_number
      role
      verified_at
      created_at
      updated_at
      therapist_profiles {
        bio
        experience_years
        languages
        location
        working_hours
        status
        last_online_at
        price_range_min
        price_range_max
        currency
        business_name
        address
        rating
      }
      tourist_profiles {
        nationality
        languages
        interests
        travel_dates
        budget
        preferences
      }
    }
  }
`;

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  profile_picture?: string;
  phone_number?: string;
  role: "therapist" | "tourist";
  verified_at?: string;
  created_at: string;
  updated_at: string;
  therapist_profiles?: {
    bio?: string;
    experience_years?: number;
    languages?: string[];
    location?: any;
    working_hours?: any;
    status: string;
    last_online_at?: string;
    price_range_min?: number;
    price_range_max?: number;
    currency?: string;
    business_name?: string;
    address?: string;
    rating: number;
  }[];
  tourist_profiles?: {
    nationality?: string;
    languages?: string[];
    interests?: any;
    travel_dates?: any;
    budget?: number;
    preferences?: any;
  }[];
}

export const useUser = (userId: string) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { loading, error, data, refetch } = useQuery(GET_USER, {
    variables: { userId },
    skip: !userId,
    fetchPolicy: "network-only",
    errorPolicy: "all",
    onError: (error) => {
      console.error("GraphQL error:", error);
      if (error.networkError) {
        setErrorMessage(
          "ネットワークエラーが発生しました。インターネット接続を確認してください。",
        );
      } else if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        setErrorMessage(`GraphQLエラー: ${error.graphQLErrors[0].message}`);
      } else {
        setErrorMessage("データの取得中にエラーが発生しました。");
      }
    },
  });

  useEffect(() => {
    if (data?.users_by_pk) {
      setUser(data.users_by_pk);
      setErrorMessage(null);
    } else if (data && !data.users_by_pk && !loading) {
      // データは返されたがユーザーが見つからない場合
      setErrorMessage("指定されたユーザーは見つかりませんでした。");
    }
  }, [data, loading]);

  return {
    user,
    loading,
    error: errorMessage || (error ? error.message : null),
    refetch,
  };
};
