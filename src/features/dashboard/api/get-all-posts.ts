/* 
  Endpoint: GET /posts?sortBy=new&tags=golang,python
*/

import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Pagination, Post } from '@/types/api';

export const getAllPosts = ({
  sortBy,
  page = 1,
  tags = [],
}: {
  sortBy?: string | undefined;
  page?: number;
  tags?: string[];
}): Promise<{ data: Post[]; pagination: Pagination }> => {
  const params: Record<string, any> = {
    sortBy,
    page,
  };

  if (tags.length > 0) {
    params.tags = tags.join(',');
  }

  return api.get(`/posts`, { params });
};

export const getInfiniteAllPostsQueryOptions = (
  sortBy: string | undefined,
  tags: string[] = [],
) => {
  return infiniteQueryOptions({
    queryKey: ['all-posts', sortBy, tags],
    queryFn: ({ pageParam = 1 }) => {
      return getAllPosts({ sortBy, page: pageParam as number, tags });
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.pagination?.nextUrl) return undefined;
      const nextPage = lastPage.pagination.page + 1;
      return nextPage;
    },
    initialPageParam: 1,
  });
};

type UseAllPostsOptions = {
  sortBy?: string | undefined;
  tags?: string[];
  queryConfig?: QueryConfig<typeof getAllPosts>;
};

export const useInfiniteAllPosts = ({
  sortBy,
  tags = [],
}: UseAllPostsOptions = {}) => {
  return useInfiniteQuery({
    ...getInfiniteAllPostsQueryOptions(sortBy, tags),
    placeholderData: undefined, // Don't use stale data from other queries
  });
};
