import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { apiAcademy } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

import { getQuizQueryOptions } from './get-quiz';

const questionSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  point: z.number().min(1, 'Point must be at least 1'),
  options: z.array(z.string()).min(2, 'At least 2 options are required'),
  correctAnswer: z.string().min(1, 'Correct answer is required'),
});

export const updateQuizInputSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  questions: z
    .array(questionSchema)
    .min(1, 'At least one question is required'),
  timeLimit: z.number().min(1, 'Time limit must be at least 1 minute'),
});

export type UpdateQuizInput = z.infer<typeof updateQuizInputSchema>;

export const updateQuiz = ({
  id,
  data,
}: {
  id: string;
  data: UpdateQuizInput;
}): Promise<{ success: boolean; message: string }> => {
  return apiAcademy.put(`/quizzes/${id}`, data);
};

type UseUpdateQuizOptions = {
  quizId: string;
  mutationConfig?: MutationConfig<typeof updateQuiz>;
};

export const useUpdateQuiz = ({
  quizId,
  mutationConfig,
}: UseUpdateQuizOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: getQuizQueryOptions(quizId).queryKey,
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: updateQuiz,
  });
};
