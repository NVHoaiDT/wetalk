import { Post } from '@ngneat/falso';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import z from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

import { getInfinitePostsQueryOptions } from './get-posts';

export const createPostInputSchema = z.object({
  community_id: z.number().min(1, 'Required'),
  type: z.string().min(1, 'Required'),
  title: z.string().min(1, 'Required'),
  content: z.string().min(1, 'Required'),
  tags: z.array(z.string()),

  /* for type meadia */
  media_urls: z.array(z.string()),
});

export type CreatePostInput = z.infer<typeof createPostInputSchema>;

export const createPost = ({
  data,
}: {
  data: CreatePostInput;
}): Promise<Post> => {
  console.log('Create post called', data);
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
