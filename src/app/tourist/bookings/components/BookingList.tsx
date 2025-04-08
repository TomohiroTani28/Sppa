// src/app/tourist/bookings/components/BookingList.tsx
"use client";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { gql, useSubscription } from "@apollo/client";

const BOOKING_SUBSCRIPTION = gql`
  subscription MyBookings($guestId: uuid!) {
    bookings(where: { guest_id: { _eq: $guestId } }) {
      id
      start_time
      end_time
      status
      therapist {
        name
      }
    }
  }
`;

export default function BookingList({ guestId }: { guestId: string }) {
  const { data, loading } = useSubscription(BOOKING_SUBSCRIPTION, {
    variables: { guestId },
  });

  if (loading) return <p>Loading bookings...</p>;

  const bookings = data?.bookings || [];

  return (
    <div className="space-y-4">
      {bookings.map((booking: any) => (
        <Card key={booking.id} className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Therapist: {booking.therapist.name}</p>
              <p>
                {new Date(booking.start_time).toLocaleString()} -{" "}
                {new Date(booking.end_time).toLocaleTimeString()}
              </p>
            </div>
            <Badge
              variant={booking.status === "confirmed" ? "default" : "secondary"}
            >
              {booking.status}
            </Badge>
          </div>
        </Card>
      ))}
    </div>
  );
}
