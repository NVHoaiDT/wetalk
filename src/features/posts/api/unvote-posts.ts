/* 
    Endpoint: /posts/:id/vote
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

export const unvotePostInputSchema = z.object({
  postId: z.number(),
});

export type unvotePostInput = z.infer<typeof unvotePostInputSchema>;

export const unvotePost = ({ postId }: unvotePostInput) => {
  return api.delete(`/posts/${postId}/vote`);
};

type UseUnvotePostOptions = {
  mutationConfig?: MutationConfig<typeof unvotePost>;
};

export const useUnvotePost = ({ mutationConfig }: UseUnvotePostOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.refetchQueries({ queryKey: ['posts'] });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: unvotePost,
  });
};
