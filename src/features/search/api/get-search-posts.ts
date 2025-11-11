/* 
[
    {
        "id": 48,
        "communityId": 10,
        "community": {
            "id": 10,
            "name": "Backend Engineering",
            "avatar": "https://res.cloudinary.com/dd2dhsems/image/upload/v1762332363/images/post/cloudinary_post_ea95fbb3-8180-4153-84a5-737f5c2481f0_1762332360.webp"
        },
        "authorId": 1,
        "author": {
            "id": 1,
            "username": "nguyenvana",
            "avatar": "https://res.cloudinary.com/dd2dhsems/image/upload/v1762442989/images/post/cloudinary_post_b91ca9d0-8781-44cc-9b7d-fe48203ca9cd_1762442986.webp"
        },
        "title": "Create Video",
        "type": "media",
        "content": "<p>test</p>",
        "mediaUrls": [
            "videos/cloudinary_video_7e7829cf-a12b-4c40-84a4-94980ecb8b59_1762838813"
        ],
        "tags": [],
        "vote": 0,
        "isVoted": true,
        "createdAt": "2025-11-11T05:27:26.161189Z",
        "updatedAt": "2025-11-11T05:27:26.161189Z"
    },
    {
        "id": 47,
        "communityId": 10,
        "community": {
            "id": 10,
            "name": "Backend Engineering",
            "avatar": "https://res.cloudinary.com/dd2dhsems/image/upload/v1762332363/images/post/cloudinary_post_ea95fbb3-8180-4153-84a5-737f5c2481f0_1762332360.webp"
        },
        "authorId": 1,
        "author": {
            "id": 1,
            "username": "nguyenvana",
            "avatar": "https://res.cloudinary.com/dd2dhsems/image/upload/v1762442989/images/post/cloudinary_post_b91ca9d0-8781-44cc-9b7d-fe48203ca9cd_1762442986.webp"
        },
        "title": "Create Post",
        "type": "text",
        "content": "<p>Test</p>",
        "tags": [
            "blockchain"
        ],
        "vote": 0,
        "createdAt": "2025-11-11T05:26:04.729025Z",
        "updatedAt": "2025-11-11T05:26:04.729025Z"
    }
]
*/

import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { queryConfig } from '@/lib/react-query';
import { Post, Pagination } from '@/types/api';

export const getSearchPosts = ({
  query,
  page = 1,
  sortType,
}: {
  query: string;
  sortType: string;
  page?: number;
}): Promise<{ data: Post[]; pagination: Pagination }> => {
  return api.get(`/posts/search?search=${query}&sortBy=${sortType}`, {
    params: {
      page,
    },
  });
};

export const getInfiniteSearchPostsOptions = (
  query: string,
  sortType: string,
) => {
  return infiniteQueryOptions({
    queryKey: ['searchPosts', query, sortType],
    queryFn: ({ pageParam = 1 }) => {
      return getSearchPosts({ query, sortType, page: pageParam as number });
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

type UseSearchPostsOptions = {
  query: string;
  sortType: string;
  page?: number;
};
export const useInfiniteSearchPosts = ({
  query,
  sortType,
}: UseSearchPostsOptions) => {
  return useInfiniteQuery({
    ...getInfiniteSearchPostsOptions(query, sortType),
    ...queryConfig,
  });
};
