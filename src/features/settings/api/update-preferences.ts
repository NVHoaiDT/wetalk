import { useMutation, useQueryClient } from '@tanstack/react-query';

import { MutationConfig } from '@/lib/react-query';
import { Preference } from '@/types/api';

const STORAGE_KEY = 'user-preferences';

export type UpdatePreferencesInput = Partial<Preference>;

export const updatePreferences = ({
  data,
}: {
  data: UpdatePreferencesInput;
}): Promise<Preference> => {
  return new Promise((resolve) => {
    const stored = localStorage.getItem(STORAGE_KEY);
    let currentPreferences: Preference;

    if (stored) {
      currentPreferences = JSON.parse(stored);
    } else {
      currentPreferences = {
        language: 'en-US',
        isStoreRecentPosts: true,
        isStoreRecentCommunities: true,
        autoplayMedia: false,
      };
    }

    const updatedPreferences = { ...currentPreferences, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPreferences));
    resolve(updatedPreferences);
  });
};

type UseUpdatePreferencesOptions = {
  mutationConfig?: MutationConfig<typeof updatePreferences>;
};

export const useUpdatePreferences = ({
  mutationConfig,
}: UseUpdatePreferencesOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ['preferences'],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updatePreferences,
  });
};
