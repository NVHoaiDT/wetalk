/* 
    Endpoint: PATCH /communities/:id/requires-member-approval
    Body: {
        "requiresMemberApproval": true/false
    }
    Response: {
        "success": true,
        "message": "Requires member approval updated successfully"
    }
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import z from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

import { getCommunityMembersQueryOptions } from './get-community-members';

export const toggleApprovalMemberInput = z.object({
  communityId: z.number(),
  requiresMemberApproval: z.boolean(),
});

export type ToggleApprovalMemberInput = z.infer<
  typeof toggleApprovalMemberInput
>;

export const toggleApprovalMember = ({
  communityId,
  requiresMemberApproval,
}: ToggleApprovalMemberInput) => {
  return api.patch(`/communities/${communityId}/requires-member-approval`, {
    requiresMemberApproval,
  });
};

export type UseToggleApprovalMemberOptions = {
  communityId: number;
  mutationConfig?: MutationConfig<typeof toggleApprovalMember>;
};

export const useToggleApprovalMember = ({
  communityId,
  mutationConfig,
}: UseToggleApprovalMemberOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: getCommunityMembersQueryOptions({ communityId }).queryKey,
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: toggleApprovalMember,
  });
};
