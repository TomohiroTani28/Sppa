import { gql } from '@apollo/client';

// ユーザーデータフラグメント
export const USER_FIELDS = gql`
  fragment UserFields on users {
    id
    name
    email
    profile_picture
    role
    created_at
    updated_at
  }
`;

// 投稿データフラグメント
export const POST_FIELDS = gql`
  fragment PostFields on posts {
    id
    user_id
    content
    post_type
    location
    created_at
    updated_at
    media {
      id
      url
      media_type
    }
    user {
      ...UserFields
    }
  }
  ${USER_FIELDS}
`;

// セラピストプロフィールフラグメント
export const THERAPIST_PROFILE_FIELDS = gql`
  fragment TherapistProfileFields on therapist_profiles {
    id
    user_id
    bio
    experience_years
    location
    languages
    certifications
    working_hours
    status
    last_online_at
    price_range_min
    price_range_max
    currency
    business_name
  }
`; 