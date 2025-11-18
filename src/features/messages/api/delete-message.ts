/* 
    Endpoint: DELETE /messages/:messageId    
    Response: {
    "success": true,
    "message": "Message deleted successfully"
}
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

export const deleteMessage = (messageId: number) => {
  return api.delete(`/messages/${messageId}`);
};

type DeleteMessageOptions = {
  mutationConfig?: MutationConfig<typeof deleteMessage>;
};

export const useDeleteMessage = ({ mutationConfig }: DeleteMessageOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.refetchQueries({ queryKey: ['messages'] });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: deleteMessage,
  });
};
