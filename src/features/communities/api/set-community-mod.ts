/* 
    Endpoint: PUT `/communities/:id/moderators/:userId`
    Body:
    {
        "role": "admin"
    }
*/

import { useQueryClient, useMutation } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

export const setCommunityMod = ({
  communityId,
  userId,
  role,
}: {
  communityId: number;
  userId: number;
  role: 'admin' | 'user';
}) => {
  return api.put(`/communities/${communityId}/moderators/${userId}`, {
    role,
  });
};

type UseSetCommunityModOptions = {
  mutationConfig?: MutationConfig<typeof setCommunityMod>;
};

export const useSetCommunityMod = ({
  mutationConfig,
}: UseSetCommunityModOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      // Invalidate community-members query to refetch the updated members list
      queryClient.invalidateQueries({ queryKey: ['community-members'] });
      // Also invalidate community query to update moderators list
      queryClient.invalidateQueries({ queryKey: ['communitiy'] });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: setCommunityMod,
  });
};
