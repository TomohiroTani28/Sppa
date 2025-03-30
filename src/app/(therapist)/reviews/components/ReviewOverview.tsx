// src/app/therapist/reviews/components/ReviewOverview.tsx
import React from "react";
import RatingStars from "../../../components/common/RatingStars";
import { useFetchReviews } from "../../../hooks/api/useFetchReviews";

interface Review {
  rating: number;
}

interface ReviewOverviewProps {
  therapistId: string;
}

const ReviewOverview: React.FC<ReviewOverviewProps> = ({ therapistId }) => {
  const { reviews, loading, error } = useFetchReviews(therapistId);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading reviews</div>;

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc: number, review: Review) => acc + review.rating, 0) / reviews.length
      : 0;

  return (
    <div className="p-4 border rounded-md">
      <h2 className="text-xl font-semibold">レビュー概要</h2>
      <div className="flex items-center space-x-2">
        <RatingStars rating={averageRating} maxRating={5} />
        <span>{averageRating.toFixed(1)} / 5</span>
      </div>
      <p>{reviews.length} 件のレビュー</p>
    </div>
  );
};

export default ReviewOverview;
