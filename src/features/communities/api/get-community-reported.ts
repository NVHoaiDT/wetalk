/* 
{
    "success": true,
    "message": "Post reports retrieved successfully",
    "data": [
        {
            "postId": 30,
            "postTitle": "title",
            "author": {
                "id": 1,
                "username": "nguyenvana",
                "avatar": "https://i.pravatar.cc/150?img=1"
            },
            "reporters": [
                {
                    "id": 2,
                    "username": "tranthib",
                    "avatar": "https://i.pravatar.cc/150?img=2",
                    "reasons": [
                        "Hate",
                        "Minor abuse or sexualization"
                    ],
                    "note": "Please review this post"
                },
                {
                    "id": 20,
                    "username": "Ha Phat Dep Trai",
                    "avatar": "http://media_service_base_url/avatar.jpg",
                    "reasons": [
                        "Racism",
                        "Minor abuse or sexualization"
                    ],
                    "note": "Please review this post"
                }
            ],
            "totalReports": 2
        },
        {
            "postId": 2,
            "postTitle": "title",
            "author": {
                "id": 20,
                "username": "Ha Phat Dep Trai",
                "avatar": "http://media_service_base_url/avatar.jpg"
            },
            "reporters": [
                {
                    "id": 20,
                    "username": "Ha Phat Dep Trai",
                    "avatar": "http://media_service_base_url/avatar.jpg",
                    "reasons": [
                        "Racism",
                        "Trademark violation"
                    ],
                    "note": "Please review this post"
                }
            ],
            "totalReports": 1
        }
    ],
    "pagination": {
        "total": 3,
        "page": 1,
        "limit": 12
    }
}
*/
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
