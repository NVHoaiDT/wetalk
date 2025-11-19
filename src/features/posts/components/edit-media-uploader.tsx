import { X, Upload, Loader2, Image as ImageIcon, Video } from 'lucide-react';
import { useState } from 'react';

import { useNotifications } from '@/components/ui/notifications';
import { useUploadImages, useUploadVideos } from '@/lib/upload';
import { cn } from '@/utils/cn';

type EditMediaUploaderProps = {
  value: string[];
  onChange: (urls: string[]) => void;
  onUploadStateChange?: (isUploading: boolean) => void;
  maxFiles?: number;
};

type PendingFile = {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video';
  status: 'uploading' | 'success' | 'error';
  error?: string;
};

export const EditMediaUploader = ({
  value,
  onChange,
  onUploadStateChange,
  maxFiles = 10,
}: EditMediaUploaderProps) => {
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const { addNotification } = useNotifications();

  const uploadImagesMutation = useUploadImages({
    mutationConfig: {
      onSuccess: (response) => {
        const uploadedUrls = response.data.map((item) => item.url);

        setPendingFiles((prev) =>
          prev.map((file) =>
            file.type === 'image' && file.status === 'uploading'
              ? { ...file, status: 'success' as const }
              : file,
          ),
        );

        // Add uploaded URLs to the form value
        onChange([...value, ...uploadedUrls]);
        onUploadStateChange?.(false);

        // Clear pending files after successful upload
        setTimeout(() => {
          setPendingFiles((prev) => prev.filter((f) => f.status !== 'success'));
        }, 1000);
      },
      onError: (error) => {
        setPendingFiles((prev) =>
          prev.map((file) =>
            file.type === 'image' && file.status === 'uploading'
              ? {
                  ...file,
                  status: 'error' as const,
                  error: error.message,
                }
              : file,
          ),
        );
        onUploadStateChange?.(false);
      },
    },
  });

  const uploadVideosMutation = useUploadVideos({
    mutationConfig: {
      onSuccess: (response) => {
        setPendingFiles((prev) =>
          prev.map((file) =>
            file.type === 'video' && file.status === 'uploading'
              ? { ...file, status: 'success' as const }
              : file,
          ),
        );

        // Add uploaded URL to the form value
        onChange([...value, response.data.url]);
        onUploadStateChange?.(false);

        // Clear pending files after successful upload
        setTimeout(() => {
          setPendingFiles((prev) => prev.filter((f) => f.status !== 'success'));
        }, 1000);
      },
      onError: (error) => {
        setPendingFiles((prev) =>
          prev.map((file) =>
            file.type === 'video' && file.status === 'uploading'
              ? {
                  ...file,
                  status: 'error' as const,
                  error: error.message,
                }
              : file,
          ),
        );
        onUploadStateChange?.(false);
      },
    },
  });

  const handleFiles = (files: File[]) => {
    const currentTotal = value.length + pendingFiles.length;
    const remainingSlots = maxFiles - currentTotal;

    if (remainingSlots <= 0) {
      addNotification({
        type: 'error',
        title: 'Upload Error',
        message: `Maximum ${maxFiles} files allowed`,
      });
      return;
    }

    const validFiles = files.slice(0, remainingSlots);
    const newPendingFiles: PendingFile[] = validFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith('image/')
        ? ('image' as const)
        : ('video' as const),
      status: 'uploading' as const,
    }));

    setPendingFiles((prev) => [...prev, ...newPendingFiles]);

    const images = newPendingFiles
      .filter((f) => f.type === 'image')
      .map((f) => f.file);
    const videos = newPendingFiles
      .filter((f) => f.type === 'video')
      .map((f) => f.file);

    if (images.length > 0 || videos.length > 0) {
      onUploadStateChange?.(true);
    }

    if (images.length > 0) {
      uploadImagesMutation.mutate({
        data: {
          type: 'post',
          files: images,
        },
      });
    }

    if (videos.length > 0) {
      videos.forEach((video) => {
        uploadVideosMutation.mutate({
          data: {
            files: [video],
          },
        });
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleRemoveExisting = (urlToRemove: string) => {
    onChange(value.filter((url) => url !== urlToRemove));
  };

  const handleRemovePending = (id: string) => {
    setPendingFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const isImage = (url: string) =>
    url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) || !url.startsWith('videos/');
  const isVideo = (url: string) => url.startsWith('videos/');

  return (
    <div className="space-y-4">
      {/* Existing Media */}
      {value.length > 0 && (
        <div>
          <div className="mb-2 block text-sm font-medium text-gray-700">
            Current Media ({value.length})
          </div>
          <div className="grid grid-cols-3 gap-3">
            {value.map((url) => (
              <div
                key={url}
                className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-100"
              >
                {isImage(url) ? (
                  <>
                    <ImageIcon className="absolute left-2 top-2 z-10 size-4 text-white drop-shadow" />
                    <img
                      src={url}
                      alt="Uploaded media"
                      className="h-24 w-full object-cover"
                    />
                  </>
                ) : (
                  <>
                    <Video className="absolute left-2 top-2 z-10 size-4 text-white drop-shadow" />
                    <video className="h-24 w-full object-cover">
                      <source src={url} />
                      <track kind="captions" />
                    </video>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveExisting(url)}
                  className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending Uploads */}
      {pendingFiles.length > 0 && (
        <div>
          <div className="mb-2 block text-sm font-medium text-gray-700">
            Uploading...
          </div>
          <div className="grid grid-cols-3 gap-3">
            {pendingFiles.map((file) => (
              <div
                key={file.id}
                className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-100"
              >
                {file.type === 'image' ? (
                  <>
                    <ImageIcon className="absolute left-2 top-2 z-10 size-4 text-white drop-shadow" />
                    <img
                      src={file.preview}
                      alt="Uploading"
                      className="h-24 w-full object-cover"
                    />
                  </>
                ) : (
                  <>
                    <Video className="absolute left-2 top-2 z-10 size-4 text-white drop-shadow" />
                    <video className="h-24 w-full object-cover">
                      <source src={file.preview} />
                      <track kind="captions" />
                    </video>
                  </>
                )}

                {file.status === 'uploading' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <Loader2 className="size-6 animate-spin text-white" />
                  </div>
                )}

                {file.status === 'error' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-500/50">
                    <span className="text-xs text-white">Error</span>
                  </div>
                )}

                {file.status !== 'uploading' && (
                  <button
                    type="button"
                    onClick={() => handleRemovePending(file.id)}
                    className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Area */}
      {value.length + pendingFiles.length < maxFiles && (
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
            id="media-upload-edit"
            multiple
            accept="image/*,video/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <label
            htmlFor="media-upload-edit"
            className="flex cursor-pointer flex-col items-center justify-center py-12"
          >
            <Upload className="mb-3 size-10 text-gray-400" />
            <p className="mb-1 text-sm font-medium text-gray-700">
              Drag and Drop or click to upload
            </p>
            <p className="text-xs text-gray-500">
              Images and videos supported ({value.length + pendingFiles.length}/
              {maxFiles})
            </p>
          </label>
        </div>
      )}
    </div>
  );
};
