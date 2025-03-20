// src/app/lib/queries/user.ts
import { gql } from "@apollo/client";

export const GET_USER_PROFILE = gql`
  query GetUserProfile($user_id: uuid!) {
    api_users_by_pk(id: $user_id) {
      id
      name
      email
      profile_picture
      tourist_profile {
        nationality
        languages
        interests
        travel_dates
      }
    }
  }
`;

export const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile(
    $user_id: uuid!,
    $name: String!,
    $email: String!,
    $nationality: String!,
    $languages: [String!]!
  ) {
    update_api_users_by_pk(
      pk_columns: { id: $user_id },
      _set: { name: $name, email: $email }
    ) {
      id
    }
    update_api_tourist_profiles(
      where: { user_id: { _eq: $user_id } },
      _set: { nationality: $nationality, languages: $languages }
    ) {
      affected_rows
    }
  }
`;
