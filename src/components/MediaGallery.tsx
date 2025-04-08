// src/app/components/common/MediaGallery.tsx
import { cn } from '@/lib/utils';
import type { BaseMedia } from '@/types/base';
import type { Media } from '@/types/media';
import { PlayIcon } from 'lucide-react';
import React from 'react';
import MediaDisplay from './MediaDisplay';

/**
 * MediaGalleryコンポーネントのプロパティ
 */
interface MediaGalleryProps {
  media: (BaseMedia | Media)[];
  onMediaClick?: (media: BaseMedia | Media) => void;
}

/**
 * メディアギャラリーコンポーネント
 * 画像やビデオのグリッド表示を提供します
 */
export const MediaGallery: React.FC<MediaGalleryProps> = ({ media, onMediaClick }) => {
  // メディアが空の場合はプレースホルダーを表示
  if (!media || media.length === 0) {
    return (
      <div className={cn("flex items-center justify-center p-8 bg-gray-50 rounded-lg")}>
        <p className="text-gray-500">No media available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {media.map((item) => (
        <button
          key={item.id}
          onClick={() => onMediaClick?.(item)}
          className="w-full text-left"
        >
          <MediaDisplay
            src={item.url}
            type={item.type}
            caption={'caption' in item ? item.caption ?? null : null}
            media={item}
          />
          
          {item.type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity">
              <PlayIcon className="w-10 h-10 text-white" />
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

export default MediaGallery;