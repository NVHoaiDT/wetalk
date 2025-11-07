import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

export const removeCommunityReportedPost = ({
  communityId,
  reportId,
}: {
  communityId: number;
  reportId: number;
}) => {
  return api.delete(`/communities/${communityId}/manage/reports/${reportId}`);
};

type UseRemoveCommunityReportedPostOptions = {
  communityId: number;
  mutationConfig?: MutationConfig<typeof removeCommunityReportedPost>;
};

export const useRemoveCommunityReportedPost = ({
  communityId,
  mutationConfig,
}: UseRemoveCommunityReportedPostOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      // Invalidate all community reported posts queries for this community
      queryClient.invalidateQueries({
        queryKey: ['community-reported-posts', communityId],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: removeCommunityReportedPost,
  });
};
