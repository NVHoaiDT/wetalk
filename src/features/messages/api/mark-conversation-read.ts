import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

export const markConversationAsRead = (
  conversationId: number,
): Promise<{ success: boolean; message: string }> => {
  return api.patch(`/messages/conversations/${conversationId}/read`);
};

type UseMarkConversationAsReadOptions = {
  mutationConfig?: MutationConfig<typeof markConversationAsRead>;
};

export const useMarkConversationAsRead = ({
  mutationConfig,
}: UseMarkConversationAsReadOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: markConversationAsRead,
    onSuccess: (...args) => {
      // Invalidate conversations to update unread count
      queryClient.invalidateQueries({
        queryKey: ['conversations'],
      });

      onSuccess?.(...args);
    },
    ...restConfig,
  });
};
