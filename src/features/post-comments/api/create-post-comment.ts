import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { Comment } from '@/types/api';

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
  mutationConfig?: MutationConfig<typeof createPostComment>;
};

export const useCreatePostComment = ({
  mutationConfig,
}: UseCreatePostCommentOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ['post-comments'],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createPostComment,
  });
};
