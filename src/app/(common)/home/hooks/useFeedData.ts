// src/app/(common)/home/hooks/useFeedData.ts
import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { User } from "@/types/user";

const GET_FEED_DATA = gql`
  query GetFeedData {
    posts(order_by: { created_at: desc }, limit: 10) {
      id
      content
      post_type
      location
      created_at
      user {
        id
        name
        profile_picture
      }
    }
    events(
      where: { is_active: { _eq: true }, start_date: { _gte: "now()" } }
      order_by: { start_date: asc }
      limit: 5
    ) {
      id
      title
      description
      start_date
      end_date
      discount_percentage
    }
    reviews(order_by: { created_at: desc }, limit: 5) {
      id
      rating
      comment
      created_at
      guest_id
      therapist {
        id
        therapist_profiles {
          business_name
        }
      }
    }
  }
`;

interface Post {
  id: string;
  content: string;
  post_type: "service" | "review" | "question" | "general";
  location?: string;
  created_at: string;
  user: Pick<User, "id" | "name" | "profile_picture">;
}

interface Event {
  id: string;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  discount_percentage?: number;
}

interface Review {
  id: string;
  rating: number;
  comment?: string;
  created_at: string;
  guest_id: string;
  therapist: {
    id: string;
    therapist_profiles: {
      business_name?: string;
    };
  };
}

interface FeedData {
  posts: Post[];
  events: Event[];
  reviews: Review[];
}

export const useFeedData = () => {
  const { data, loading, error } = useQuery<FeedData>(GET_FEED_DATA, {
    fetchPolicy: "cache-and-network",
  });

  return {
    feedData: data || { posts: [], events: [], reviews: [] },
    isLoading: loading,
    error: error ? error.message : null,
  };
};