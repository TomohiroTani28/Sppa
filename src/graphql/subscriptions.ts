// src/graphql/subscriptions.ts
import { gql } from '@apollo/client';

// セラピストプロフィール関連サブスクリプション
export const ON_THERAPIST_PROFILE_UPDATE = gql`
  subscription OnTherapistProfileUpdate($therapistId: UUID!) {
    therapist_profiles(where: { id: { _eq: $therapistId } }) {
      id
      user_id
      bio
      languages
      working_hours
      status
    }
  }
`;

// 通知関連サブスクリプション
export const ON_NEW_NOTIFICATION = gql`
  subscription OnNewNotification($userId: UUID!) {
    notifications(where: { user_id: { _eq: $userId } }, order_by: { created_at: desc }, limit: 1) {
      id
      type
      message
      details
      is_read
      created_at
    }
  }
`;

// 予約関連サブスクリプション
export const ON_BOOKING_UPDATE = gql`
  subscription OnBookingUpdate($guestId: UUID!) {
    bookings(where: { guest_id: { _eq: $guestId } }, order_by: { start_time: desc }) {
      id
      therapist_id
      service_id
      start_time
      end_time
      status
      booking_notes
      confirmed_at
      canceled_at
      completed_at
      created_at
      updated_at
    }
  }
`;