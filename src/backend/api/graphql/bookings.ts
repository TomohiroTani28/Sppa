// src/backend/api/graphql/bookings.ts
import { NextApiRequest, NextApiResponse } from 'next';
import hasuraClient from '@/lib/hasura-client';
import { gql } from '@apollo/client';

// GraphQL ミューテーション定義
const CREATE_BOOKING = gql`
  mutation CreateBooking($guestId: uuid!, $therapistId: uuid!, $startTime: timestamptz!, $endTime: timestamptz!) {
    insert_bookings(
      objects: { guest_id: $guestId, therapist_id: $therapistId, start_time: $startTime, end_time: $endTime, status: "pending" }
    ) {
      returning {
        id
        start_time
        end_time
        status
      }
    }
  }
`;

const UPDATE_BOOKING_STATUS = gql`
  mutation UpdateBookingStatus($bookingId: uuid!, $status: booking_status!) {
    update_bookings(
      where: { id: { _eq: $bookingId } }
      _set: { status: $status }
    ) {
      returning {
        id
        status
      }
    }
  }
`;

// 予約を作成する関数
export const createBooking = async (guestId: string, therapistId: string, startTime: string, endTime: string) => {
  const result = await hasuraClient.mutate({
    mutation: CREATE_BOOKING,
    variables: { guestId, therapistId, startTime, endTime },
  });
  return result.data.insert_bookings.returning;
};

// 予約のステータスを更新する関数
export const updateBookingStatus = async (bookingId: string, status: string) => {
  const result = await hasuraClient.mutate({
    mutation: UPDATE_BOOKING_STATUS,
    variables: { bookingId, status },
  });
  return result.data.update_bookings.returning;
};

// API ハンドラー
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'POST') {
      const { guestId, therapistId, startTime, endTime } = req.body;
      const booking = await createBooking(guestId, therapistId, startTime, endTime);
      res.status(200).json(booking);
    } else if (req.method === 'PUT') {
      const { bookingId, status } = req.body;
      const updatedBooking = await updateBookingStatus(bookingId, status);
      res.status(200).json(updatedBooking);
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ message: "Internal Server Error", error: errorMessage });
  }
};
