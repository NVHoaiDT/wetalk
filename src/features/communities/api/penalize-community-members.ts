/* 
    Enpoint: POST /communities/:id/manage/ban-user
    Body: 
    {
        "userId": 2,
        "restrictionType": "temporary_ban",
        "reason": "Please follow community guidelines",
        "expiresAt": "2025-12-15T00:00:00Z"  // only for temporary_ban
    }
    
    penalize type: temporary_ban | permanent_ban | warning
*/

import { useMutation, useQueryClient } from '@tanstack/react-query';
import z from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

export const penalizeCommunityMemberInput = z.object({
  userId: z.number(),
  restrictionType: z.enum(['temporary_ban', 'permanent_ban', 'warning']),
  reason: z.string().optional(),
  expiresAt: z.string().optional(),
});

export type PenalizeCommunityMemberInput = z.infer<
  typeof penalizeCommunityMemberInput
>;

export const penalizeCommunityMember = ({
  communityId,
  data,
}: {
  communityId: number;
  data: PenalizeCommunityMemberInput;
}): Promise<{ success: boolean; message: string }> => {
  return api.post(`/communities/${communityId}/manage/ban-user`, data);
};

type UsePenalizeCommunityMemberOptions = {
  communityId: number;
  mutationConfig?: MutationConfig<typeof penalizeCommunityMember>;
};

export const usePenalizeCommunityMember = ({
  communityId,
  mutationConfig,
}: UsePenalizeCommunityMemberOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ['community-members', communityId],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: penalizeCommunityMember,
  });
};
