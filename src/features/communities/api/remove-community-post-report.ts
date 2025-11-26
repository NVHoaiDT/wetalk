/* 
  Endpoint: DELETE /api/v1/communities/:id/manage/reports/:reportId
  {
    "success": true,
    "message": "Post report deleted successfully"
  }
*/

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

export const removeCommunityPostReport = ({
  communityId,
  reportId,
}: {
  communityId: number;
  reportId: number;
}) => {
  return api.delete(`/communities/${communityId}/manage/reports/${reportId}`);
};

type UseRemoveCommunityPostReportOptions = {
  mutationConfig?: MutationConfig<typeof removeCommunityPostReport>;
};

export const useRemoveCommunityPostReport = ({
  mutationConfig,
}: UseRemoveCommunityPostReportOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ['community-reported-posts'],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: removeCommunityPostReport,
  });
};
