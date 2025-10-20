import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Community, Pagination } from '@/types/api';

export const getCommunities = (
  sortBy?: string,
  page = 1,
): Promise<{
  data: Community[];
  pagination: Pagination;
}> => {
  return api.get(`/communities/filter`, {
    params: {
      sortBy,
      page,
    },
  });
};

export const getCommunitiesQueryOptions = ({
  sortBy,
  page,
}: { sortBy?: string; page?: number } = {}) => {
  return queryOptions({
    queryKey: ['communities', { sortBy, page }],
    queryFn: () => getCommunities(sortBy, page),
  });
};

type UseCommunitiesQueryOptions = {
  sortBy?: string;
  page?: number;
  queryConfig?: QueryConfig<typeof getCommunitiesQueryOptions>;
};

export const useCommunities = ({
  sortBy,
  page,
  queryConfig,
}: UseCommunitiesQueryOptions) => {
  return useQuery({
    ...getCommunitiesQueryOptions({ sortBy, page }),
    ...queryConfig,
  });
};
