import { Bell, BellOff, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

import { useUserNotifications } from '../api/get-user-notifications';
import { useMarkAllNotificationsAsRead } from '../api/mark-all-notifications';
import { useNotifications } from '../stores/notifications-store';

import { NotificationItem } from './notification-item';

export const NotificationsList = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { resetUnreadCount } = useNotifications();

  const { data, isLoading, error } = useUserNotifications({
    page,
    limit,
  });

  // Reset unread count when component mounts (user viewing notifications page)
  useEffect(() => {
    resetUnreadCount();
  }, [resetUnreadCount]);

  const markAllAsRead = useMarkAllNotificationsAsRead();

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate(undefined, {
      onSuccess: () => {
        console.log('All notifications marked as read');
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3 text-gray-500">
        <BellOff className="size-12" />
        <p className="text-center">Failed to load notifications</p>
        <p className="text-sm text-gray-400">Please try again later</p>
      </div>
    );
  }

  const notifications = data?.data || [];
  const pagination = data?.pagination;
  const hasUnread = notifications.some((n) => !n.isRead);

  if (notifications.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3 text-gray-500">
        <Bell className="size-12" />
        <p className="text-center font-medium">No notifications yet</p>
        <p className="text-sm text-gray-400">
          You&apos;ll be notified when someone interacts with your posts
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Mark All as Read */}
      <div className="flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-2">
          <Bell className="size-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
          {hasUnread && (
            <span className="rounded-full bg-blue-500 px-2 py-0.5 text-xs font-semibold text-white">
              New
            </span>
          )}
        </div>
        {hasUnread && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAllAsRead}
            isLoading={markAllAsRead.isPending}
            icon={<Check className="size-4" />}
          >
            Mark all as read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.total > 1 && (
        <div className="flex items-center justify-between border-t pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>

          <span className="text-sm text-gray-600">
            Page {pagination.page} of {pagination.total}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={!pagination.nextUrl}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
