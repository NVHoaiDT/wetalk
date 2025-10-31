import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { queryConfig } from '@/lib/react-query';
import { Post, Pagination } from '@/types/api';

export const getSearchPosts = ({
  query,
  page = 1,
  sortType,
}: {
  query: string;
  sortType: string;
  page?: number;
}): Promise<{ data: Post[]; pagination: Pagination }> => {
  return api.get(`/posts/search?search=${query}&sortBy=${sortType}`, {
    params: {
      page,
    },
  });
};

export const getInfiniteSearchPostsOptions = (
  query: string,
  sortType: string,
) => {
  return infiniteQueryOptions({
    queryKey: ['searchPosts', query, sortType],
    queryFn: ({ pageParam = 1 }) => {
      return getSearchPosts({ query, sortType, page: pageParam as number });
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

type UseSearchPostsOptions = {
  query: string;
  sortType: string;
  page?: number;
};
export const useInfiniteSearchPosts = ({
  query,
  sortType,
}: UseSearchPostsOptions) => {
  return useInfiniteQuery({
    ...getInfiniteSearchPostsOptions(query, sortType),
    ...queryConfig,
  });
};
