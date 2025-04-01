// src/graphql/queries.ts
import { gql } from '@apollo/client';

// セラピストプロフィール関連クエリ
export const GET_THERAPIST_PROFILE = gql`
  query GetTherapistProfile($id: UUID!) {
    therapist_profiles_by_pk(id: $id) {
      id
      user_id
      bio
      languages
      working_hours
      status
    }
  }
`;

// 通知関連クエリ
export const GET_NOTIFICATIONS = gql`
  query GetNotifications($userId: UUID!) {
    notifications(where: { user_id: { _eq: $userId } }, order_by: { created_at: desc }) {
      id
      type
      message
      details
      is_read
      created_at
    }
  }
`;

export const MARK_NOTIFICATION_AS_READ = gql`
  mutation MarkNotificationAsRead($id: UUID!) {
    update_notifications_by_pk(pk_columns: { id: $id }, _set: { is_read: true }) {
      id
      is_read
    }
  }
`;

/**
 * ユーザーに新しい通知が届いたときのサブスクリプション
 * 最新の通知を 1 件のみ取得したい場合は `limit: 1` を使っていますが、
 * 必要に応じて削除して「すべての通知」を購読することも可能です。
 */
export const ON_NEW_NOTIFICATION = gql`
  subscription OnNewNotification($userId: UUID!) {
    notifications(
      where: { user_id: { _eq: $userId } }
      order_by: { created_at: desc }
      limit: 1
    ) {
      id
      type
      message
      details
      is_read
      created_at
    }
  }
`;

// 予約関連クエリ
export const GET_MY_BOOKINGS = gql`
  query GetMyBookings($guestId: UUID!) {
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

export const CANCEL_BOOKING = gql`
  mutation CancelBooking($id: UUID!) {
    update_bookings_by_pk(
      pk_columns: { id: $id }
      _set: { status: "canceled", canceled_at: "now()" }
    ) {
      id
      status
      canceled_at
    }
  }
`;

export const ON_BOOKING_UPDATE = gql`
  subscription OnBookingUpdate($guestId: UUID!) {
    bookings(where: { guest_id: { _eq: $guestId } }, order_by: { updated_at: desc }) {
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
