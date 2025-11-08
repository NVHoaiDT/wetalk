import { queryOptions, useQuery } from '@tanstack/react-query';

import { QueryConfig } from '@/lib/react-query';
import { RecentCommunity } from '@/types/api';

export const getRecentCommunities = (): Promise<RecentCommunity[]> => {
  return new Promise((resolve) => {
    const STORAGE_KEY = 'recent-communities';

    // Get recent communities from localStorage
    const existingData = localStorage.getItem(STORAGE_KEY);
    const recentCommunities: RecentCommunity[] = existingData
      ? JSON.parse(existingData)
      : [];

    resolve(recentCommunities);
  });
};

export const getRecentCommunitiesQueryOptions = () => {
  return queryOptions({
    queryKey: ['recent-communities'],
    queryFn: () => getRecentCommunities(),
  });
};

type UseRecentCommunitiesOptions = {
  queryConfig?: QueryConfig<typeof getRecentCommunitiesQueryOptions>;
};

export const useRecentCommunities = ({
  queryConfig,
}: UseRecentCommunitiesOptions = {}) => {
  return useQuery({
    ...getRecentCommunitiesQueryOptions(),
    ...queryConfig,
  });
};
