import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { apiAcademy } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

import { getInfiniteTopicsQueryOptions } from './get-topics';

export const createTopicInputSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  author: z.object({
    userId: z.number(),
    avatar: z.string().optional(),
    name: z.string().min(1, 'Author name is required'),
  }),
});

export type CreateTopicInput = z.infer<typeof createTopicInputSchema>;

export const createTopic = ({
  data,
}: {
  data: CreateTopicInput;
}): Promise<{ success: boolean; message: string }> => {
  return apiAcademy.post('/topics', data);
};

type UseCreateTopicOptions = {
  mutationConfig?: MutationConfig<typeof createTopic>;
};

export const useCreateTopic = ({ mutationConfig }: UseCreateTopicOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: getInfiniteTopicsQueryOptions().queryKey,
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: createTopic,
  });
};
