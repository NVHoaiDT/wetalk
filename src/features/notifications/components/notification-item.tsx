import { formatDistanceToNow } from 'date-fns';
import {
  ArrowBigDown,
  ArrowBigUp,
  MessageSquare,
  MessageCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router';

import { paths } from '@/config/paths';
import { Notification } from '@/types/api';
import { cn } from '@/utils/cn';

import { useMarkNotificationAsRead } from '../api/mark-notification';

type NotificationItemProps = {
  notification: Notification;
};

export const NotificationItem = ({ notification }: NotificationItemProps) => {
  const navigate = useNavigate();
  const markAsRead = useMarkNotificationAsRead();

  const handleClick = () => {
    // Mark as read if unread
    if (!notification.isRead) {
      markAsRead.mutate({ notificationId: notification.id });
    }

    // Navigate based on action type
    const { action, payload } = notification;

    if (action === 'get_post_vote' || action === 'get_post_new_comment') {
      if (payload.postId) {
        navigate(paths.app.post.getHref(payload.postId.toString()));
      }
    } else if (
      action === 'get_comment_vote' ||
      action === 'get_comment_reply'
    ) {
      if (payload.postId) {
        navigate(paths.app.post.getHref(payload.postId.toString()));
      }
    }
  };

  const getIcon = () => {
    const { action, payload } = notification;

    const iconClasses = 'size-5 shrink-0';

    switch (action) {
      case 'get_post_vote':
        return payload.voteType ? (
          <ArrowBigUp className={cn(iconClasses, 'text-orange-500')} />
        ) : (
          <ArrowBigDown className={cn(iconClasses, 'text-blue-500')} />
        );
      case 'get_comment_vote':
        return payload.voteType ? (
          <ArrowBigUp className={cn(iconClasses, 'text-orange-500')} />
        ) : (
          <ArrowBigDown className={cn(iconClasses, 'text-blue-500')} />
        );
      case 'get_post_new_comment':
        return <MessageSquare className={cn(iconClasses, 'text-green-500')} />;
      case 'get_comment_reply':
        return <MessageCircle className={cn(iconClasses, 'text-purple-500')} />;
      default:
        return <MessageSquare className={cn(iconClasses, 'text-gray-500')} />;
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-all',
        'hover:bg-gray-50 hover:shadow-sm',
        notification.isRead
          ? 'border-gray-200 bg-white'
          : 'border-blue-200 bg-blue-50',
      )}
    >
      {/* Icon */}
      <div className="mt-0.5">{getIcon()}</div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              'text-sm leading-relaxed',
              notification.isRead
                ? 'text-gray-700'
                : 'font-medium text-gray-900',
            )}
          >
            {notification.body}
          </p>
          {!notification.isRead && (
            <span className="mt-1 size-2 shrink-0 rounded-full bg-blue-500" />
          )}
        </div>

        <span className="mt-1 block text-xs text-gray-500">
          {formatDistanceToNow(new Date(notification.createdAt), {
            addSuffix: true,
          })}
        </span>
      </div>
    </button>
  );
};
