import { useMutation } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

export const joinCommunity = ({ communityId }: { communityId: string }) => {
  return api.post(`/communities/${communityId}/join`);
};

type JoinCommunityQueryOptions = {
  mutationConfig?: MutationConfig<typeof joinCommunity>;
};

export const useJoinCommunity = ({
  mutationConfig,
}: JoinCommunityQueryOptions = {}) => {
  return useMutation({
    mutationFn: joinCommunity,
    ...mutationConfig,
  });
};
