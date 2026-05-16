import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiAcademy } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

import { getContentQueryOptions } from './get-content';

export const deleteContent = ({
  lessonSlug,
}: {
  lessonSlug: string;
}): Promise<{ success: boolean; message: string }> => {
  return apiAcademy.delete(`/lessons/${lessonSlug}/content`);
};

type UseDeleteContentOptions = {
  lessonSlug: string;
  mutationConfig?: MutationConfig<typeof deleteContent>;
};

export const useDeleteContent = ({
  lessonSlug,
  mutationConfig,
}: UseDeleteContentOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: getContentQueryOptions(lessonSlug).queryKey,
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: deleteContent,
  });
};
