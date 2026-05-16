import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { apiAcademy } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

import { getLessonsQueryOptions } from './get-lessons';

export const createLessonInputSchema = z.object({
  topicSlug: z.string().min(1, 'Topic slug is required'),
  title: z.string().min(1, 'Title is required'),
  orderIndex: z.number().min(1, 'Order index must be at least 1'),
});

export type CreateLessonInput = z.infer<typeof createLessonInputSchema>;

export const createLesson = ({
  data,
}: {
  data: CreateLessonInput;
}): Promise<{ success: boolean; message: string }> => {
  return apiAcademy.post('/lessons', data);
};

type UseCreateLessonOptions = {
  topicSlug: string;
  mutationConfig?: MutationConfig<typeof createLesson>;
};

export const useCreateLesson = ({
  topicSlug,
  mutationConfig,
}: UseCreateLessonOptions) => {
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
    mutationFn: createLesson,
  });
};
