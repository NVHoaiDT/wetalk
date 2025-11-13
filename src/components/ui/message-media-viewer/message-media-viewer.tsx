import { X } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/utils/cn';

type MessageMediaViewerProps = {
  attachments: string[];
  className?: string;
};

export const MessageMediaViewer = ({
  attachments,
  className = '',
}: MessageMediaViewerProps) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!attachments.length) return null;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextMedia = () => {
    setLightboxIndex((prev) => (prev + 1) % attachments.length);
  };

  const prevMedia = () => {
    setLightboxIndex(
      (prev) => (prev - 1 + attachments.length) % attachments.length,
    );
  };

  return (
    <>
      {/* Inline Media Grid */}
      <div
        className={cn(
          'mt-2 grid gap-1',
          attachments.length === 1
            ? 'grid-cols-1'
            : attachments.length === 2
              ? 'grid-cols-2'
              : attachments.length === 3
                ? 'grid-cols-3'
                : 'grid-cols-2',
          className,
        )}
      >
        {attachments.slice(0, 4).map((url, index) => {
          const isVideo = url.includes('videos/') || url.endsWith('.mp4');
          const isLastItem = index === 3 && attachments.length > 4;
          const remainingCount = attachments.length - 4;

          return (
            <div
              key={url}
              onClick={() => openLightbox(index)}
              className={cn(
                'relative cursor-pointer overflow-hidden rounded-lg',
                attachments.length === 1 ? 'max-w-sm' : 'aspect-square',
              )}
            >
              {isVideo ? (
                <video
                  src={url}
                  className="size-full object-cover transition-opacity hover:opacity-90"
                  preload="metadata"
                />
              ) : (
                <img
                  src={url}
                  alt={`Attachment ${index + 1}`}
                  className="size-full object-cover transition-opacity hover:opacity-90"
                />
              )}

              {/* Overlay for additional items */}
              {isLastItem && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                  <span className="text-2xl font-bold text-white">
                    +{remainingCount}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
          >
            <X className="size-6" />
          </button>

          {/* Media Counter */}
          {attachments.length > 1 && (
            <div className="absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full bg-black/70 px-3 py-1 text-sm font-medium text-white">
              {lightboxIndex + 1} / {attachments.length}
            </div>
          )}

          {/* Navigation Buttons */}
          {attachments.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevMedia();
                }}
                className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
              >
                <svg
                  className="size-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextMedia();
                }}
                className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
              >
                <svg
                  className="size-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}

          {/* Media Content */}
          <div
            className="max-h-[90vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            {attachments[lightboxIndex].includes('videos/') ||
            attachments[lightboxIndex].endsWith('.mp4') ? (
              <video
                src={attachments[lightboxIndex]}
                controls
                className="max-h-[90vh] max-w-[90vw] rounded-lg"
                autoPlay
              >
                <track kind="captions" />
              </video>
            ) : (
              <img
                src={attachments[lightboxIndex]}
                alt={`Attachment ${lightboxIndex + 1}`}
                className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};
