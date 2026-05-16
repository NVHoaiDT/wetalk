import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { apiAcademy } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

import { getQuizzesByLessonQueryOptions } from './get-quizzes';

const questionSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  point: z.number().min(1, 'Point must be at least 1'),
  options: z.array(z.string()).min(2, 'At least 2 options are required'),
  correctAnswer: z.string().min(1, 'Correct answer is required'),
});

export const createQuizInputSchema = z.object({
  lessonSlug: z.string().min(1, 'Lesson slug is required'),
  title: z.string().min(1, 'Title is required'),
  questions: z
    .array(questionSchema)
    .min(1, 'At least one question is required'),
  timeLimit: z.number().min(1, 'Time limit must be at least 1 minute'),
});

export type CreateQuizInput = z.infer<typeof createQuizInputSchema>;

export const createQuiz = ({
  data,
}: {
  data: CreateQuizInput;
}): Promise<{ success: boolean; message: string }> => {
  return apiAcademy.post('/quizzes', data);
};

type UseCreateQuizOptions = {
  lessonSlug: string;
  mutationConfig?: MutationConfig<typeof createQuiz>;
};

export const useCreateQuiz = ({
  lessonSlug,
  mutationConfig,
}: UseCreateQuizOptions) => {
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
    mutationFn: createQuiz,
  });
};
