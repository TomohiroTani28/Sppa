// src/app/therapist/reviews/components/ReviewDetailModal.tsx
import React, { useState, useEffect } from "react";
import { useFetchReviews } from "@/app/hooks/api";
import RatingStars from "@/app/components/common/RatingStars";

interface ReviewDetailModalProps {
  reviewId: string;
  onClose: () => void;
}

const ReviewDetailModal: React.FC<ReviewDetailModalProps> = ({
  reviewId,
  onClose,
}) => {
  const [review, setReview] = useState<any>(null);
  const { reviews, loading, error } = useFetchReviews(reviewId);

  useEffect(() => {
    if (reviews.length > 0) {
      setReview(reviews[0]);
    }
  }, [reviews]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error.message}</div>; // ✅ 修正

  return (
    <div className="modal">
      <div className="modal-content">
        <button onClick={onClose}>Close</button>
        <h2>{review.guest_name}'s Review</h2>

        {/* ✅ `totalStars` が不要なら削除 */}
        <RatingStars rating={review.rating} />

        <p>{review.comment}</p>
        {review.media_urls?.length > 0 && (
          <div className="media-gallery">
            {/* ✅ `key` を `url` に変更 */}
            {review.media_urls.map((url: string) => (
              <img key={url} src={url} alt="Review media" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewDetailModal;
