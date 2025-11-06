import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

export const updatePostStatus = ({
  communityId,
  postId,
  status,
}: {
  communityId: number;
  postId: number;
  status: 'approved' | 'rejected';
}) => {
  return api.patch(
    `/communities/${communityId}/manage/posts/${postId}/status`,
    {
      status,
    },
  );
};

type UseUpdatePostStatusOptions = {
  communityId: number;
  mutationConfig?: MutationConfig<typeof updatePostStatus>;
};

export const useUpdatePostStatus = ({
  communityId,
  mutationConfig,
}: UseUpdatePostStatusOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      // Invalidate all community posts queries for this community
      queryClient.invalidateQueries({
        queryKey: ['community-posts', communityId],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updatePostStatus,
  });
};
