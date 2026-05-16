import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiAcademy } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

import { getInfiniteTopicsQueryOptions } from './get-topics';

export const deleteTopic = ({
  slug,
}: {
  slug: string;
}): Promise<{ success: boolean; message: string }> => {
  return apiAcademy.delete(`/topics/${slug}`);
};

type UseDeleteTopicOptions = {
  mutationConfig?: MutationConfig<typeof deleteTopic>;
};

export const useDeleteTopic = ({ mutationConfig }: UseDeleteTopicOptions) => {
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
    mutationFn: deleteTopic,
  });
};
