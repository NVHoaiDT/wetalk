import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Community } from '@/types/api';

export const getCommunity = ({
  communityId,
}: {
  /* Messy code to handle get community in post page, change later. */
  communityId: number | undefined;
}): Promise<{ data: Community }> => {
  return api.get(`/communities/${communityId}`);
};

export const getCommunityQueryOptions = (communityId: number | undefined) => {
  return {
    queryKey: ['community', communityId],
    queryFn: () => getCommunity({ communityId }),
  };
};

type UseCommunityQueryOptions = {
  communityId: number | undefined;
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
