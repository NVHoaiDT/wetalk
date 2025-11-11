/* 
    Mark notifications with `id` as read.

    Endpoint: `PATCH /notifications/:id/read`

    Respone example:
    ```
    {
        "success": true,
        "message": "Notification marked as read"
    }
    ```
*/

import { useMutation, useQueryClient } from '@tanstack/react-query';
import z from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

export const markNotificationInputSchema = z.object({
  notificationId: z.number(),
});

export type MarkNotificationInput = z.infer<typeof markNotificationInputSchema>;

export const markNotification = ({
  notificationId,
}: MarkNotificationInput): Promise<{ success: boolean; message: string }> => {
  return api.patch(`/notifications/${notificationId}/read`);
};

type UseMarkNotificationAsReadOptions = {
  mutationConfig?: MutationConfig<typeof markNotification>;
};

export const useMarkNotificationAsRead = ({
  mutationConfig,
}: UseMarkNotificationAsReadOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: markNotification,
  });
};
