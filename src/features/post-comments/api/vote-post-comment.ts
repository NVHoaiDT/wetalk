/* 
REQUEST BODY:
{
    "vote": true/false // correspond toupvote/downvote
}

RESPONSE: 
{
    "success": true,
    "message": "Comment voted successfully"
}
*/

import { useMutation, useQueryClient } from '@tanstack/react-query';
import z from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

export const voteCommentInput = z.object({
  commentId: z.number(),
  vote: z.boolean(),
});

export type VoteCommentInput = z.infer<typeof voteCommentInput>;

export const voteComment = ({ commentId, vote }: VoteCommentInput) => {
  return api.post(`/comments/${commentId}/vote`, { vote });
};

type UseVoteCommentOptions = {
  mutationConfig?: MutationConfig<typeof voteComment>;
};

export const useVotePostComment = ({
  mutationConfig,
}: UseVoteCommentOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: ['post-comments'] });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: voteComment,
  });
};
