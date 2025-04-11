'use server';
// src/actions/feed-actions.ts
import { graphqlClient } from "@/lib/graphql-client";
import { gql } from "@apollo/client";

// フィードの初期データを取得
export async function getInitialFeedData(role = 'tourist') {
  try {
    const { data } = await graphqlClient.query({
      query: gql`
        query GetInitialFeedData($role: String!) {
          posts(
            where: { user: { role: { _eq: $role } } }
            order_by: { created_at: desc }
            limit: 20
          ) {
            id
            user_id
            content
            post_type
            location
            created_at
            updated_at
            media {
              url
              media_type
            }
            user {
              id
              name
              profile_picture
              role
            }
          }
        }
      `,
      variables: { role },
      fetchPolicy: 'network-only',
    });
    
    return data.posts;
  } catch (error) {
    console.error('[Feed] Error fetching initial data:', error);
    return [];
  }
} 