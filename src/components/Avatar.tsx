// src/app/components/common/Avatar.tsx
import React from "react";
interface AvatarProps {
  imageUrl: string;
  alt: string;
  size: "sm" | "lg";
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ imageUrl, alt, size, className = "" }) => {
  const sizeClasses = size === "sm" ? "w-10 h-10" : "w-20 h-20";
  return (
    <img
      src={imageUrl}
      alt={alt}
      className={`${sizeClasses} rounded-full object-cover ${className}`}
    />
  );
};

export default Avatar;