/* 
POST `/posts`
REQUEST BODY
{
  "communityId": 1,
  "title": "Sample title",
  "type": "text|link|media|poll",
  "content": "Sample content",

  // Optional
  "tags": ["golang", "programming", "backend"],

  // For type="link"
  "url": "https://example.com",

  // For type="media"
  "mediaUrls": ["https://image1.jpg", "https://image2.jpg"],

  // For type="poll"
  "pollData": {
    "question": "Your favorite programming language?",
    "options": [
      { "id": 1, "text": "Go", "votes": 0, "voters": [] },
      { "id": 2, "text": "Python", "votes": 0, "voters": [] },
      { "id": 3, "text": "Rust", "votes": 0, "voters": [] }
    ],
    "multipleChoice": true,
    "expiresAt": "2025-10-20T00:00:00Z",
    "totalVotes": 0
  }
}
*/

import { Post } from '@ngneat/falso';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import z from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

import { getInfinitePostsQueryOptions } from './get-posts';

export const createPostInputSchema = z.object({
  communityId: z.number().min(1, 'Required'),
  type: z.string().min(1, 'Required'),
  title: z.string().min(1, 'Required'),
  content: z.string().min(1, 'Required'),
  tags: z.array(z.string()),

  /* for type link */
  url: z.string().url().optional(),

  /* for type meadia */
  mediaUrls: z.array(z.string()),
});

export type CreatePostInput = z.infer<typeof createPostInputSchema>;

export const createPost = ({
  data,
}: {
  data: CreatePostInput;
}): Promise<Post> => {
  return api.post('/posts', data);
};

type UseCreatePostOptions = {
  communityId: number;
  mutationConfig?: MutationConfig<typeof createPost>;
};

export const useCreatePost = ({
  mutationConfig,
  communityId,
}: UseCreatePostOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getInfinitePostsQueryOptions(communityId).queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createPost,
  });
};
