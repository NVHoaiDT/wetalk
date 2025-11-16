import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

import { NotificationSetting } from './get-notification-settings';

export const updateNotificationSettingInputSchema = z.object({
  id: z.number(),
  isPush: z.boolean().optional(),
  isSendMail: z.boolean().optional(),
});

export type UpdateNotificationSettingInput = z.infer<
  typeof updateNotificationSettingInputSchema
>;

export const updateNotificationSettings = ({
  data,
}: {
  data: UpdateNotificationSettingInput;
}): Promise<NotificationSetting> => {
  return api.patch(`/users/notification-settings`, data);
};

type UseUpdateNotificationSettingsOptions = {
  mutationConfig?: MutationConfig<typeof updateNotificationSettings>;
};

export const useUpdateNotificationSettings = ({
  mutationConfig,
}: UseUpdateNotificationSettingsOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ['notification-settings'],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateNotificationSettings,
  });
};
