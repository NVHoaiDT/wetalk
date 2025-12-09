/* 
    Endpoint: DELETE /communities/:id/manage/comment-reports/:reportId
    Response:
    {
        "success": true,
        "message": "Comment report deleted successfully"
    }                                                             
*/

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

export const removeCommunityCommentReport = ({
  communityId,
  reportId,
}: {
  communityId: number;
  reportId: number;
}) => {
  return api.delete(
    `/communities/${communityId}/manage/comment-reports/${reportId}`,
  );
};

type UseRemoveCommunityCommentReportOptions = {
  mutationConfig?: MutationConfig<typeof removeCommunityCommentReport>;
};

export const useRemoveCommunityCommentReport = ({
  mutationConfig,
}: UseRemoveCommunityCommentReportOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ['community-reported-comments'],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: removeCommunityCommentReport,
  });
};
