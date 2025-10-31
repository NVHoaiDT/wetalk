import { useQuery, queryOptions } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Post } from '@/types/api';

export const getPost = ({ id }: { id: number }): Promise<{ data: Post }> => {
  return api.get(`/posts/${id}`);
};

export const getPostQueryOptions = (id: number) => {
  return queryOptions({
    queryKey: ['posts', id],
    queryFn: () => getPost({ id }),
  });
};

type UsePostOptions = {
  id: number;
  queryConfig?: QueryConfig<typeof getPostQueryOptions>;
};

export const usePost = ({ id, queryConfig }: UsePostOptions) => {
  return useQuery({
    ...getPostQueryOptions(id),
    ...queryConfig,
  });
};
