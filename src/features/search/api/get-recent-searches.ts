import { useQuery } from '@tanstack/react-query';

import { QueryConfig } from '@/lib/react-query';
import { RecentSearch } from '@/types/api';

const STORAGE_KEY = 'recent-searches';

export const getRecentSearches = (): Promise<RecentSearch[]> => {
  return new Promise((resolve) => {
    const existingData = localStorage.getItem(STORAGE_KEY);
    const recentSearches: RecentSearch[] = existingData
      ? JSON.parse(existingData)
      : [];
    resolve(recentSearches);
  });
};

type UseRecentSearchesOptions = {
  queryConfig?: QueryConfig<typeof getRecentSearches>;
};

export const useRecentSearches = ({
  queryConfig,
}: UseRecentSearchesOptions = {}) => {
  return useQuery({
    ...queryConfig,
    queryKey: ['recent-searches'],
    queryFn: getRecentSearches,
  });
};
