import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { apiAcademy } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

import { getLessonQueryOptions } from './get-lesson';
import { getLessonsQueryOptions } from './get-lessons';

export const updateLessonInputSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  orderIndex: z.number().min(1, 'Order index must be at least 1'),
});

export type UpdateLessonInput = z.infer<typeof updateLessonInputSchema>;

export const updateLesson = ({
  slug,
  data,
}: {
  slug: string;
  data: UpdateLessonInput;
}): Promise<{ success: boolean; message: string }> => {
  return apiAcademy.put(`/lessons/${slug}`, data);
};

type UseUpdateLessonOptions = {
  lessonSlug: string;
  topicSlug: string;
  mutationConfig?: MutationConfig<typeof updateLesson>;
};

export const useUpdateLesson = ({
  lessonSlug,
  topicSlug,
  mutationConfig,
}: UseUpdateLessonOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: getLessonQueryOptions(lessonSlug).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: getLessonsQueryOptions(topicSlug).queryKey,
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: updateLesson,
  });
};
