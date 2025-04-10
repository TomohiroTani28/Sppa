// src/backend/api/graphql/therapists.ts
import { gql } from '@apollo/client';
import hasuraClient from '@/lib/hasura-client';

// TherapistProfile 型定義
type TherapistProfile = {
  user: {
    id: string;
    name: string;
    profile_picture: string | null;
    therapistProfile: {
      bio: string | null;
      experience_years: number | null;
      location: string | null;
      languages: string[];
      working_hours: any;
    } | null;
    average_rating: number | null;
    hourly_rate: number | null;
    services: Array<{
      id: string;
      service_name: string;
      description: string | null;
      duration: number | null;
      price: number;
      currency: string;
      category: string | null;
    }>;
    reviews: Array<{ id: string }>;
  };
};

// TherapistsQuery 型定義
type TherapistsQuery = { therapist_profiles: TherapistProfile[] };

// TherapistsQueryVariables 型定義（export を追加）
export type TherapistsQueryVariables = {
  location?: string;
  service?: string;
  language?: string;
  category?: string;
};

// GraphQL クエリ定義
const THERAPISTS_QUERY = gql`
  query Therapists($location: String, $service: String, $language: String, $category: String) {
    therapist_profiles(
      where: {
        location: { _ilike: $location }
        therapist_services: { service_name: { _ilike: $service }, category: { _eq: $category } }
        languages: { _contains: $language }
      }
    ) {
      id
      user {
        id
        name
        profile_picture
        therapistProfile {
          bio
          experience_years
          location
          languages
          working_hours
        }
        average_rating
        hourly_rate
        services: therapist_services {
          id
          service_name
          description
          duration
          price
          currency
          category
        }
        reviews: reviews_by_therapist_id {
          id
        }
      }
    }
  }
`;

// クエリ変数の準備（部分一致用にワイルドカードを追加）
const prepareVariables = (variables: TherapistsQueryVariables): TherapistsQueryVariables => ({
  location: variables.location ? `%${variables.location}%` : '%%',
  service: variables.service ? `%${variables.service}%` : '%%',
  language: variables.language || '',
  category: variables.category || '',
});

// Hasura から生のセラピストデータを取得
const fetchTherapistsData = async (variables: TherapistsQueryVariables) => {
  const client = await hasuraClient(); // ApolloClient インスタンスを取得
  const preparedVars = prepareVariables(variables);
  const { data } = await client.query<TherapistsQuery, TherapistsQueryVariables>({
    query: THERAPISTS_QUERY,
    variables: preparedVars,
  });

  if (!data?.therapist_profiles) {
    throw new Error('No therapist profiles found');
  }

  return data.therapist_profiles;
};

// 生データを所望の形式に変換
const transformTherapistData = (profile: TherapistProfile) => ({
  id: profile.user.id,
  name: profile.user.name,
  profile_picture: profile.user.profile_picture ?? '',
  bio: profile.user.therapistProfile?.bio ?? '',
  experience_years: profile.user.therapistProfile?.experience_years ?? 0,
  location: profile.user.therapistProfile?.location ?? '',
  languages: profile.user.therapistProfile?.languages ?? [],
  working_hours: profile.user.therapistProfile?.working_hours,
  average_rating: profile.user.average_rating ?? 0,
  hourly_rate: profile.user.hourly_rate ?? 0,
  services: profile.user.services ?? [],
  reviewCount: profile.user.reviews.length,
});

// セラピストデータを取得して変換するメイン関数
export const fetchTherapists = async (variables: TherapistsQueryVariables) => {
  const profiles = await fetchTherapistsData(variables);
  return profiles.map(transformTherapistData);
};