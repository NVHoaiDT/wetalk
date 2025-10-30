import { Upload } from 'lucide-react';
import { useCallback, useState } from 'react';

import { useUploadImages, useUploadVideos } from '@/lib/upload';
import { cn } from '@/utils/cn';

import { MediaPreview } from './media-preview';
import type { MediaFile, MediaUploaderProps } from './types';

export const MediaUploader = ({
  onChange,
  onError,
  maxFiles = 10,
  maxSize = 100 * 1024 * 1024,
  accept = { images: true, videos: true },
  value = [],
  className,
}: MediaUploaderProps) => {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const uploadImagesMutation = useUploadImages({
    mutationConfig: {
      onSuccess: (response) => {
        const urls = response.data.map((item) => item.url);
        setMediaFiles((prev) =>
          prev.map((file) =>
            file.type === 'image'
              ? { ...file, status: 'success' as const, url: urls.shift() }
              : file,
          ),
        );
        onChange([...value, ...urls]);
      },
      onError: (error) => {
        setMediaFiles((prev) =>
          prev.map((file) =>
            file.type === 'image'
              ? { ...file, status: 'error' as const, error: error.message }
              : file,
          ),
        );
        onError?.(error);
      },
    },
  });

  const uploadVideosMutation = useUploadVideos({
    mutationConfig: {
      onSuccess: (response) => {
        setMediaFiles((prev) =>
          prev.map((file) =>
            file.status === 'uploading' && file.type === 'video'
              ? { ...file, status: 'success' as const, url: response.data.url }
              : file,
          ),
        );
        onChange([...value, response.data.url]);
      },
      onError: (error) => {
        setMediaFiles((prev) =>
          prev.map((file) =>
            file.status === 'uploading' && file.type === 'video'
              ? { ...file, status: 'error' as const, error: error.message }
              : file,
          ),
        );
        onError?.(error);
      },
    },
  });

  const validateFile = useCallback(
    (file: File) => {
      if (file.size > maxSize) {
        throw new Error(
          `File size must be less than ${maxSize / 1024 / 1024}MB`,
        );
      }

      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');

      if (!isImage && !isVideo) {
        throw new Error('File must be an image or video');
      }

      if (isImage && !accept.images) {
        throw new Error('Images are not accepted');
      }

      if (isVideo && !accept.videos) {
        throw new Error('Videos are not accepted');
      }

      return true;
    },
    [accept.images, accept.videos, maxSize],
  );

  const handleFiles = useCallback(
    (files: File[]) => {
      const remainingSlots = maxFiles - mediaFiles.length;
      if (remainingSlots <= 0) {
        onError?.(new Error(`Maximum ${maxFiles} files allowed`));
        return;
      }

      const validFiles = files.slice(0, remainingSlots).filter((file) => {
        try {
          return validateFile(file);
        } catch (error) {
          onError?.(error as Error);
          return false;
        }
      });

      const newFiles = validFiles.map((file) => ({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
        type: file.type.startsWith('image/')
          ? ('image' as const)
          : ('video' as const),
        status: 'pending' as const,
      }));

      setMediaFiles((prev) => [...prev, ...newFiles]);

      // Start upload
      const images = newFiles
        .filter((f) => f.type === 'image')
        .map((f) => f.file);
      const videos = newFiles
        .filter((f) => f.type === 'video')
        .map((f) => f.file);

      if (images.length > 0) {
        uploadImagesMutation.mutate({
          data: {
            type: 'post',
            files: images,
          },
        });
      }

      if (videos.length > 0) {
        // Upload videos one by one
        videos.forEach((video) => {
          uploadVideosMutation.mutate({
            data: {
              files: [video],
            },
          });
        });
      }
    },
    [
      maxFiles,
      mediaFiles.length,
      uploadImagesMutation,
      uploadVideosMutation,
      validateFile,
    ],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    },
    [handleFiles],
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const files = Array.from(e.target.files);
        handleFiles(files);
      }
    },
    [handleFiles],
  );

  const handleRemove = useCallback((id: string) => {
    setMediaFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  return (
    <div className={className}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative rounded-lg border-2 border-dashed transition-all duration-200',
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/50',
        )}
      >
        <input
          type="file"
          id="media-upload"
          multiple
          accept={`${accept.images ? 'image/*,' : ''}${accept.videos ? 'video/*' : ''}`}
          onChange={handleFileSelect}
          className="hidden"
        />
        <label
          htmlFor="media-upload"
          className="flex cursor-pointer flex-col items-center justify-center py-12"
        >
          <Upload className="mb-3 size-10 text-gray-400" />
          <p className="mb-1 text-sm font-medium text-gray-700">
            Drag and Drop or click to upload
          </p>
          <p className="text-xs text-gray-500">
            {accept.images && accept.videos
              ? 'Images and videos supported'
              : accept.images
                ? 'Images supported'
                : 'Videos supported'}
          </p>
        </label>
      </div>

      {mediaFiles.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3">
          {mediaFiles.map((file) => (
            <MediaPreview
              key={file.id}
              file={file}
              onRemove={() => handleRemove(file.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
