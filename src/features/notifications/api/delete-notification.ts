import { useMutation, useQueryClient } from '@tanstack/react-query';
import z from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

export const deleteNotificationInputSchema = z.object({
  notificationId: z.number(),
});

export type DeleteNotificationInput = z.infer<
  typeof deleteNotificationInputSchema
>;

export const deleteNotification = ({
  notificationId,
}: DeleteNotificationInput) => {
  return api.delete(`/notifications/${notificationId}`);
};

type UseDeleteNotificationOptions = {
  mutationConfig?: MutationConfig<typeof deleteNotification>;
};

export const useDeleteNotification = ({
  mutationConfig,
}: UseDeleteNotificationOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: deleteNotification,
  });
};
