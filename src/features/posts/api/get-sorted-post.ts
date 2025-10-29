import { Post } from '@ngneat/falso';
import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { queryConfig, QueryConfig } from '@/lib/react-query';
import { Pagination } from '@/types/api';

type GetSortedPostsOptions = {
  communityId: number;
  sortType: 'top' | 'new' | 'hot' | 'best';
};
export const getSortedPosts = ({
  communityId,
  sortType,
}: GetSortedPostsOptions): Promise<{
  data: Post[];
  pagination: Pagination;
}> => {
  return api.get(`/communities/${communityId}/posts?sortBy=${sortType}`);
};

export const sortPostsQueryOptions = ({
  communityId,
  sortType,
}: GetSortedPostsOptions) => {
  return queryOptions({
    queryKey: ['posts', communityId, sortType],
    queryFn: () => getSortedPosts({ communityId, sortType }),
  });
};

type UseSortedPostsOptions = {
  communityId: number;
  sortType: 'top' | 'new' | 'hot' | 'best';
  queryConfig?: QueryConfig<typeof sortPostsQueryOptions>;
};
export const useSortedPosts = ({
  communityId,
  sortType,
}: UseSortedPostsOptions) => {
  return useQuery({
    ...sortPostsQueryOptions({ communityId, sortType }),
    ...queryConfig,
  });
};
