import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Comment, Pagination } from '@/types/api';

export const getUserComments = ({
  userId,
  sortBy = 'new',
  page = 1,
}: {
  userId: number;
  sortBy?: 'new' | 'top' | 'hot';
  page?: number;
}): Promise<{ data: Comment[]; pagination: Pagination }> => {
  return api.get(`/users/${userId}/comments`, {
    params: {
      sortBy,
      page,
    },
  });
};

export const getInfiniteUserCommentsQueryOptions = (
  userId: number,
  sortBy: 'new' | 'top' | 'hot' = 'new',
) => {
  return infiniteQueryOptions({
    queryKey: ['user-comments', userId, sortBy],
    queryFn: ({ pageParam = 1 }) => {
      return getUserComments({ userId, sortBy, page: pageParam as number });
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.pagination?.nextUrl) return undefined;
      const nextPage = lastPage.pagination.page + 1;
      return nextPage;
    },
    initialPageParam: 1,
  });
};

type UseUserCommentsOptions = {
  userId: number;
  sortBy?: 'new' | 'top' | 'hot';
  queryConfig?: QueryConfig<typeof getUserComments>;
};

export const useInfiniteUserComments = ({
  userId,
  sortBy = 'new',
}: UseUserCommentsOptions) => {
  return useInfiniteQuery({
    ...getInfiniteUserCommentsQueryOptions(userId, sortBy),
  });
};
