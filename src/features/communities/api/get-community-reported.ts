import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Post, Pagination } from '@/types/api';

export const getCommunityReportedPosts = ({
  communityId,
  page = 1,
}: {
  communityId: number;
  page?: number;
}): Promise<{ data: Post[]; pagination: Pagination }> => {
  return api.get(`/communities/${communityId}/manage/report`, {
    params: {
      page,
    },
  });
};

export const getInfiniteCommunityReportedPostsQueryOptions = ({
  communityId,
}: {
  communityId: number;
}) => {
  return infiniteQueryOptions({
    queryKey: ['community-reported-posts', communityId],
    queryFn: ({ pageParam = 1 }) => {
      return getCommunityReportedPosts({
        communityId,
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

type UseInfiniteCommunityReportedPostsOptions = {
  communityId: number;
  queryConfig?: QueryConfig<
    typeof getInfiniteCommunityReportedPostsQueryOptions
  >;
};

export const useInfiniteCommunityReportedPosts = ({
  communityId,
  queryConfig,
}: UseInfiniteCommunityReportedPostsOptions) => {
  return useInfiniteQuery({
    ...getInfiniteCommunityReportedPostsQueryOptions({
      communityId,
    }),
    ...queryConfig,
  });
};
