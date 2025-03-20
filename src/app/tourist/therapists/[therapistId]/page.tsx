// src/app/tourist/therapists/[therapistId]/page.tsx
"use client";

import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';

// Force dynamic rendering to skip static generation
export const dynamic = 'force-dynamic';

// Define the GraphQL query to fetch therapist data
const GET_THERAPIST = gql`
  query GetTherapist($id: uuid!) {
    therapist_by_pk(id: $id) {
      name
      bio
      profile_picture
      location
      languages
      price_range_min
      price_range_max
      currency
      experience_years
      business_name
      rating
    }
  }
`;

export default function TherapistPage({ params }: { params: { therapistId: string } }) {
  const { therapistId } = params;

  // Fetch data using Apollo Client's useQuery
  const { data, loading, error } = useQuery(GET_THERAPIST, {
    variables: { id: therapistId },
    // Skip query during server-side build to avoid errors
    skip: process.env.NODE_ENV === 'production' && typeof window === 'undefined',
  });

  // Handle loading state
  if (loading) return <div>Loading...</div>;
  
  // Handle error state
  if (error) return <div>Error: {error.message}</div>;
  
  // Handle no data
  if (!data || !data.therapist_by_pk) return <div>No data available</div>;

  // Render therapist data
  return (
    <div>
      <h1>{data.therapist_by_pk.name}</h1>
      <p>{data.therapist_by_pk.bio}</p>
    </div>
  );
}