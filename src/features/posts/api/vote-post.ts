/* 
    Endpoint: /api/v1/posts/:id/vote
    Method: POST
    Body: {
        "vote": true/false // tương ứng upvote/downvote
    }
    Response: {
    "success": true,
    "message": "Post voted successfully"
    }
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import z from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

export const votePostInputSchema = z.object({
  postId: z.number(),
  vote: z.boolean(),
});

export type VotePostInput = z.infer<typeof votePostInputSchema>;

export const votePost = ({ postId, vote }: VotePostInput) => {
  return api.post(`/posts/${postId}/vote`, { vote });
};

type UseVotePostOptions = {
  mutationConfig?: MutationConfig<typeof votePost>;
};

export const useVotePost = ({ mutationConfig }: UseVotePostOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.refetchQueries({ queryKey: ['posts'] });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: votePost,
  });
};
