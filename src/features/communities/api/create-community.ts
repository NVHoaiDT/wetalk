import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { CreateCommunityResponse } from '@/types/api';

import { getInfiniteCommunitiesQueryOptions } from './get-communities';

export const createCommunityInputSchema = z.object({
  name: z.string().min(1, 'Required'),
  shortDescription: z.string().min(1, 'Required'),
  isPrivate: z.boolean(),
  topics: z.array(z.string()).optional(),
});

export type CreateCommunityInput = z.infer<typeof createCommunityInputSchema>;

export const createCommunity = ({
  data,
}: {
  data: CreateCommunityInput;
}): Promise<CreateCommunityResponse> => {
  return api.post(`/communities`, data);
};

type UseCreateCommunityOptions = {
  mutationConfig?: MutationConfig<typeof createCommunity>;
};

export const useCreateCommunity = ({
  mutationConfig,
}: UseCreateCommunityOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getInfiniteCommunitiesQueryOptions({}).queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createCommunity,
  });
};
