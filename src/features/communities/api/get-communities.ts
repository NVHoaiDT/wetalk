import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Community, Pagination } from '@/types/api';

export const getCommunities = (
  page = 1,
): Promise<{
  data: Community[];
  pagination: Pagination;
}> => {
  return api.get(`/communities/filter`, {
    params: {
      page,
    },
  });
};

export const getCommunitiesQueryOptions = ({
  page,
}: { page?: number } = {}) => {
  return queryOptions({
    queryKey: page ? ['communities', { page }] : ['communities'],
    queryFn: () => getCommunities(page),
  });
};

type UseCommunitiesQueryOptions = {
  page?: number;
  queryConfig?: QueryConfig<typeof getCommunitiesQueryOptions>;
};

export const useCommunities = ({
  page,
  queryConfig,
}: UseCommunitiesQueryOptions) => {
  return useQuery({
    ...getCommunitiesQueryOptions({ page }),
    ...queryConfig,
  });
};
