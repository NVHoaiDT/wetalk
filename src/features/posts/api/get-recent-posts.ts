import { queryOptions, useQuery } from '@tanstack/react-query';

import { QueryConfig } from '@/lib/react-query';
import { RecentPost } from '@/types/api';

export const getRecentPosts = (): Promise<RecentPost[]> => {
  return new Promise((resolve) => {
    const STORAGE_KEY = 'recent-posts';

    // Get recent posts from localStorage
    const existingData = localStorage.getItem(STORAGE_KEY);
    const recentPosts: RecentPost[] = existingData
      ? JSON.parse(existingData)
      : [];

    resolve(recentPosts);
  });
};

export const getRecentPostsQueryOptions = () => {
  return queryOptions({
    queryKey: ['recent-posts'],
    queryFn: () => getRecentPosts(),
  });
};

type UseRecentPostsOptions = {
  queryConfig?: QueryConfig<typeof getRecentPostsQueryOptions>;
};

export const useRecentPosts = ({ queryConfig }: UseRecentPostsOptions = {}) => {
  return useQuery({
    ...getRecentPostsQueryOptions(),
    ...queryConfig,
  });
};
