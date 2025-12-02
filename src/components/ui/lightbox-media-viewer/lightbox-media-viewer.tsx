import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { cn } from '@/utils/cn';

type LightboxMediaViewerProps = {
  isOpen: boolean;
  onClose: () => void;
  media: string | string[];
  initialIndex?: number;
  className?: string;
};

export const LightboxMediaViewer = ({
  isOpen,
  onClose,
  media,
  initialIndex = 0,
  className,
}: LightboxMediaViewerProps) => {
  const mediaArray = Array.isArray(media) ? media : [media];
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Reset index when media changes or lightbox opens
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when lightbox is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Navigate with arrow keys
  useEffect(() => {
    const handleArrowKeys = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevMedia();
      } else if (e.key === 'ArrowRight') {
        nextMedia();
      }
    };

    if (isOpen && mediaArray.length > 1) {
      document.addEventListener('keydown', handleArrowKeys);
    }

    return () => {
      document.removeEventListener('keydown', handleArrowKeys);
    };
  }, [isOpen, currentIndex, mediaArray.length]);

  const nextMedia = () => {
    setCurrentIndex((prev) => (prev + 1) % mediaArray.length);
  };

  const prevMedia = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + mediaArray.length) % mediaArray.length,
    );
  };

  const isVideo = (url: string) => {
    return url.includes('videos/') || url.endsWith('.mp4');
  };

  if (!isOpen) return null;

  return (
    <button
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm',
        className,
      )}
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition-all hover:scale-110 hover:bg-white/20"
        aria-label="Close lightbox"
      >
        <X className="size-6" />
      </button>

      {/* Media Counter */}
      {mediaArray.length > 1 && (
        <div className="absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full bg-black/70 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
          {currentIndex + 1} / {mediaArray.length}
        </div>
      )}

      {/* Navigation Buttons */}
      {mediaArray.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevMedia();
            }}
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-all hover:scale-110 hover:bg-white/20"
            aria-label="Previous media"
          >
            <ChevronLeft className="size-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextMedia();
            }}
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-all hover:scale-110 hover:bg-white/20"
            aria-label="Next media"
          >
            <ChevronRight className="size-6" />
          </button>
        </>
      )}

      {/* Media Content */}
      <button
        className="max-h-[90vh] max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        {isVideo(mediaArray[currentIndex]) ? (
          <video
            src={mediaArray[currentIndex]}
            controls
            className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-2xl"
            autoPlay
          >
            <track kind="captions" />
          </video>
        ) : (
          <img
            src={mediaArray[currentIndex]}
            alt={`Media ${currentIndex + 1}`}
            className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
          />
        )}
      </button>
    </button>
  );
};
