// src/app/tourist/local-experiences/[experienceId]/components/MediaGallery.tsx
"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

interface MediaGalleryProps {
  images: string[];
}

const MediaGallery: React.FC<MediaGalleryProps> = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (images.length === 0) return null;

  return (
    <div
      className={`relative w-full ${isFullscreen ? "fixed inset-0 z-50 bg-black" : "rounded-lg overflow-hidden"}`}
    >
      {/* Main Image */}
      <div className="relative w-full aspect-video">
        <Image
          src={images[currentImageIndex]}
          alt={`Local experience image ${currentImageIndex + 1}`}
          fill
          priority
          className="object-cover"
        />

        {/* Navigation Controls */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/75"
              onClick={handlePrevImage}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/75"
              onClick={handleNextImage}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}

        {/* Fullscreen Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/50 hover:bg-white/75"
          onClick={toggleFullscreen}
        >
          <Maximize2 className="h-5 w-5" />
        </Button>
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex justify-center space-x-2 mt-2 p-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-16 h-16 relative border-2 rounded-md overflow-hidden 
                ${
                  index === currentImageIndex
                    ? "border-primary"
                    : "border-transparent opacity-50 hover:opacity-75"
                }`}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaGallery;
