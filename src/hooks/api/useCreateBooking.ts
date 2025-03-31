// src/hooks/api/useCreateBooking.ts
import { gql, useMutation } from "@apollo/client";
import { useCallback } from "react";
import { Booking } from "@/types/booking";

type CreateBookingResponse = {
  insert_bookings: {
    returning: Booking[];
  };
};

type CreateBookingVariables = {
  guest_id: string;
  therapist_id: string;
  start_time: string;
  end_time: string;
};

const CREATE_BOOKING = gql`
  mutation CreateBooking(
    $guest_id: UUID!
    $therapist_id: UUID!
    $start_time: timestamptz!
    $end_time: timestamptz!
  ) {
    insert_bookings(
      objects: {
        guest_id: $guest_id
        therapist_id: $therapist_id
        start_time: $start_time
        end_time: $end_time
        status: "pending"
      }
    ) {
      returning {
        id
        guest_id
        therapist_id
        start_time
        end_time
        status
      }
    }
  }
`;

export const useCreateBooking = () => {
  const [createBookingMutation, { data, loading, error }] = useMutation<
    CreateBookingResponse,
    CreateBookingVariables
  >(CREATE_BOOKING);

  const create = useCallback(
    (
      guestId: string,
      therapistId: string,
      startTime: string,
      endTime: string,
    ) => {
      return createBookingMutation({
        variables: {
          guest_id: guestId,
          therapist_id: therapistId,
          start_time: startTime,
          end_time: endTime,
        },
      });
    },
    [createBookingMutation],
  );

  return {
    createBooking: create,
    booking: data?.insert_bookings?.returning,
    loading,
    error,
  };
};
