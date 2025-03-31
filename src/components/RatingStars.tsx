// src/components/RatingStars.tsx
import React from "react";

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  color?: "gold" | "blue" | "red" | "green" | "purple";
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxRating = 5,
  size = "md",
  color = "gold",
  interactive = false,
  onChange,
}) => {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const colorClasses = {
    gold: "text-yellow-400",
    blue: "text-blue-500",
    red: "text-red-500",
    green: "text-green-500",
    purple: "text-purple-500",
  };

  const interactiveClass = interactive
    ? "cursor-pointer hover:scale-110 transition-transform"
    : "";

  const stars = Array.from({ length: maxRating }, (_, i) => {
    const starValue = i + 1;
    const isFilled = starValue <= rating;
    return { value: starValue, isFilled };
  });

  const handleClick = (starValue: number) => {
    if (interactive && onChange) onChange(starValue);
  };

  return (
    <div className="flex items-center">
      {stars.map((star) => (
        <div
          key={star.value}
          className={`${interactiveClass}`}
          onClick={() => handleClick(star.value)}
          title={star.value.toString()}
        >
          {star.isFilled ? (
            <svg
              className={`${sizeClasses[size]} ${colorClasses[color]} fill-current`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          ) : (
            <svg
              className={`${sizeClasses[size]} text-gray-300 fill-current`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
};

export default RatingStars;
