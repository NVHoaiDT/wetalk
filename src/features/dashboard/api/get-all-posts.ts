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
  const params: Record<string, any> = {
    sortBy,
    page,
  };

  if (tags.length > 0) {
    params.tags = tags.join(',');
  }

  console.log('🔍 [getAllPosts] Input params:', { sortBy, page, tags });
  console.log('🔍 [getAllPosts] Built params object:', params);

  return api.get(`/posts`, { params });
};

export const getInfiniteAllPostsQueryOptions = (
  sortBy: 'new' | 'hot' | 'top' | 'best',
  tags: string[] = [],
) => {
  console.log('🔑 [QueryOptions] Creating with:', { sortBy, tags });
  return infiniteQueryOptions({
    queryKey: ['all-posts', sortBy, tags],
    queryFn: ({ pageParam = 1 }) => {
      console.log('🎯 [QueryFn] Executing with:', {
        sortBy,
        page: pageParam,
        tags,
      });
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
    placeholderData: undefined, // Don't use stale data from other queries
  });
};
