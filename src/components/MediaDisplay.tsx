// src/components/common/MediaDisplay.tsx
import type { BaseMedia } from '@/types/base';
import type { Media } from '@/types/media';
import Image from "next/image";
import React, { useState } from "react";

interface MediaDisplayProps {
  src: string;
  type: 'audio' | 'video' | 'document' | 'photo';
  caption?: string | null;
  aspectRatio?: "square" | "16:9" | "4:3";
  onClick?: () => void;
  media: BaseMedia | Media;
}

const MediaDisplay: React.FC<MediaDisplayProps> = ({
  src,
  type,
  caption,
  aspectRatio = "square",
  onClick,
  media
}) => {
  const [isLoading, setIsLoading] = useState(true);
  
  // mediaオブジェクトから情報を取得
  const mediaType = media ? 
    ('media_type' in media ? media.media_type : media.type) : 
    type;
  
  const mediaCaption = media && 'caption' in media ? media.caption : caption;
  
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case "16:9":
        return "aspect-video";
      case "4:3":
        return "aspect-[4/3]";
      default:
        return "aspect-square";
    }
  };

  return (
    <div 
      className={`relative overflow-hidden rounded-lg ${getAspectRatioClass()}`}
      onClick={onClick}
    >
      {mediaType === 'photo' ? (
        <>
          <Image
            src={src}
            alt={mediaCaption || "Media"}
            fill
            className={`object-cover transition-opacity duration-300 ${
              isLoading ? "opacity-0" : "opacity-100"
            }`}
            onLoad={handleImageLoad}
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </>
      ) : mediaType === 'video' ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      ) : mediaType === 'audio' ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
            />
          </svg>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}
      
      {mediaCaption && (
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm">
          {mediaCaption}
        </div>
      )}
    </div>
  );
};

export default MediaDisplay;
