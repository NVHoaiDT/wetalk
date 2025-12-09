/* 
    Endpoint: GET /communities/:id/manage/comment-reports
    {
    "success": true,
    "message": "Comment reports retrieved successfully",
    "data": [
                {
                    "id": 3,  // REPORT ID, no idea why backend team naming that confusingly
                    "commentId": 37,
                    "commentContent": "Some inappropriate comment content",
                    "commentAuthor": {
                        "id": 13,
                        "username": "Triệu Thúy Oanh",
                        "avatar": "https://i.pravatar.cc/150?img=13",
                        "karma": 300,
                        "bio": "Cloud Engineer, AWS và Azure certified",
                        "createdAt": "2025-09-24T03:14:03.050615Z"
                    },
                    "postId": 12,
                    "postTitle": "A post title",
                    "reporters": [
                        {
                            "id": 2,
                            "username": "Trần Thị Bình",
                            "avatar": "https://i.pravatar.cc/150?img=2",
                            "reasons": [
                                "spam",
                                "offensive language"
                            ],
                            "note": "Ban immediately !"
                        }
                    ],
                    "totalReports": 1
                }
            ],
            "pagination": {
                "total": 1,   // total number of reports in all pages
                "page": 1,    // current page number
                "limit": 12   // number of reports per page
            }
        }
    ]        
*/

import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { ReportedComment, Pagination } from '@/types/api';

export const getCommunityReportedComments = ({
  communityId,
  page = 1,
}: {
  communityId: number;
  page?: number;
}): Promise<{ data: ReportedComment[]; pagination: Pagination }> => {
  return api.get(`/communities/${communityId}/manage/comment-reports`, {
    params: {
      page,
    },
  });
};

export const getInfiniteCommunityReportedCommentsQueryOptions = ({
  communityId,
}: {
  communityId: number;
}) => {
  return infiniteQueryOptions({
    queryKey: ['community-reported-comments', communityId],
    queryFn: ({ pageParam = 1 }) => {
      return getCommunityReportedComments({
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

type UseInfiniteCommunityReportedCommentsOptions = {
  communityId: number;
  queryConfig?: QueryConfig<
    typeof getInfiniteCommunityReportedCommentsQueryOptions
  >;
};

export const useInfiniteCommunityReportedComments = ({
  communityId,
  queryConfig,
}: UseInfiniteCommunityReportedCommentsOptions) => {
  return useInfiniteQuery({
    ...getInfiniteCommunityReportedCommentsQueryOptions({
      communityId,
    }),
    ...queryConfig,
  });
};
