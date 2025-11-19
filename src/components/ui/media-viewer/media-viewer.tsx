import {
  MediaController,
  MediaControlBar,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaVolumeRange,
  MediaPlaybackRateButton,
  MediaPlayButton,
  MediaSeekBackwardButton,
  MediaSeekForwardButton,
  MediaMuteButton,
  MediaFullscreenButton,
} from 'media-chrome/react';
import { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';

type MediaViewerProps = {
  mediaUrls: string[];
  title: string;
  className?: string;
};

type VideoQuality = '360p' | '480p' | '720p' | '1080p' | 'auto';

const QUALITY_TRANSFORMATIONS: Record<VideoQuality, string> = {
  '360p': 'q_auto,f_auto,h_360,br_500k',
  '480p': 'q_auto,f_auto,h_480,br_1000k',
  '720p': 'q_auto,f_auto,h_720,br_2000k',
  '1080p': 'q_auto,f_auto,h_1080,br_3500k',
  auto: 'q_auto,f_auto',
};

export const MediaViewer = ({
  mediaUrls,
  title,
  className = '',
}: MediaViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videoQuality, setVideoQuality] = useState<VideoQuality>('auto');
  const [showQualityMenu, setShowQualityMenu] = useState(false);

  // Reset currentIndex if it's out of bounds when mediaUrls changes
  useEffect(() => {
    if (currentIndex >= mediaUrls.length && mediaUrls.length > 0) {
      setCurrentIndex(0);
    }
  }, [mediaUrls.length, currentIndex]);

  if (!mediaUrls.length) return null;

  const currentMedia = mediaUrls[currentIndex];

  // Guard against undefined currentMedia
  if (!currentMedia) return null;

  const getVideoUrl = (publicId: string, quality: VideoQuality) => {
    const transformation = QUALITY_TRANSFORMATIONS[quality];
    return `https://res.cloudinary.com/dd2dhsems/video/upload/${transformation}/${publicId}`;
  };

  return (
    <div className={`group/carousel relative ${className}`}>
      <div className="overflow-hidden rounded-lg">
        {currentMedia.startsWith('videos/') ? (
          <MediaController
            style={{
              width: '100%',
              aspectRatio: '16/9',
            }}
            className="rounded-lg"
          >
            <ReactPlayer
              slot="media"
              key={`${currentMedia}-${videoQuality}`}
              src={getVideoUrl(currentMedia, videoQuality)}
              controls={false}
              className="rounded-lg object-contain"
              style={{
                width: '100%',
                height: '480px',
              }}
            />
            <MediaControlBar>
              <MediaPlayButton />
              <MediaSeekBackwardButton seekOffset={10} />
              <MediaSeekForwardButton seekOffset={10} />
              <MediaTimeRange />
              <MediaTimeDisplay showDuration />
              <MediaMuteButton />
              <MediaVolumeRange />
              <MediaPlaybackRateButton />
              <MediaFullscreenButton />
            </MediaControlBar>
          </MediaController>
        ) : (
          <img
            src={currentMedia}
            alt={title}
            className="h-[480px] w-full bg-black/5 object-contain transition-transform duration-300 group-hover:scale-[1.02]"
          />
        )}
      </div>

      {/* Media counter */}
      {mediaUrls.length > 1 && (
        <div className="absolute right-3 top-3 rounded-full bg-black/70 px-2 py-1 text-xs font-medium text-white">
          {currentIndex + 1} / {mediaUrls.length}
        </div>
      )}

      {/* Quality selector for videos */}
      {currentMedia.startsWith('videos/') && (
        <div className="absolute left-3 top-3">
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowQualityMenu(!showQualityMenu);
              }}
              className="flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-black/80"
            >
              <svg
                className="size-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="uppercase">{videoQuality}</span>
              <svg
                className={`size-3 transition-transform ${showQualityMenu ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Quality menu dropdown */}
            {showQualityMenu && (
              <div className="absolute left-0 top-full z-10 mt-1 min-w-[120px] overflow-hidden rounded-lg bg-black/90 shadow-lg">
                {(Object.keys(QUALITY_TRANSFORMATIONS) as VideoQuality[]).map(
                  (quality) => (
                    <button
                      key={quality}
                      onClick={(e) => {
                        e.stopPropagation();
                        setVideoQuality(quality);
                        setShowQualityMenu(false);
                      }}
                      className={`block w-full px-4 py-2 text-left text-xs font-medium transition-colors hover:bg-white/10 ${
                        videoQuality === quality
                          ? 'bg-white/20 text-white'
                          : 'text-white/80'
                      }`}
                    >
                      <span className="uppercase">{quality}</span>
                      {videoQuality === quality && (
                        <svg
                          className="ml-2 inline size-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                  ),
                )}
              </div>
            )}
          </div>
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
