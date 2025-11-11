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
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-gray-500">
        <div className="rounded-full bg-gray-100 p-6">
          <Bell className="size-16 text-gray-400" />
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">
            No notifications yet
          </p>
          <p className="mt-1 text-sm text-gray-500">
            You&apos;ll be notified when someone interacts with your posts
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Mark All as Read */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-100 p-2">
            <Bell className="size-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
            {hasUnread && (
              <p className="text-sm text-gray-500">
                You have {notifications.filter((n) => !n.isRead).length} unread
                notification
                {notifications.filter((n) => !n.isRead).length > 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
        {hasUnread && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            isLoading={markAllAsRead.isPending}
            icon={<Check className="size-4" />}
            className="shadow-sm"
          >
            Mark all as read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.total > 1 && (
        <div className="flex items-center justify-between border-t pt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="min-w-[100px]"
          >
            Previous
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">
              Page {pagination.page}
            </span>
            <span className="text-sm text-gray-500">of</span>
            <span className="text-sm font-medium text-gray-700">
              {pagination.total}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={!pagination.nextUrl}
            className="min-w-[100px]"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
