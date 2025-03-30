// src/app/api/events.ts
import { gql } from "@apollo/client";

// GET_EVENTS は、指定された therapistId に紐づくイベントを取得するための GraphQL クエリです。
// Hasura の自動生成 GraphQL API を前提としており、events テーブルの各種カラムを取得します。
export const GET_EVENTS = gql`
  query GetEvents($therapistId: uuid!) {
    events(where: { therapist_id: { _eq: $therapistId } }) {
      id
      title
      description
      start_date
      end_date
      discount_percentage
      promotion_code
      is_active
      created_at
      updated_at
    }
  }
`;
