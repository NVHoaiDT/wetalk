import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';

export const notificationSettingSchema = z.object({
  id: z.number(),
  action: z.string(),
  isPush: z.boolean(),
  isSendMail: z.boolean(),
});

export type NotificationSetting = z.infer<typeof notificationSettingSchema>;

export const notificationSettingsResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(notificationSettingSchema),
});

export const getNotificationSettings = (): Promise<NotificationSetting[]> => {
  return api.get('/users/notification-settings').then((response) => {
    const validated = notificationSettingsResponseSchema.parse(response);
    return validated.data;
  });
};

type UseNotificationSettingsOptions = {
  queryConfig?: QueryConfig<typeof getNotificationSettings>;
};

export const useNotificationSettings = ({
  queryConfig,
}: UseNotificationSettingsOptions = {}) => {
  return useQuery({
    queryKey: ['notification-settings'],
    queryFn: getNotificationSettings,
    ...queryConfig,
  });
};
