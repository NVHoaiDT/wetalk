import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Community } from '@/types/api';

export const getCommunity = ({
  communityId,
}: {
  communityId: number;
}): Promise<{ data: Community }> => {
  return api.get(`/communities/${communityId}`);
};

export const getCommunityQueryOptions = (communityId: number) => {
  return {
    queryKey: ['communitiy', communityId],
    queryFn: () => getCommunity({ communityId }),
  };
};

type UseCommunityQueryOptions = {
  communityId: number;
  queryConfig?: QueryConfig<typeof getCommunityQueryOptions>;
};

export const useCommunity = ({
  communityId,
  queryConfig,
}: UseCommunityQueryOptions) => {
  return useQuery({
    ...getCommunityQueryOptions(communityId),
    ...queryConfig,
  });
};
