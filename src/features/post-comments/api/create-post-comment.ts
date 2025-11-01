import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { Comment } from '@/types/api';

import { getInfinitePostCommentsQueryOptions } from './get-post-comments';

export const createPostCommentInputSchema = z.object({
  postId: z.number().min(1, 'Required'),
  content: z.string().min(1, 'Required'),
  parentCommentId: z.number().optional(),
  mediaUrl: z.string().optional(),
});

export type CreatePostCommentInput = z.infer<
  typeof createPostCommentInputSchema
>;

export const createPostComment = ({
  data,
}: {
  data: CreatePostCommentInput;
}): Promise<Comment> => {
  return api.post('/comments', data);
};

type UseCreatePostCommentOptions = {
  postId: number;
  mutationConfig?: MutationConfig<typeof createPostComment>;
};

export const useCreatePostComment = ({
  mutationConfig,
  postId,
}: UseCreatePostCommentOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getInfinitePostCommentsQueryOptions(postId).queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createPostComment,
  });
};
