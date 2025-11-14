/* 
    Endpoint: PATCH /communities/:id/requires-post-approval
    Body: {
        "requiresPostApproval": true/false
    }
    Response: {
        "success": true,
        "message": "Requires approval updated successfully"
    }
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import z from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

import { getInfiniteCommunityPostsQueryOptions } from './get-community-posts';

export const toggleApprovalPostInput = z.object({
  communityId: z.number(),
  requiresPostApproval: z.boolean(),
});

export type ToggleApprovalPostInput = z.infer<typeof toggleApprovalPostInput>;

export const toggleApprovalPost = ({
  communityId,
  requiresPostApproval,
}: ToggleApprovalPostInput) => {
  return api.patch(`/communities/${communityId}/requires-post-approval`, {
    requiresPostApproval,
  });
};

type UseToggleApprovalPostOptions = {
  communityId: number;
  mutationConfig?: MutationConfig<typeof toggleApprovalPost>;
};

export const useToggleApprovalPost = ({
  communityId,
  mutationConfig,
}: UseToggleApprovalPostOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: getInfiniteCommunityPostsQueryOptions({ communityId })
          .queryKey,
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: toggleApprovalPost,
  });
};
