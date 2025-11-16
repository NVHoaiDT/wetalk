import { useQuery } from '@tanstack/react-query';

import { QueryConfig } from '@/lib/react-query';
import { Preference } from '@/types/api';

const STORAGE_KEY = 'user-preferences';

const defaultPreferences: Preference = {
  language: 'en-US',
  isStoreRecentPosts: true,
  isStoreRecentCommunities: true,
  autoplayMedia: false,
};

export const getPreferences = (): Promise<Preference> => {
  return new Promise((resolve) => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        resolve(parsed);
      } catch {
        // If parsing fails, return defaults
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPreferences));
        resolve(defaultPreferences);
      }
    } else {
      // Initialize with defaults
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPreferences));
      resolve(defaultPreferences);
    }
  });
};

type UsePreferencesOptions = {
  queryConfig?: QueryConfig<typeof getPreferences>;
};

export const usePreferences = ({ queryConfig }: UsePreferencesOptions = {}) => {
  return useQuery({
    queryKey: ['preferences'],
    queryFn: getPreferences,
    ...queryConfig,
  });
};
