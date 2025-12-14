/* 
    Endpoint: /comments/${commentId}/vote
    Method: DELETE    
    Response: 
    {
        "success": true,
        "message": "Post unvoted successfully"
    }
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import z from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

export const unvotePostCommentInputSchema = z.object({
  commentId: z.number(),
});

export type unvotePostCommentInput = z.infer<
  typeof unvotePostCommentInputSchema
>;

export const unvotePostComment = ({ commentId }: unvotePostCommentInput) => {
  return api.delete(`/comments/${commentId}/vote`);
};

type UseUnvotePostCommentOptions = {
  mutationConfig?: MutationConfig<typeof unvotePostComment>;
};

export const useUnvotePostComment = ({
  mutationConfig,
}: UseUnvotePostCommentOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ['post-comments'],
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: unvotePostComment,
  });
};
