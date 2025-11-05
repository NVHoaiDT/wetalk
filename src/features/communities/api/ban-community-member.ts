import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

import { getCommunityMembersQueryOptions } from './get-community-members';

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
      queryClient.invalidateQueries({
        queryKey: getCommunityMembersQueryOptions({
          communityId,
        }).queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: banCommunityMember,
  });
};
