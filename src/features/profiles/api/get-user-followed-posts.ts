import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { CollectedPost, Pagination } from '@/types/api';

export const getUserFollowedPosts = ({
  sortBy = 'new',
  page = 1,
}: {
  sortBy?: 'new' | 'top' | 'hot';
  page?: number;
}): Promise<{ data: CollectedPost[]; pagination: Pagination }> => {
  return api.get(`/users/saved-posts`, {
    params: {
      sortBy,
      page,
      isFollowed: true,
    },
  });
};

export const getInfiniteUserFollowedPostsQueryOptions = (
  sortBy: 'new' | 'top' | 'hot',
) => {
  return infiniteQueryOptions({
    queryKey: ['user-followed-posts', sortBy],
    queryFn: ({ pageParam = 1 }) => {
      return getUserFollowedPosts({ sortBy, page: pageParam as number });
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.pagination?.nextUrl) return undefined;
      const nextPage = lastPage.pagination.page + 1;
      return nextPage;
    },
    initialPageParam: 1,
  });
};

type UseUserFollowedPostsOptions = {
  sortBy?: 'new' | 'top' | 'hot';
  queryConfig?: QueryConfig<typeof getUserFollowedPosts>;
};

export const useInfiniteUserFollowedPosts = ({
  sortBy = 'new',
}: UseUserFollowedPostsOptions) => {
  return useInfiniteQuery({
    ...getInfiniteUserFollowedPostsQueryOptions(sortBy),
  });
};
