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
  communityId: number;
  reportId: number;
  mutationConfig?: MutationConfig<typeof removeCommunityPostReport>;
};

export const useRemoveCommunityPostReport = ({
  communityId,
  reportId,
  mutationConfig,
}: UseRemoveCommunityPostReportOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      // Invalidate all community reported posts queries for this community
      queryClient.invalidateQueries({
        queryKey: ['community-reported-posts', communityId, reportId],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: removeCommunityPostReport,
  });
};
