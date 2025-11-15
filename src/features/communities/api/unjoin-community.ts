import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

export const unJoinCommunity = ({ communityId }: { communityId: number }) => {
  return api.delete(`/communities/${communityId}/join`);
};

type UnJoinCommunityQueryOptions = {
  communityId: number;
  mutationConfig?: MutationConfig<typeof unJoinCommunity>;
};

export const useUnJoinCommunity = ({
  communityId,
  mutationConfig,
}: UnJoinCommunityQueryOptions) => {
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
    mutationFn: unJoinCommunity,
  });
};
