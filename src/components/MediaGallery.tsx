// src/app/components/common/MediaGallery.tsx
import React from 'react';
import Image from 'next/image';
import { cn } from '@/app/lib/utils';
import { Button } from '@/app/components/ui/Button';
import { PlayIcon } from 'lucide-react';
import { Media } from '@/types/media';

/**
 * MediaGalleryコンポーネントのプロパティ
 */
interface MediaGalleryProps {
  readonly mediaList: Media[];
  readonly className?: string;
}

/**
 * セラピストのメディア（写真や動画）をグリッド形式で表示するコンポーネント
 * @param {MediaGalleryProps} props - コンポーネントプロパティ
 * @returns {JSX.Element} メディアグリッド
 */
export function MediaGallery({ mediaList, className }: MediaGalleryProps): JSX.Element {
  // メディアが空の場合の表示
  if (!mediaList || mediaList.length === 0) {
    return (
      <div className={cn('text-center text-gray-500', className)}>
        No media available.
      </div>
    );
  }

  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4', className)}>
      {mediaList.map((media) => (
        <div key={media.id} className="relative aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
          {media.media_type === 'photo' ? (
            <Image
              src={media.url}
              alt={media.caption || 'Therapist media'}
              layout="fill"
              objectFit="cover"
              className="rounded-lg transition-transform hover:scale-105"
            />
          ) : (
            <div className="relative">
              <Image
                src={media.url} // 動画の場合はサムネイルURLを想定
                alt={media.caption || 'Video thumbnail'}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute inset-0 m-auto h-12 w-12 text-white bg-black bg-opacity-50 rounded-full"
                onClick={() => {
                  // TODO: 動画再生モーダルやプレーヤーを開く処理を実装
                  console.log(`Play video: ${media.url}`);
                }}
              >
                <PlayIcon className="h-6 w-6" />
              </Button>
            </div>
          )}
          {media.caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-sm p-2">
              {media.caption}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}