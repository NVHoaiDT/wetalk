/* 
  Endpoint: GET
    /communities/filter?
      sortBy=top&topics=Công%20nghệ%20%26%20Lập%20trình,Giải%20trí%20&%20Văn%20hóa

    "data": [
        {
            "id": 21,
            "name": "Test",
            "shortDescription": "Test",
            "topic": [
                "Âm nhạc",
                "AI"
            ],
            "communityAvatar": "https://res.cloudinary.com/dd2dhsems/image/upload/v1765518779/images/post/cloudinary_post_4a7c8879-df05-437c-be23-eaa03391858f_1765518773.webp",
            "isPrivate": false,
            "totalMembers": 0,
            "isFollow": false
        },
        {
            "id": 20,
            "name": "Test",
            "shortDescription": "Test",
            "isPrivate": false,
            "totalMembers": 0,
            "isFollow": false
        },
        {
            ...
        },
    ],
    "pagination": {
        "total": 27, // total communities matching the filter
        "page": 1, // current page
        "limit": 12, // items per page
        "nextUrl": "/api/v1/communities/filter?sortBy=newest\u0026page=2\u0026limit=12" // URL for the next page, not present if there are no more pages
    }
*/

import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Community, Pagination } from '@/types/api';

export const getCommunities = ({
  sortBy,
  page = 1,
  topics,
}: {
  sortBy?: string;
  page?: number;
  topics?: string[];
}): Promise<{
  data: Community[];
  pagination: Pagination;
}> => {
  return api.get(`/communities/filter`, {
    params: {
      sortBy,
      page,
      topics: topics?.join(','),
    },
  });
};

export const getInfiniteCommunitiesQueryOptions = ({
  sortBy,
  topics,
}: {
  sortBy?: string;
  topics?: string[];
}) => {
  return infiniteQueryOptions({
    queryKey: ['communities', { sortBy, topics }],
    queryFn: ({ pageParam = 1 }) => {
      return getCommunities({
        sortBy,
        topics,
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

type UseInfiniteCommunitiesOptions = {
  sortBy?: string;
  topics?: string[];
  queryConfig?: QueryConfig<typeof getInfiniteCommunitiesQueryOptions>;
};

export const useInfiniteCommunities = ({
  sortBy,
  topics,
  queryConfig,
}: UseInfiniteCommunitiesOptions) => {
  return useInfiniteQuery({
    ...getInfiniteCommunitiesQueryOptions({ sortBy, topics }),
    ...queryConfig,
  });
};
