import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { queryConfig, QueryConfig } from '@/lib/react-query';
import { Post, Pagination } from '@/types/api';

export const getPosts = ({
  communityId,
  page = 1,
  sortType,
}: {
  communityId: number;
  sortType: string;
  page?: number;
}): Promise<{ data: Post[]; pagination: Pagination }> => {
  return api.get(`/communities/${communityId}/posts?sortBy=${sortType}`, {
    params: {
      page,
    },
  });
};

export const getInfinitePostsQueryOptions = (
  communityId: number,
  sortType: string,
) => {
  return infiniteQueryOptions({
    queryKey: ['posts', communityId, sortType],
    queryFn: ({ pageParam = 1 }) => {
      return getPosts({ communityId, sortType, page: pageParam as number });
    },
    getNextPageParam: (lastPage) => {
      if (lastPage?.pagination?.page === lastPage?.pagination.total)
        return undefined;
      const nextPage = lastPage.pagination.page + 1;
      return nextPage;
    },
    initialPageParam: 1,
  });
};

type UsePostsOptions = {
  communityId: number;
  sortType: string;
  page?: number;
  queryConfig?: QueryConfig<typeof getPosts>;
};

export const useInfinitePosts = ({
  communityId,
  sortType,
}: UsePostsOptions) => {
  return useInfiniteQuery({
    ...getInfinitePostsQueryOptions(communityId, sortType),
    ...queryConfig,
  });
};
