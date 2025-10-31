import { useState } from 'react';

type MediaViewerProps = {
  mediaUrls: string[];
  title: string;
  className?: string;
};

export const MediaViewer = ({
  mediaUrls,
  title,
  className = '',
}: MediaViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!mediaUrls.length) return null;

  return (
    <div className={`group/carousel relative ${className}`}>
      <div className="overflow-hidden rounded-lg">
        {mediaUrls[currentIndex].endsWith('.mp4') ? (
          <video
            src={mediaUrls[currentIndex]}
            controls
            className="h-[480px] w-full bg-black/5 object-contain"
            preload="metadata"
          >
            <track
              kind="captions"
              src="/captions/example.vtt"
              srcLang="en"
              label="English"
              default
            />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src={mediaUrls[currentIndex]}
            alt={title}
            className="h-[480px] w-full bg-black/5 object-contain transition-transform duration-300 group-hover:scale-[1.02]"
          />
        )}
      </div>

      {/* Image counter */}
      {mediaUrls.length > 1 && (
        <div className="absolute right-3 top-3 rounded-full bg-black/70 px-2 py-1 text-xs font-medium text-white">
          {currentIndex + 1} / {mediaUrls.length}
        </div>
      )}

      {/* Navigation buttons */}
      {mediaUrls.length > 1 && (
        <>
          {/* Previous button */}
          {currentIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex((prev) => prev - 1);
              }}
              className="absolute left-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 opacity-0 shadow-lg transition-opacity duration-200 hover:bg-white group-hover/carousel:opacity-100"
            >
              <svg
                className="size-5 text-gray-800"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {/* Next button */}
          {currentIndex < mediaUrls.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex((prev) => prev + 1);
              }}
              className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 opacity-0 shadow-lg transition-opacity duration-200 hover:bg-white group-hover/carousel:opacity-100"
            >
              <svg
                className="size-5 text-gray-800"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </>
      )}

      {/* Dot indicators */}
      {mediaUrls.length > 1 && (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {mediaUrls.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              className={`size-1.5 rounded-full transition-all duration-200 ${
                idx === currentIndex
                  ? 'w-4 bg-white'
                  : 'bg-white/60 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
