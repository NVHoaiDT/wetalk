import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiAcademy } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

import { getLessonsQueryOptions } from './get-lessons';

export const deleteLesson = ({
  slug,
}: {
  slug: string;
}): Promise<{ success: boolean; message: string }> => {
  return apiAcademy.delete(`/lessons/${slug}`);
};

type UseDeleteLessonOptions = {
  topicSlug: string;
  mutationConfig?: MutationConfig<typeof deleteLesson>;
};

export const useDeleteLesson = ({
  topicSlug,
  mutationConfig,
}: UseDeleteLessonOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: getLessonsQueryOptions(topicSlug).queryKey,
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: deleteLesson,
  });
};
