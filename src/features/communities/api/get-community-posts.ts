import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Post, Pagination } from '@/types/api';

export const getCommunityPosts = ({
  communityId,
  search,
  status,
  page = 1,
}: {
  communityId: number;
  search?: string;
  status?: 'pending' | 'approved' | 'rejected';
  page?: number;
}): Promise<{ data: Post[]; pagination: Pagination }> => {
  return api.get(`/communities/${communityId}/manage/posts`, {
    params: {
      search: search || '',
      status: status || 'approved',
      page,
    },
  });
};

export const getInfiniteCommunityPostsQueryOptions = ({
  communityId,
  search,
  status,
}: {
  communityId: number;
  search?: string;
  status?: 'pending' | 'approved' | 'rejected';
}) => {
  return infiniteQueryOptions({
    queryKey: ['community-posts', communityId, { search, status }],
    queryFn: ({ pageParam = 1 }) => {
      return getCommunityPosts({
        communityId,
        search,
        status,
        page: pageParam as number,
      });
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.pagination?.nextUrl) return undefined;
      return lastPage.pagination.page + 1;
    },
    initialPageParam: 1,
  });
};

type UseInfiniteCommunityPostsOptions = {
  communityId: number;
  search?: string;
  status?: 'pending' | 'approved' | 'rejected';
  queryConfig?: QueryConfig<typeof getInfiniteCommunityPostsQueryOptions>;
};

export const useInfiniteCommunityPosts = ({
  communityId,
  search,
  status,
  queryConfig,
}: UseInfiniteCommunityPostsOptions) => {
  return useInfiniteQuery({
    ...getInfiniteCommunityPostsQueryOptions({ communityId, search, status }),
    ...queryConfig,
  });
};
