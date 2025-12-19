/* 
Endpoint: `PATCH /communities/:id/manage/subscriptions/:userId/status`
BODY: 
    { 
        status: 'approved' | 'banned' 
    }
RESPONSE: 
    {
        "success": true,
        "message": "Subscription status updated successfully"
    }
}        
*/

import { useMutation, useQueryClient } from '@tanstack/react-query';
import z from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

import { getCommunityMembersQueryOptions } from './get-community-members';

export const approveMemberInputSchema = z.object({
  communityId: z.number(),
  userId: z.number(),
  status: z.enum(['approved', 'rejected']),
});

export type ApproveMemberInput = z.infer<typeof approveMemberInputSchema>;

export const approveMember = ({
  communityId,
  userId,
  status,
}: ApproveMemberInput) => {
  return api.patch(
    `/communities/${communityId}/manage/subscriptions/${userId}/status`,
    {
      status,
    },
  );
};

type UseApproveMemberOptions = {
  communityId: number;
  mutationConfig?: MutationConfig<typeof approveMember>;
};

export const useApproveMember = ({
  communityId,
  mutationConfig,
}: UseApproveMemberOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: getCommunityMembersQueryOptions({ communityId }).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: ['community-members'],
      });

      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: approveMember,
  });
};
