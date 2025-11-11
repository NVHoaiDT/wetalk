import { useMutation, useQueryClient } from '@tanstack/react-query';

import { MutationConfig } from '@/lib/react-query';

const STORAGE_KEY = 'recent-searches';

export const clearRecentSearches = (): Promise<void> => {
  return new Promise((resolve) => {
    localStorage.removeItem(STORAGE_KEY);
    resolve();
  });
};

type UseClearRecentSearchesOptions = {
  mutationConfig?: MutationConfig<typeof clearRecentSearches>;
};

export const useClearRecentSearches = ({
  mutationConfig,
}: UseClearRecentSearchesOptions = {}) => {
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
    mutationFn: clearRecentSearches,
  });
};
