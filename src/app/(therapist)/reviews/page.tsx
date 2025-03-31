"use client";
// src/app/(therapist)/reviews/page.tsx
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import useRealtimeReviews from "@/realtime/useRealtimeReviews";
import ReviewList from "./components/ReviewList";
import ReviewOverview from "./components/ReviewOverview";
import TherapistLayout from "@/app/(common)/components/TouristLayout";

const ReviewsPage = () => {
  const searchParams = useSearchParams();
  const therapistId = searchParams.get("therapistId") as string;

  const { realtimeReviews, loading, error } = useRealtimeReviews(therapistId);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (realtimeReviews.length > 0) {
      setReviews(realtimeReviews);
    }
  }, [realtimeReviews]);

  if (!therapistId) {
    return <div>Error: Therapist ID is missing.</div>;
  }

  if (loading) {
    return <div>Loading reviews...</div>;
  }

  if (error) {
    return <div>Error loading reviews: {error.message}</div>;
  }

  return (
    <TherapistLayout>
      <div className="p-4">
        <h2 className="text-xl font-semibold">Reviews</h2>
        <ReviewOverview therapistId={therapistId} />
        <ReviewList reviews={reviews} />
      </div>
    </TherapistLayout>
  );
};

export default ReviewsPage;
