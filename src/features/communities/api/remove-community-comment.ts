/* 
    Endpoint: DELETE /communities/:id/manage/comments/:commentId
    Response:
    {
        "success": true,
        "message": "Comment deleted successfully"
    }
*/

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

export const removeCommunityComment = ({
  communityId,
  commentId,
}: {
  communityId: number;
  commentId: number;
}) => {
  return api.delete(`/communities/${communityId}/manage/comments/${commentId}`);
};

type UseRemoveCommunityCommentOptions = {
  communityId: number;
  commentId: number;
  mutationConfig?: MutationConfig<typeof removeCommunityComment>;
};

export const useRemoveCommunityComment = ({
  mutationConfig,
}: Omit<UseRemoveCommunityCommentOptions, 'communityId' | 'commentId'>) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ['community-reported-comments'],
      });
      queryClient.invalidateQueries({
        queryKey: ['post-comments'],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: removeCommunityComment,
  });
};
