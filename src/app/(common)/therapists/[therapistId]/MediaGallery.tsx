// src/app/(common)/therapists/[therapistId]/MediaGallery.tsx
import React from "react";
import MediaDisplay from "@/components/MediaDisplay";
import type { BaseMedia } from "@/types/base";

interface MediaGalleryProps {
  media: BaseMedia[];
}

const MediaGallery: React.FC<MediaGalleryProps> = ({ media }) => {
  return (
    <div className="my-4">
      <h2 className="text-lg font-semibold">Gallery</h2>
      <div className="grid grid-cols-3 gap-4">
        {media.map((item) => (
          <MediaDisplay
            key={item.id}
            src={item.url}
            type={item.type}
            media={item}
          />
        ))}
      </div>
    </div>
  );
};

export default MediaGallery;
