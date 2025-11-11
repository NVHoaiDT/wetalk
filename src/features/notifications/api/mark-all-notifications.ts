/* 
    Mark notifications with `id` as read.

    Endpoint: `PATCH /notifications/read-all`

    Respone example:
    ```
    {
        "success": true,
        "message": "All notifications marked as read successfully"
    }
    ```
*/

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

export const markAllNotifications = (): Promise<{
  success: boolean;
  message: string;
}> => {
  return api.patch('/notifications/read-all');
};

type UseMarkAllNotificationsAsReadOptions = {
  mutationConfig?: MutationConfig<typeof markAllNotifications>;
};

export const useMarkAllNotificationsAsRead = ({
  mutationConfig,
}: UseMarkAllNotificationsAsReadOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: markAllNotifications,
  });
};
