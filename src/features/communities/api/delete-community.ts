import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

import { getCommunitiesQueryOptions } from './get-communities';

export const deleteCommunity = ({ communityId }: { communityId: number }) => {
  return api.delete(`/communities/${communityId}`);
};

type UseDeleteCommunityOptions = {
  mutationConfig?: MutationConfig<typeof deleteCommunity>;
};

export const useDeleteCommunity = ({
  mutationConfig,
}: UseDeleteCommunityOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getCommunitiesQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteCommunity,
  });
};
