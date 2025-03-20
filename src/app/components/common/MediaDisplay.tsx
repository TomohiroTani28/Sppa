// src/components/common/MediaDisplay.tsx
import React, { useState } from "react";
import Image from "next/image";

interface MediaDisplayProps {
  src: string;
  caption?: string;
  aspectRatio?: "square" | "16:9" | "4:3";
  onClick?: () => void;
}

export const MediaDisplay: React.FC<MediaDisplayProps> = ({
  src,
  caption,
  aspectRatio = "square",
  onClick,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // メディアの種類を判定（拡張子をチェック）
  const isVideo = src.match(/\.(mp4|webm|ogg)$/i);

  // アスペクト比に応じたクラスを設定
  const containerClasses = {
    square: "aspect-square",
    "16:9": "aspect-video",
    "4:3": "aspect-[4/3]",
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setError(true);
  };

  return (
    <div className="overflow-hidden rounded-lg group">
      <div
        className={`relative ${containerClasses[aspectRatio]} bg-gray-100 overflow-hidden cursor-pointer`}
        onClick={onClick}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse w-full h-full bg-gray-200"></div>
          </div>
        )}

        {error ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
            <span>Unable to load media</span>
          </div>
        ) : isVideo ? (
          <video
            src={src}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            controls={false}
            muted
            loop
            playsInline
            onLoadedData={handleLoad}
            onError={handleError}
          />
        ) : (
          <Image
            src={src}
            alt={caption || "Media content"}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onLoad={handleLoad}
            onError={handleError}
          />
        )}

        {/* ビデオのオーバーレイアイコン */}
        {isVideo && (
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="rounded-full bg-white bg-opacity-75 p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-gray-800"
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
          </div>
        )}
      </div>

      {caption && (
        <div className="mt-1 px-1 text-sm text-gray-600 truncate">
          {caption}
        </div>
      )}
    </div>
  );
};
