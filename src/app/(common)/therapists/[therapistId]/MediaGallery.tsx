// src/app/(common)/therapists/[therapistId]/MediaGallery.tsx
import React from "react";
import { MediaDisplay } from "@/components/MediaDisplay";

interface MediaGalleryProps {
  media: string[]; // URLs of media (photos/videos)
}

const MediaGallery: React.FC<MediaGalleryProps> = ({ media }) => {
  return (
    <div className="my-4">
      <h2 className="text-lg font-semibold">Gallery</h2>
      <div className="grid grid-cols-3 gap-4">
        {media.map((url, index) => (
          <MediaDisplay key={index} src={url} />
        ))}
      </div>
    </div>
  );
};

export default MediaGallery;