// src/app/api/trends/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { verifyToken } from "@/utils/auth";
import { TherapistProfile } from "@/types/therapist";
import { gql } from "@apollo/client";

async function authenticateUser(token: string) {
  const user = await verifyToken(token);
  return user?.id && user?.role ? user : null;
}

async function fetchTrends(client: any): Promise<TherapistProfile[]> {
  const query = gql`
    query GetTrendingTherapists {
      therapist_profiles(
        order_by: { bookings_aggregate: { count: desc } }
        limit: 10
      ) {
        id
        user {
          id
          name
          profile_picture
        }
        bio
        location
        languages
        price_range_min
        price_range_max
        currency
        status
        average_rating: bookings_aggregate {
          aggregate {
            avg {
              rating
            }
          }
        }
        booking_count: bookings_aggregate {
          aggregate {
            count
          }
        }
      }
    }
  `;
  const response = await client.query({ query });
  return response.data.therapist_profiles;
}

function formatTrends(trends: TherapistProfile[]) {
  return trends.map((therapist) => ({
    id: therapist.id,
    name: therapist.user.name,
    profilePicture: therapist.user.profile_picture,
    bio: therapist.bio,
    location: therapist.location,
    languages: therapist.languages,
    priceRange: {
      min: therapist.price_range_min,
      max: therapist.price_range_max,
      currency: therapist.currency,
    },
    status: therapist.status,
    averageRating: therapist.average_rating?.aggregate?.avg?.rating ?? 0,
    bookingCount: therapist.booking_count?.aggregate?.count ?? 0,
  }));
}

export async function GET(request: NextRequest) {
  const token = request.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await authenticateUser(token);
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const httpLink = createHttpLink({
      uri: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT ?? "http://localhost:8081/v1/graphql", // 修正
    });

    const authLink = setContext((_, { headers }) => {
      return {
        headers: {
          ...headers,
          authorization: `Bearer ${token}`,
          "x-hasura-role": user.role,
          "x-hasura-user-id": user.id,
        },
      };
    });

    const client = new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
    });

    const trends = await fetchTrends(client);
    const formattedTrends = formatTrends(trends);

    return NextResponse.json(formattedTrends, { status: 200 });
  } catch (error) {
    console.error("Error fetching trends:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const runtime = "edge";