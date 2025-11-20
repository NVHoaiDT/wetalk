/* 
  Endpoint: GET /posts?sortBy=new&tags=golang,python
*/

import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Pagination, Post } from '@/types/api';

export const getAllPosts = ({
  sortBy = 'new',
  page = 1,
  tags = [],
}: {
  sortBy?: 'new' | 'hot' | 'top' | 'best';
  page?: number;
  tags?: string[];
}): Promise<{ data: Post[]; pagination: Pagination }> => {
  return api.get(`/posts`, {
    params: {
      sortBy,
      page,
      tags: tags.length > 0 ? tags.join(',') : undefined,
    },
  });
};

export const getInfiniteAllPostsQueryOptions = (
  sortBy: 'new' | 'hot' | 'top' | 'best' = 'new',
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
  sortBy?: 'new' | 'hot' | 'top' | 'best';
  tags?: string[];
  queryConfig?: QueryConfig<typeof getAllPosts>;
};

export const useInfiniteAllPosts = ({
  sortBy = 'new',
  tags = [],
}: UseAllPostsOptions = {}) => {
  return useInfiniteQuery({
    ...getInfiniteAllPostsQueryOptions(sortBy, tags),
  });
};
