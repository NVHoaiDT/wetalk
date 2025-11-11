/* 
{
  keyword: string;
  searchAt: string;
}
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { MutationConfig } from '@/lib/react-query';
import { RecentSearch } from '@/types/api';

export const addRecentSearchInputSchema = z.object({
  keyword: z.string(),
  searchAt: z.string(),
});

export type AddRecentSearchInput = z.infer<typeof addRecentSearchInputSchema>;

export const addRecentSearch = ({
  data,
}: {
  data: AddRecentSearchInput;
}): Promise<RecentSearch> => {
  return new Promise((resolve) => {
    /*
       Instead of call api as usual, we put the data into local storage
       Should store only 5 recent searches (the most recent ones, new items push out old ones)     
    */
    const STORAGE_KEY = 'recent-searches';
    const MAX_RECENT = 5;

    // Get existing recent searches from localStorage
    const existingData = localStorage.getItem(STORAGE_KEY);
    let recentSearches: RecentSearch[] = existingData
      ? JSON.parse(existingData)
      : [];

    // Remove the search if it already exists (to re-add it at the front)
    recentSearches = recentSearches.filter(
      (search) => search.keyword !== data.keyword,
    );

    // Add the new search at the beginning
    recentSearches.unshift(data);

    // Keep only the most recent MAX_RECENT searches
    if (recentSearches.length > MAX_RECENT) {
      recentSearches = recentSearches.slice(0, MAX_RECENT);
    }

    // Save back to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentSearches));

    resolve(data);
  });
};

type UseAddRecentSearchOptions = {
  mutationConfig?: MutationConfig<typeof addRecentSearch>;
};

export const useAddRecentSearch = ({
  mutationConfig,
}: UseAddRecentSearchOptions = {}) => {
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
    mutationFn: addRecentSearch,
  });
};
