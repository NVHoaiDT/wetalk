import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Comment, Pagination } from '@/types/api';

export const getPostComments = ({
  postId,
  page = 1,
}: {
  postId: number;
  page?: number;
}): Promise<{ data: Comment[]; meta: Pagination }> => {
  return api.get(`/posts/${postId}/comments`, {
    params: {
      postId,
      page,
    },
  });
};

export const getInfinitePostCommentsQueryOptions = (postId: number) => {
  return infiniteQueryOptions({
    queryKey: ['post-comments', postId],
    queryFn: ({ pageParam = 1 }) => {
      return getPostComments({ postId, page: pageParam as number });
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
  queryConfig?: QueryConfig<typeof getPostComments>;
};

export const useInfinitePostComments = ({ postId }: UseCommentsOptions) => {
  return useInfiniteQuery({
    ...getInfinitePostCommentsQueryOptions(postId),
  });
};
