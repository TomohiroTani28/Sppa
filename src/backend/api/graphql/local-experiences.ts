// src/backend/api/graphql/local-experiences.ts
import { gql } from "@apollo/client";

// For Apollo Client (useQuery, useSubscription, etc.)
export const GET_LOCAL_EXPERIENCES = gql`
  query GetLocalExperiences {
    api_local_experiences {
      id
      title
      description
      location
      price
      media
    }
  }
`;

// For fetch-based API call
const getLocalExperiencesQuery = `
  query GetLocalExperiences {
    api_local_experiences {
      id
      title
      description
      location
      price
      media
    }
  }
`;

export const getLocalExperiencesAPI = async () => {
  const response = await fetch('/api/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: getLocalExperiencesQuery, // Use the plain string query
    }),
  });
  return response.json();
};