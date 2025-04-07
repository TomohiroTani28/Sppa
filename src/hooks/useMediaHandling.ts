import supabase from '@/lib/supabase-client';
import type { BaseMedia } from '@/types/base';
import { useCallback, useEffect, useRef, useState } from 'react';

interface MediaHandlingOptions {
  maxSizeMB?: number;
  acceptedTypes?: string[];
  onError?: (error: string) => void;
  onProgress?: (progress: number) => void;
  onSuccess?: (media: BaseMedia) => void;
  bucketName?: string;
  folderPath?: string;
}

export const useMediaHandling = (options: MediaHandlingOptions = {}) => {
  const { 
    maxSizeMB = 5, 
    acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'], 
    onError,
    onProgress,
    onSuccess,
    bucketName = 'media',
    folderPath = 'uploads'
  } = options;
  
  const [media, setMedia] = useState<BaseMedia | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  // クリーンアップ関数
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const validateFile = useCallback((file: File): boolean => {
    if (!acceptedTypes.includes(file.type)) {
      onError?.(`Unsupported file type. Accepted types: ${acceptedTypes.join(', ')}`);
      return false;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      onError?.(`File size exceeds ${maxSizeMB}MB limit`);
      return false;
    }

    return true;
  }, [acceptedTypes, maxSizeMB, onError]);

  const handleMediaUpload = useCallback(async (file: File) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!validateFile(file)) return null;

      setUploadProgress(0);
      
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${folderPath}/${fileName}`;

      const tempUrl = URL.createObjectURL(file);
      
      // Create a temporary media object without thumbnailUrl for images
      const tempMedia: BaseMedia = {
        id: `temp-${Date.now()}`,
        url: tempUrl,
        type: file.type.startsWith('image/') ? 'photo' : 'video',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {
          size: file.size,
          format: file.type,
          filename: file.name
        }
      };
      
      // Add thumbnailUrl only for images
      if (file.type.startsWith('image/')) {
        tempMedia.thumbnailUrl = tempUrl;
      }
      
      setMedia(tempMedia);
      
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev >= 90 ? prev : prev + 10;
          onProgress?.(newProgress);
          if (prev >= 90) {
            clearInterval(progressInterval);
          }
          return newProgress;
        });
      }, 300);

      const { error: storageError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      clearInterval(progressInterval);
      
      if (storageError) throw storageError;

      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      if (!publicUrlData) throw new Error('Failed to get public URL');

      // Create a final media object without thumbnailUrl
      const finalMedia: BaseMedia = {
        id: `media-${Date.now()}`,
        url: publicUrlData.publicUrl,
        type: file.type.startsWith('image/') ? 'photo' : 'video',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {
          size: file.size,
          format: file.type,
          filename: file.name
        }
      };
      
      // Add thumbnailUrl only for images
      if (file.type.startsWith('image/')) {
        finalMedia.thumbnailUrl = publicUrlData.publicUrl;
      }

      URL.revokeObjectURL(tempUrl);
      
      setMedia(finalMedia);
      setUploadProgress(100);
      onProgress?.(100);
      onSuccess?.(finalMedia);
      
      return finalMedia;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [validateFile, onError, onSuccess, onProgress, bucketName, folderPath]);

  const removeMedia = useCallback(() => {
    if (media?.url) {
      // 一時的なURLの場合のみrevokeObjectURLを呼び出す
      if (media.url.startsWith('blob:')) {
        URL.revokeObjectURL(media.url);
      }
    }
    if (media?.thumbnailUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(media.thumbnailUrl);
    }
    setMedia(null);
  }, [media]);

  const cancelUpload = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setLoading(false);
    setUploadProgress(0);
  }, []);

  return {
    media,
    loading,
    error,
    uploadProgress,
    handleMediaUpload,
    removeMedia,
    cancelUpload,
  };
}; 