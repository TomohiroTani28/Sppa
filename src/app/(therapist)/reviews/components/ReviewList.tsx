// src/app/therapist/reviews/components/ReviewList.tsx
import React from "react";
import { Review } from "@/types/review";
import RatingStars from "@/components/RatingStars";

interface ReviewListProps {
  reviews: Review[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  return (
    <div className="my-4">
      <h2 className="text-lg font-semibold">Reviews</h2>
      {reviews.length === 0 ? (
        <p>まだレビューがありません。</p>
      ) : (
        reviews.map((review) => (
          <div key={review.id} className="border-b py-2">
            <div className="flex items-center">
              <RatingStars rating={review.rating} />
              <span className="ml-2 text-sm text-gray-500">
                {new Date(review.created_at).toLocaleDateString()}
              </span>
            </div>
            <p>{review.comment}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewList;
