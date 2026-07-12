export type VideoQuality = '360p' | '480p' | '720p' | '1080p' | 'auto';

const QUALITY_TRANSFORMATIONS: Record<VideoQuality, string> = {
  '360p': 'q_auto,f_auto,h_360,br_500k',
  '480p': 'q_auto,f_auto,h_480,br_1000k',
  '720p': 'q_auto,f_auto,h_720,br_2000k',
  '1080p': 'q_auto,f_auto,h_1080,br_3500k',
  auto: 'q_auto,f_auto',
};

/**
 * The video upload API returns a relative Cloudinary public_id
 * (e.g. "videos/cloudinary_video_...") rather than a playable URL,
 * so every consumer must resolve it through this helper before use.
 */
export const getVideoUrl = (
  publicId: string,
  quality: VideoQuality = 'auto',
) => {
  const transformation = QUALITY_TRANSFORMATIONS[quality];
  return `https://res.cloudinary.com/dd2dhsems/video/upload/${transformation}/${publicId}`;
};

export const isVideoUrl = (url: string) =>
  url.includes('videos/') || url.endsWith('.mp4');
