import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { QueryConfig } from '@/lib/react-query';

export const preferencesSchema = z.object({
  language: z.string().default('en-US'),
  showRecentPosts: z.boolean().default(true),
  showRecentCommunities: z.boolean().default(true),
  autoplayMedia: z.boolean().default(false),
  reduceMotion: z.boolean().default(false),
});

export type Preferences = z.infer<typeof preferencesSchema>;

const STORAGE_KEY = 'user-preferences';

const defaultPreferences: Preferences = {
  language: 'en-US',
  showRecentPosts: true,
  showRecentCommunities: true,
  autoplayMedia: false,
  reduceMotion: false,
};

export const getPreferences = (): Promise<Preferences> => {
  return new Promise((resolve) => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const validated = preferencesSchema.parse(parsed);
        resolve(validated);
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
