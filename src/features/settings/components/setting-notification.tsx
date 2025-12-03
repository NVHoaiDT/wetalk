import { Bell, Mail, MessageCircle, ThumbsUp, UserPlus } from 'lucide-react';

import { Switch } from '@/components/ui/form/switch';
import { Spinner } from '@/components/ui/spinner';
import { useNotificationSettings } from '@/features/settings/api/get-notification-settings';
import { useUpdateNotificationSettings } from '@/features/settings/api/update-notification-settings';
import { fancyLog } from '@/helper/fancy-log';

const NOTIFICATION_ACTION_LABELS: Record<
  string,
  { label: string; icon: any; description: string }
> = {
  get_post_vote: {
    label: 'Post votes',
    icon: ThumbsUp,
    description: 'When someone votes on your post',
  },
  get_post_new_comment: {
    label: 'Post comments',
    icon: MessageCircle,
    description: 'When someone comments on your post',
  },
  get_comment_vote: {
    label: 'Comment votes',
    icon: ThumbsUp,
    description: 'When someone votes on your comment',
  },
  get_comment_reply: {
    label: 'Comment replies',
    icon: MessageCircle,
    description: 'When someone replies to your comment',
  },
  get_new_follower: {
    label: 'New followers',
    icon: UserPlus,
    description: 'When someone follows you',
  },
  post_approved: {
    label: 'Post approved',
    icon: UserPlus,
    description: 'When your post is approved by a moderator',
  },
  post_rejected: {
    label: 'Post rejected',
    icon: UserPlus,
    description: 'When your post is rejected by a moderator',
  },
  post_deleted: {
    label: 'Post deleted',
    icon: UserPlus,
    description: 'When your post is deleted by a moderator',
  },
  post_reported: {
    label: 'Post reported',
    icon: UserPlus,
    description: 'When your post is reported by a moderator',
  },
  subscription_approved: {
    label: 'Subscription approved',
    icon: UserPlus,
    description: 'When your join request is approved by a moderator',
  },
  subscription_rejected: {
    label: 'Subscription rejected',
    icon: UserPlus,
    description: 'When your join request is rejected by a moderator',
  },
};

export const SettingNotification = () => {
  const notificationSettingQuery = useNotificationSettings();
  const updateMutation = useUpdateNotificationSettings();

  const handleToggle = (
    action: string,
    field: 'isPush' | 'isSendMail',
    value: boolean,
  ) => {
    updateMutation.mutate({
      data: {
        action,
        [field]: value,
      },
    });
  };

  if (notificationSettingQuery.isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const settings = notificationSettingQuery?.data;
  fancyLog('Notification-settings:', settings);

  return (
    <div className="space-y-8">
      {/* Notification Settings Header */}
      <div className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Bell className="size-6 text-blue-600" />
          <div>
            <h3 className="font-bold text-gray-900">Notification Settings</h3>
            <p className="text-sm text-gray-600">
              Manage how you receive notifications
            </p>
          </div>
        </div>
      </div>

      {/* Notification Options */}
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4 border-b border-gray-200 pb-3">
          <div className="col-span-1" />
          <div className="flex items-center justify-center">
            <Bell className="mr-2 size-4 text-purple-600" />
            <span className="text-sm font-semibold text-gray-700">Push</span>
          </div>
          <div className="flex items-center justify-center">
            <Mail className="mr-2 size-4 text-orange-600" />
            <span className="text-sm font-semibold text-gray-700">Email</span>
          </div>
        </div>

        {settings?.map((setting) => {
          const config = NOTIFICATION_ACTION_LABELS[setting.action] || {
            label: setting.action,
            icon: Bell,
            description: '',
          };
          const Icon = config.icon;

          return (
            <div
              key={setting.id}
              className="grid grid-cols-3 items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md"
            >
              <div className="col-span-1 flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100">
                  <Icon className="size-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {config.label}
                  </p>
                  <p className="text-xs text-gray-500">{config.description}</p>
                </div>
              </div>
              <div className="flex justify-center">
                <Switch
                  checked={setting.isPush}
                  onCheckedChange={(checked) =>
                    handleToggle(setting.action, 'isPush', checked)
                  }
                  className="data-[state=checked]:bg-purple-600"
                />
              </div>
              <div className="flex justify-center">
                <Switch
                  checked={setting.isSendMail}
                  onCheckedChange={(checked) =>
                    handleToggle(setting.action, 'isSendMail', checked)
                  }
                  className="data-[state=checked]:bg-orange-600"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Box */}
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">💡 Tip:</span> You can customize
          notifications for different actions. Push notifications appear on your
          device, while email notifications are sent to your inbox.
        </p>
      </div>
    </div>
  );
};
