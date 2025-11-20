/* 
  Endpoint: GET
    /communities/filter?
      sortBy=top&topics=Công%20nghệ%20%26%20Lập%20trình,Giải%20trí%20&%20Văn%20hóa
*/

import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Community, Pagination } from '@/types/api';

export const getCommunities = (
  sortBy?: string,
  page = 1,
  topics?: string[],
): Promise<{
  data: Community[];
  pagination: Pagination;
}> => {
  return api.get(`/communities/filter`, {
    params: {
      sortBy,
      page,
      topics: topics?.join(','),
    },
  });
};

export const getCommunitiesQueryOptions = ({
  sortBy,
  page,
  topics,
}: { sortBy?: string; page?: number; topics?: string[] } = {}) => {
  return queryOptions({
    queryKey: ['communities', { sortBy, page, topics }],
    queryFn: () => getCommunities(sortBy, page, topics),
  });
};

type UseCommunitiesQueryOptions = {
  sortBy?: string;
  page?: number;
  topics?: string[];
  queryConfig?: QueryConfig<typeof getCommunitiesQueryOptions>;
};

export const useCommunities = ({
  sortBy,
  page,
  topics,
  queryConfig,
}: UseCommunitiesQueryOptions) => {
  return useQuery({
    ...getCommunitiesQueryOptions({ sortBy, page, topics }),
    ...queryConfig,
  });
};
