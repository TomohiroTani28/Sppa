// src/backend/api/graphql/events.ts
import { gql } from 'graphql-request';

const createEvent = gql`
  mutation CreateEvent(
    $therapistId: UUID!
    $title: String!
    $description: String!
    $startDate: timestamptz!
    $endDate: timestamptz!
    $discountPercentage: Float
  ) {
    insert_events(
      objects: {
        therapist_id: $therapistId
        title: $title
        description: $description
        start_date: $startDate
        end_date: $endDate
        discount_percentage: $discountPercentage
      }
    ) {
      returning {
        id
        title
        description
        start_date
        end_date
        discount_percentage
      }
    }
  }
`;

const getEventsByTherapistId = gql`
  query GetEventsByTherapistId($therapistId: UUID!) {
    events(where: { therapist_id: { _eq: $therapistId } }) {
      id
      title
      description
      start_date
      end_date
      discount_percentage
    }
  }
`;

export const createEventAPI = async (variables: any) => {
  const response = await fetch('/api/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: createEvent,
      variables,
    }),
  });
  return response.json();
};

export const getEventsByTherapistAPI = async (variables: any) => {
  const response = await fetch('/api/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: getEventsByTherapistId,
      variables,
    }),
  });
  return response.json();
};
