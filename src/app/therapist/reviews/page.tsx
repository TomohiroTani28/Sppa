"use client";
// src/app/therapist/reviews/page.tsx
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"; // `useSearchParams` に変更
import useRealtimeReviews from "@/app/hooks/realtime/useRealtimeReviews";
import ReviewList from "./components/ReviewList";
import ReviewOverview from "./components/ReviewOverview";
import TherapistLayout from "@/app/therapist/components/TherapistLayout";

const ReviewsPage = () => {
  const searchParams = useSearchParams(); // 修正: `useRouter` を使わず `useSearchParams`
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
