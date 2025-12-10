/*
POST `/posts/:id/poll/vote`
BODY:
{
    "optionId": 1
}
RESPONSE:
{
    "success": true,
    "message": "Poll voted successfully"
}
*/

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

import { getPostQueryOptions } from './get-post';

export const votePoll = ({
  postId,
  optionId,
}: {
  postId: number;
  optionId: number;
}): Promise<{ success: boolean; message: string }> => {
  return api.post(`/posts/${postId}/poll/vote`, { optionId });
};

type UseVotePollOptions = {
  postId: number;
  mutationConfig?: MutationConfig<typeof votePoll>;
};

export const useVotePoll = ({ postId, mutationConfig }: UseVotePollOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      // Invalidate post query to refetch updated poll data
      queryClient.invalidateQueries({
        queryKey: getPostQueryOptions(postId).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: ['all-posts'],
      });
      queryClient.invalidateQueries({
        queryKey: ['posts'],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: votePoll,
  });
};
