import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

export const banCommunityMember = ({
  communityId,
  memberId,
}: {
  communityId: number;
  memberId: number;
}) => {
  return api.delete(`/communities/${communityId}/members/${memberId}`);
};

type UseBanCommunityMemberOptions = {
  communityId: number;
  mutationConfig?: MutationConfig<typeof banCommunityMember>;
};

export const useBanCommunityMember = ({
  communityId,
  mutationConfig,
}: UseBanCommunityMemberOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      // Invalidate all community members queries for this community
      queryClient.invalidateQueries({
        queryKey: ['community-members', communityId],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: banCommunityMember,
  });
};
