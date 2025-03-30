// src/app/(common)/chat/hooks/useSearchUsers.ts
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";

const SEARCH_USERS_QUERY = gql`
  query SearchUsers($query: String!) {
    users(where: { name: { _ilike: $query } }) {
      id
      name
      profile_picture
      therapist_profiles {
        bio
      }
    }
  }
`;

export const useSearchUsers = (query: string) => {
  const { data, loading, error } = useQuery(SEARCH_USERS_QUERY, {
    variables: { query: `%${query}%` },
    skip: !query,
  });
  if (loading || !query) return [];
  if (error) {
    console.error("Search users query error:", error);
    return [];
  }
  return (
    data?.users.map((user: any) => ({
      id: user.id,
      name: user.name,
      profile_picture: user.profile_picture,
      bio: user.therapist_profiles?.[0]?.bio,
    })) || []
  );
};