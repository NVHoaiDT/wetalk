import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Post, Pagination } from '@/types/api';

export const getUserPosts = ({
  userId,
  sortBy = 'new',
  page = 1,
}: {
  userId: number;
  sortBy?: 'new' | 'top' | 'hot';
  page?: number;
}): Promise<{ data: Post[]; pagination: Pagination }> => {
  return api.get(`/users/${userId}/posts`, {
    params: {
      sortBy,
      page,
    },
  });
};

export const getInfiniteUserPostsQueryOptions = (
  userId: number,
  sortBy: 'new' | 'top' | 'hot' = 'new',
) => {
  return infiniteQueryOptions({
    queryKey: ['user-posts', userId, sortBy],
    queryFn: ({ pageParam = 1 }) => {
      return getUserPosts({ userId, sortBy, page: pageParam as number });
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.pagination?.nextUrl) return undefined;
      const nextPage = lastPage.pagination.page + 1;
      return nextPage;
    },
    initialPageParam: 1,
  });
};

type UseUserPostsOptions = {
  userId: number;
  sortBy?: 'new' | 'top' | 'hot';
  queryConfig?: QueryConfig<typeof getUserPosts>;
};

export const useInfiniteUserPosts = ({
  userId,
  sortBy = 'new',
}: UseUserPostsOptions) => {
  return useInfiniteQuery({
    ...getInfiniteUserPostsQueryOptions(userId, sortBy),
  });
};
