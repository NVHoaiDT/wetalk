import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { apiAcademy } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { QuizSubmission } from '@/types/api';

export const submitQuizInputSchema = z.object({
  quizId: z.string().min(1, 'Quiz ID is required'),
  answers: z.array(z.string()),
  totalTime: z.number().min(0, 'Total time must be non-negative'),
});

export type SubmitQuizInput = z.infer<typeof submitQuizInputSchema>;

export const submitQuiz = ({
  data,
}: {
  data: SubmitQuizInput;
}): Promise<{ data: QuizSubmission }> => {
  return apiAcademy.post('/quizzes/submit', data);
};

type UseSubmitQuizOptions = {
  mutationConfig?: MutationConfig<typeof submitQuiz>;
};

export const useSubmitQuiz = ({ mutationConfig }: UseSubmitQuizOptions) => {
  return useMutation({
    ...mutationConfig,
    mutationFn: submitQuiz,
  });
};
