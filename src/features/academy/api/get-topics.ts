import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';

import { apiAcademy } from '@/lib/api-client';
import { Pagination, Topic } from '@/types/api';

export const getTopics = ({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
}): Promise<{ data: Topic[]; pagination: Pagination }> => {
  return apiAcademy.get('/topics', {
    params: { page, limit },
  });
};

export const getInfiniteTopicsQueryOptions = () => {
  return infiniteQueryOptions({
    queryKey: ['topics'],
    queryFn: ({ pageParam = 1 }) => {
      return getTopics({ page: pageParam as number });
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.pagination) return undefined;
      const totalPages = Math.ceil(
        lastPage.pagination.total / lastPage.pagination.limit,
      );
      if (lastPage.pagination.page >= totalPages) return undefined;
      return lastPage.pagination.page + 1;
    },
    initialPageParam: 1,
  });
};

export const useInfiniteTopics = () => {
  return useInfiniteQuery({
    ...getInfiniteTopicsQueryOptions(),
  });
};
