import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Post, Pagination } from '@/types/api';

export const getPosts = ({
  communityId,
  page = 1,
}: {
  communityId: number;
  page?: number;
}): Promise<{ data: Post[]; pagination: Pagination }> => {
  return api.get(`/communities/${communityId}/posts`, {
    params: {
      page,
    },
  });
};

export const getInfinitePostsQueryOptions = (communityId: number) => {
  return infiniteQueryOptions({
    queryKey: ['posts', communityId],
    queryFn: ({ pageParam = 1 }) => {
      return getPosts({ communityId, page: pageParam as number });
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

type UsePostsOptions = {
  communityId: number;
  page?: number;
  queryConfig?: QueryConfig<typeof getPosts>;
};

export const useInfinitePosts = ({ communityId }: UsePostsOptions) => {
  return useInfiniteQuery({
    ...getInfinitePostsQueryOptions(communityId),
  });
};
