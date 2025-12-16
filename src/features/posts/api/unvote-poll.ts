/*
DELETE `/posts/:id/poll/vote`
BODY:
{
    "optionId": 1
}
RESPONSE:
{
    "success": true,
    "message": "Poll unvoted successfully"
}
*/

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

import { getPostQueryOptions } from './get-post';

export const unvotePoll = ({
  postId,
  optionId,
}: {
  postId: number;
  optionId: number;
}): Promise<{ success: boolean; message: string }> => {
  return api.delete(`/posts/${postId}/poll/vote`, { data: { optionId } });
};

type UseUnvotePollOptions = {
  postId: number;
  mutationConfig?: MutationConfig<typeof unvotePoll>;
};

export const useUnvotePoll = ({
  postId,
  mutationConfig,
}: UseUnvotePollOptions) => {
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
    mutationFn: unvotePoll,
  });
};
