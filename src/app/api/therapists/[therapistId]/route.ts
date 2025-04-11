// src/app/api/therapists/[therapistId]/route.ts
import { graphqlClient } from "@/lib/apollo-client";
import { gql } from "@apollo/client";
import { NextRequest, NextResponse } from "next/server";

// GraphQL query
const GET_THERAPIST_PROFILE = gql`
  query GetTherapistProfile($id: uuid!) {
    therapist_profiles_by_pk(id: $id) {
      id
      user_id
      bio
      languages
      working_hours
      status
      location
      experience_years
      price_range_min
      price_range_max
      currency
      business_name
      address
      last_online_at
      certifications
      user {
        name
        profile_picture
      }
    }
  }
`;

export async function GET(request: NextRequest) {
  try {
    // therapistId を URL パスから抽出
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/');
    const therapistId = pathSegments[pathSegments.indexOf('therapists') + 1];

    if (!therapistId) {
      return NextResponse.json(
        { error: "Therapist ID is required" },
        { status: 400 }
      );
    }

    const client = graphqlClient;
    const { data, error } = await client.query({
      query: GET_THERAPIST_PROFILE,
      variables: { id: therapistId },
    });

    if (error) {
      console.error("GraphQL error:", error);
      return NextResponse.json(
        { error: "Failed to fetch therapist profile" },
        { status: 500 }
      );
    }

    if (!data?.therapist_profiles_by_pk) {
      return NextResponse.json(
        { error: "Therapist not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data.therapist_profiles_by_pk);
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
