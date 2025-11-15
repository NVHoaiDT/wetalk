import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

export const joinCommunity = ({ communityId }: { communityId: number }) => {
  return api.post(`/communities/${communityId}/join`);
};

type JoinCommunityQueryOptions = {
  communityId: number;
  mutationConfig?: MutationConfig<typeof joinCommunity>;
};

export const useJoinCommunity = ({
  communityId,
  mutationConfig,
}: JoinCommunityQueryOptions) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.refetchQueries({
        queryKey: ['community', communityId],
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: joinCommunity,
  });
};
