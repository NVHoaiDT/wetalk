import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiAcademy } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

import { getQuizzesByLessonQueryOptions } from './get-quizzes';

export const deleteQuiz = ({
  id,
}: {
  id: string;
}): Promise<{ success: boolean; message: string }> => {
  return apiAcademy.delete(`/quizzes/${id}`);
};

type UseDeleteQuizOptions = {
  lessonSlug: string;
  mutationConfig?: MutationConfig<typeof deleteQuiz>;
};

export const useDeleteQuiz = ({
  lessonSlug,
  mutationConfig,
}: UseDeleteQuizOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: getQuizzesByLessonQueryOptions(lessonSlug).queryKey,
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: deleteQuiz,
  });
};
