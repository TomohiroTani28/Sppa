// src/app/(common)/therapists/[therapistId]/ReviewList.tsx
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
      {reviews.map((review, index) => (
        <div key={index} className="border-b py-2">
          <RatingStars rating={review.rating} />
          <p>{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;