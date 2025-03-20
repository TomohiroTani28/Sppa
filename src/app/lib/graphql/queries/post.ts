// src/app/lib/graphql/queries/post.ts
import { gql } from '@apollo/client';

export const GET_POSTS = gql`
  query GetPosts($limit: Int = 20, $offset: Int = 0) {
    posts(order_by: { created_at: desc }, limit: $limit, offset: $offset) {
      id
      user_id
      content
      post_type
      location
      created_at
      media {
        url
        media_type
      }
      user {
        name
        profile_picture
        role
      }
    }
  }
`;

export const ON_NEW_POSTS = gql`
  subscription OnNewPosts {
    posts(order_by: { created_at: desc }, limit: 10) {
      id
      user_id
      content
      post_type
      media {
        url
        media_type
      }
    }
  }
`;