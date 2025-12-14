import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

export const removeCommunityPost = ({
  communityId,
  postId,
}: {
  communityId: number;
  postId: number;
}) => {
  return api.delete(`/communities/${communityId}/manage/posts/${postId}`);
};

type UseRemoveCommunityPostOptions = {
  communityId: number;
  postId: number;
  mutationConfig?: MutationConfig<typeof removeCommunityPost>;
};

export const useRemoveCommunityPost = ({
  mutationConfig,
}: UseRemoveCommunityPostOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      // Invalidate all community posts queries for this community
      queryClient.invalidateQueries({
        queryKey: ['community-posts'],
      });
      queryClient.invalidateQueries({
        queryKey: ['community-reported-posts'],
      });

      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: removeCommunityPost,
  });
};
