import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { apiAcademy } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

import { getTopicQueryOptions } from './get-topic';
import { getInfiniteTopicsQueryOptions } from './get-topics';

export const updateTopicInputSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
});

export type UpdateTopicInput = z.infer<typeof updateTopicInputSchema>;

export const updateTopic = ({
  slug,
  data,
}: {
  slug: string;
  data: UpdateTopicInput;
}): Promise<{ success: boolean; message: string }> => {
  return apiAcademy.put(`/topics/${slug}`, data);
};

type UseUpdateTopicOptions = {
  slug: string;
  mutationConfig?: MutationConfig<typeof updateTopic>;
};

export const useUpdateTopic = ({
  slug,
  mutationConfig,
}: UseUpdateTopicOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: getTopicQueryOptions(slug).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: getInfiniteTopicsQueryOptions().queryKey,
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: updateTopic,
  });
};
