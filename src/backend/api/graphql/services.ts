// src/api/services.ts
import { gql } from '@apollo/client';
import hasuraClient from '@/app/lib/hasura-client';

// 施術メニューの作成
export const createService = async (
  therapistId: string,
  serviceName: string,
  description: string,
  duration: number,
  price: number,
  currency: string
) => {
  const CREATE_SERVICE = gql`
    mutation CreateService(
      $therapistId: uuid!,
      $serviceName: String!,
      $description: String,
      $duration: Int!,
      $price: numeric!,
      $currency: String!
    ) {
      insert_therapist_services(
        objects: {
          therapist_id: $therapistId,
          service_name: $serviceName,
          description: $description,
          duration: $duration,
          price: $price,
          currency: $currency
        }
      ) {
        returning {
          id
          service_name
          description
          duration
          price
          currency
        }
      }
    }
  `;

  const result = await hasuraClient.mutate({
    mutation: CREATE_SERVICE,
    variables: { therapistId, serviceName, description, duration, price, currency },
  });

  return result.data.insert_therapist_services.returning[0];
};

// セラピストの施術メニューを取得
export const getServices = async (therapistId: string) => {
  const GET_SERVICES = gql`
    query GetServices($therapistId: uuid!) {
      therapist_services(where: { therapist_id: { _eq: $therapistId } }) {
        id
        service_name
        description
        duration
        price
        currency
      }
    }
  `;

  const result = await hasuraClient.query({
    query: GET_SERVICES,
    variables: { therapistId },
  });

  return result.data.therapist_services;
};
