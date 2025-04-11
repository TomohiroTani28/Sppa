// src/app/api/events/route.ts
import { getClient } from "@/lib/hasura-client";
import { gql } from "@apollo/client";
import { NextRequest, NextResponse } from 'next/server';

// Define the GraphQL query (not exported, used internally)
const GET_EVENTS = gql`
  query GetEvents($therapistId: uuid!) {
    events(where: { therapist_id: { _eq: $therapistId } }) {
      id
      title
      description
      start_date
      end_date
      discount_percentage
      promotion_code
      is_active
      created_at
      updated_at
    }
  }
`;

// Export a GET handler for the API route
export async function GET(request: NextRequest) {
  // Extract therapistId from query parameters (e.g., /api/events?therapistId=some-id)
  const url = new URL(request.url);
  const therapistId = url.searchParams.get('therapistId');

  // Validate that therapistId is provided
  if (!therapistId) {
    return NextResponse.json({ error: 'therapistId is required' }, { status: 400 });
  }

  try {
    // クライアントを非同期で直接取得
    const client = await getClient();
    
    const { data, error } = await client.query({
      query: GET_EVENTS,
      variables: { therapistId },
      fetchPolicy: 'network-only',
    });

    if (error) {
      console.error('Error fetching events:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

    // Return the events as a JSON response
    return NextResponse.json(data.events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}