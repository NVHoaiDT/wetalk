import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { apiAcademy } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { Judge0Result } from '@/types/api';

export const submitCodeInputSchema = z.object({
  source_code: z.string().min(1, 'Source code is required'),
  language_id: z.number().min(1, 'Language ID is required'),
  stdin: z.string().optional(),
  expected_output: z.string().optional(),
});

export type SubmitCodeInput = z.infer<typeof submitCodeInputSchema>;

export const submitCode = ({
  data,
}: {
  data: SubmitCodeInput;
}): Promise<{ data: Judge0Result }> => {
  return apiAcademy.post('/judge0/submit', data);
};

type UseSubmitCodeOptions = {
  mutationConfig?: MutationConfig<typeof submitCode>;
};

export const useSubmitCode = ({ mutationConfig }: UseSubmitCodeOptions) => {
  return useMutation({
    ...mutationConfig,
    mutationFn: submitCode,
  });
};
