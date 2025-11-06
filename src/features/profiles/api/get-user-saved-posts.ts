import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { SavedPost, Pagination } from '@/types/api';

export const getUserSavedPosts = ({
  sortBy = 'new',
  page = 1,
}: {
  sortBy?: 'new' | 'top' | 'hot';
  page?: number;
}): Promise<{ data: SavedPost[]; pagination: Pagination }> => {
  return api.get(`/users/saved-posts`, {
    params: {
      sortBy,
      page,
      isFollow: false,
    },
  });
};

export const getInfiniteUserSavedPostsQueryOptions = (
  sortBy: 'new' | 'top' | 'hot',
) => {
  return infiniteQueryOptions({
    queryKey: ['user-saved-posts', sortBy],
    queryFn: ({ pageParam = 1 }) => {
      return getUserSavedPosts({ sortBy, page: pageParam as number });
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.pagination?.nextUrl) return undefined;
      const nextPage = lastPage.pagination.page + 1;
      return nextPage;
    },
    initialPageParam: 1,
  });
};

type UseUserSavedPostsOptions = {
  sortBy?: 'new' | 'top' | 'hot';
  queryConfig?: QueryConfig<typeof getUserSavedPosts>;
};

export const useInfiniteUserSavedPosts = ({
  sortBy = 'new',
}: UseUserSavedPostsOptions) => {
  return useInfiniteQuery({
    ...getInfiniteUserSavedPostsQueryOptions(sortBy),
  });
};
