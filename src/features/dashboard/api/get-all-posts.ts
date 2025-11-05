import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Pagination, Post } from '@/types/api';

export const getAllPosts = ({
  sortBy = 'new',
  page = 1,
}: {
  sortBy?: 'new' | 'hot' | 'top' | 'best';
  page?: number;
}): Promise<{ data: Post[]; pagination: Pagination }> => {
  return api.get(`/posts`, {
    params: {
      sortBy,
      page,
    },
  });
};

export const getInfiniteAllPostsQueryOptions = (
  sortBy: 'new' | 'hot' | 'top' | 'best' = 'new',
) => {
  return infiniteQueryOptions({
    queryKey: ['all-posts', sortBy],
    queryFn: ({ pageParam = 1 }) => {
      return getAllPosts({ sortBy, page: pageParam as number });
    },
    getNextPageParam: (lastPage) => {
      if (lastPage?.pagination?.page === lastPage?.pagination?.total)
        return undefined;
      const nextPage = lastPage.pagination.page + 1;
      return nextPage;
    },
    initialPageParam: 1,
  });
};

type UseAllPostsOptions = {
  sortBy?: 'new' | 'hot' | 'top' | 'best';
  queryConfig?: QueryConfig<typeof getAllPosts>;
};

export const useInfiniteAllPosts = ({
  sortBy = 'new',
}: UseAllPostsOptions = {}) => {
  return useInfiniteQuery({
    ...getInfiniteAllPostsQueryOptions(sortBy),
  });
};
