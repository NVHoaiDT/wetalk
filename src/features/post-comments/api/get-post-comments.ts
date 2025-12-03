/* 
  Endpoint: GET /posts/:postId/comments?sortBy=newest|oldest|popular
                                       -> newly added          
*/

import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Comment, Pagination } from '@/types/api';

export const getPostComments = ({
  postId,
  page = 1,
  sortBy = 'newest',
}: {
  postId: number;
  page?: number;
  sortBy?: 'newest' | 'oldest' | 'popular';
}): Promise<{ data: Comment[]; meta: Pagination }> => {
  return api.get(`/posts/${postId}/comments`, {
    params: {
      postId,
      page,
      sortBy,
    },
  });
};

export const getInfinitePostCommentsQueryOptions = (
  postId: number,
  sortBy: 'newest' | 'oldest' | 'popular',
) => {
  return infiniteQueryOptions({
    queryKey: ['post-comments', postId, sortBy],
    queryFn: ({ pageParam = 1 }) => {
      return getPostComments({ postId, page: pageParam as number, sortBy });
    },
    getNextPageParam: (lastPage) => {
      if (lastPage?.meta?.page === lastPage?.meta?.total) return undefined;
      const nextPage = lastPage.meta.page + 1;
      return nextPage;
    },
    initialPageParam: 1,
  });
};

type UseCommentsOptions = {
  postId: number;
  page?: number;
  sortBy?: 'newest' | 'oldest' | 'popular';
  queryConfig?: QueryConfig<typeof getPostComments>;
};

export const useInfinitePostComments = ({
  postId,
  sortBy = 'newest',
}: UseCommentsOptions) => {
  return useInfiniteQuery({
    ...getInfinitePostCommentsQueryOptions(postId, sortBy),
  });
};
