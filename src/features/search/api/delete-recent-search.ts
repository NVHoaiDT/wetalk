import { useMutation, useQueryClient } from '@tanstack/react-query';

import { MutationConfig } from '@/lib/react-query';
import { RecentSearch } from '@/types/api';

const STORAGE_KEY = 'recent-searches';

export const deleteRecentSearch = ({
  keyword,
}: {
  keyword: string;
}): Promise<void> => {
  return new Promise((resolve) => {
    const existingData = localStorage.getItem(STORAGE_KEY);
    let recentSearches: RecentSearch[] = existingData
      ? JSON.parse(existingData)
      : [];

    // Filter out the search with the matching keyword
    recentSearches = recentSearches.filter(
      (search) => search.keyword !== keyword,
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentSearches));
    resolve();
  });
};

type UseDeleteRecentSearchOptions = {
  mutationConfig?: MutationConfig<typeof deleteRecentSearch>;
};

export const useDeleteRecentSearch = ({
  mutationConfig,
}: UseDeleteRecentSearchOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ['recent-searches'],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteRecentSearch,
  });
};
