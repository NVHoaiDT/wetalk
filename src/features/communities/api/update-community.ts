import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { Community } from '@/types/api';

import { getCommunityQueryOptions } from './get-community';

export const updateCommunityInputSchema = z.object({
  name: z.string().min(1, 'Required'),
  shortDescription: z.string().min(1, 'Required'),
  description: z.string().min(1, 'Required'),
  communityAvatar: z.string().url().optional(),

  /* Added cover image */
  coverImage: z.string().url().optional(),
  isPrivate: z.boolean(),
});

export type UpdateCommunityInput = z.infer<typeof updateCommunityInputSchema>;

export const updateCommunity = ({
  data,
  communityId,
}: {
  data: UpdateCommunityInput;
  communityId: number;
}): Promise<Community> => {
  return api.put(`/communities/${communityId}`, data);
};

type UseUpdateCommunityOptions = {
  mutationConfig?: MutationConfig<typeof updateCommunity>;
};

export const useUpdateCommunity = ({
  mutationConfig,
}: UseUpdateCommunityOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.refetchQueries({
        queryKey: getCommunityQueryOptions(data.id).queryKey,
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: updateCommunity,
  });
};
