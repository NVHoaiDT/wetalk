/* 
API DOCS:

Every time you need to upload a photo/video/rawfile, the client will call the media service to process the upload. This service will process from validation, resize, format filename and save to cloud storage (Cloudinary)

IMPLEMENT
When the client needs to upload a photo when updating the user avatar, cover image for the community or photo for the post, fetch the following API:

REQUEST: 
POST BASEURL/images/upload
body: form-data, includes:
- type: avatar/post/video_thumbnail/… [Text]
- images: file from device [File]

RESPONSE:
{
    "success": true,
    "message": "Images uploaded successfully",
    "data": [
        {
            "url": "https://res.cloudinary.com/dd2dhsems/image/upload/v1761833352/images/avatar/cloudinary_avatar_1dc5b774-0a0e-46c5-9c7d-82d70c2d7d9e_1761833347.webp"
        },
        ...
    ]
}

To delete an image, the client will call the following API:

DELETE BASEURL/images/delete
request body:
{
    "url": "https://res.cloudinary.com/dd2dhsems/image/upload/v1761833352/images/avatar/cloudinary_avatar_1dc5b774-0a0e-46c5-9c7d-82d70c2d7d9e_1761833347.webp"
}
*/

import { useMutation } from '@tanstack/react-query';
import z from 'zod';

import { UploadImageResponse } from '@/types/api';

import { apiMedia } from './api-client';
import { MutationConfig } from './react-query';

export const uploadImagesInput = z.object({
  type: z.enum(['avatar', 'post', 'video_thumbnail', 'community_cover']),
  files: z.array(z.instanceof(File)).min(1, 'At least one file is required'),
});

export type UploadImagesInput = z.infer<typeof uploadImagesInput>;

export const uploadImages = async ({
  data,
}: {
  data: UploadImagesInput;
}): Promise<UploadImageResponse> => {
  const formData = new FormData();

  formData.append('type', data.type);

  data.files.forEach((file) => {
    formData.append('images', file);
  });

  return apiMedia.post('/images/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

type UseUploadImagesOptions = {
  mutationConfig?: MutationConfig<typeof uploadImages>;
};

export const useUploadImages = ({ mutationConfig }: UseUploadImagesOptions) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: uploadImages,
  });
};

// Video Upload Types and Functions
export const uploadVideosInput = z.object({
  files: z
    .array(z.instanceof(File))
    .min(1, 'At least one video file is required')
    .refine(
      (files) => files.every((file) => file.type.startsWith('video/')),
      'All files must be videos',
    )
    .refine(
      (files) => files.every((file) => file.size < 100 * 1024 * 1024),
      'Videos must be less than 100MB',
    ),
});

export type UploadVideosInput = z.infer<typeof uploadVideosInput>;

type UploadVideoResponse = {
  success: boolean;
  message: string;
  data: {
    url: string;
  };
};

export const uploadVideos = async ({
  data,
}: {
  data: UploadVideosInput;
}): Promise<UploadVideoResponse> => {
  const formData = new FormData();

  data.files.forEach((file) => {
    formData.append('video', file);
  });

  return apiMedia.post('/videos/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

type UseUploadVideosOptions = {
  mutationConfig?: MutationConfig<typeof uploadVideos>;
};

export const useUploadVideos = ({
  mutationConfig,
}: UseUploadVideosOptions = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: uploadVideos,
  });
};
