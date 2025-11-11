import { formatDistanceToNow } from 'date-fns';
import {
  ArrowBigDown,
  ArrowBigUp,
  MessageSquare,
  MessageCircle,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  Archive,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { paths } from '@/config/paths';
import { Notification } from '@/types/api';
import { cn } from '@/utils/cn';

import { useDeleteNotification } from '../api/delete-notification';
import { useMarkNotificationAsRead } from '../api/mark-notification';

type NotificationItemProps = {
  notification: Notification;
};

export const NotificationItem = ({ notification }: NotificationItemProps) => {
  const navigate = useNavigate();
  const markAsRead = useMarkNotificationAsRead();
  const deleteNotification = useDeleteNotification();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleClick = () => {
    // Mark as read if unread
    if (!notification.isRead) {
      markAsRead.mutate({ notificationId: notification.id });
    }

    // Navigate based on action type
    const { action, payload } = notification;

    if (
      action === 'get_post_vote' ||
      action === 'get_post_new_comment' ||
      action === 'post_approved'
    ) {
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

  const getNotificationAssets = () => {
    const { action, payload } = notification;

    const iconClasses = 'size-5 shrink-0';

    switch (action) {
      case 'get_post_vote':
        return {
          description: payload.voteType
            ? 'Your post is resonating with the community! Keep up the great content.'
            : 'Someone disagreed with your post. Consider their perspective.',
          icon: payload.voteType ? (
            <ArrowBigUp
              className={cn(iconClasses, 'fill-orange-500 text-orange-500')}
            />
          ) : (
            <ArrowBigDown
              className={cn(iconClasses, 'fill-blue-500 text-blue-500')}
            />
          ),
          bgColor: payload.voteType ? 'bg-orange-50' : 'bg-blue-50',
          borderColor: payload.voteType
            ? 'border-orange-200'
            : 'border-blue-200',
        };
      case 'get_comment_vote':
        return {
          description: payload.voteType
            ? 'Your comment is making an impact! Others find your insights valuable.'
            : 'Your comment received a downvote. Every perspective matters.',
          icon: payload.voteType ? (
            <ArrowBigUp
              className={cn(iconClasses, 'fill-orange-500 text-orange-500')}
            />
          ) : (
            <ArrowBigDown
              className={cn(iconClasses, 'fill-blue-500 text-blue-500')}
            />
          ),
          bgColor: payload.voteType ? 'bg-orange-50' : 'bg-blue-50',
          borderColor: payload.voteType
            ? 'border-orange-200'
            : 'border-blue-200',
        };
      case 'get_post_new_comment':
        return {
          description:
            'Your post sparked a discussion! Check out what the community has to say.',
          icon: <MessageSquare className={cn(iconClasses, 'text-green-600')} />,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
        };
      case 'get_comment_reply':
        return {
          description:
            'Someone responded to your comment. Join the conversation and keep the dialogue going.',
          icon: (
            <MessageCircle className={cn(iconClasses, 'text-purple-600')} />
          ),
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
        };
      case 'post_approved':
        return {
          description:
            'Congratulations! Your post meets community guidelines and is now visible to everyone.',
          icon: (
            <CheckCircle2 className={cn(iconClasses, 'text-emerald-600')} />
          ),
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-200',
        };
      case 'post_deleted':
        return {
          description:
            'Your post was removed by moderators for violating community guidelines. Review the rules to understand why.',
          icon: <Trash2 className={cn(iconClasses, 'text-red-600')} />,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
        };
      case 'post_reported':
        return {
          description:
            'A community member reported your post. Moderators will review it to ensure it follows guidelines.',
          icon: <AlertTriangle className={cn(iconClasses, 'text-amber-600')} />,
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
        };
      default:
        return {
          description: 'You have a new notification from the community.',
          icon: <MessageSquare className={cn(iconClasses, 'text-gray-500')} />,
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
        };
    }
  };

  const { icon, bgColor, borderColor, description } = getNotificationAssets();

  // Parse the notification body to extract username and make it interactive
  const renderBody = () => {
    const { body } = notification;
    const { userName } = notification.payload;
    if (!userName) {
      return <span>{body}</span>;
    }

    // Split the body by username to make it hoverable
    const parts = body.split(userName);

    if (parts.length !== 2) {
      return <span>{body}</span>;
    }

    return (
      <span>
        {parts[0]}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (notification.payload.userId) {
              navigate(
                paths.app.userProfile.getHref(notification.payload.userId),
              );
            }
          }}
          className="font-semibold text-blue-600 hover:underline"
        >
          {userName}
        </button>
        {parts[1]}
      </span>
    );
  };

  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Mark as read (archive functionality)
    if (!notification.isRead) {
      markAsRead.mutate({ notificationId: notification.id });
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();

    // If notification is unread, show confirmation dialog
    if (!notification.isRead) {
      setShowDeleteDialog(true);
    } else {
      // If already read, delete immediately
      deleteNotification.mutate({ notificationId: notification.id });
    }
  };

  const confirmDelete = () => {
    deleteNotification.mutate(
      { notificationId: notification.id },
      {
        onSuccess: () => {
          setShowDeleteDialog(false);
        },
      },
    );
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={cn(
          'group relative flex w-full items-start gap-3 rounded-lg border p-4 text-left transition-all duration-200',
          'hover:shadow-md',
          notification.isRead
            ? 'border-gray-200 bg-white hover:bg-gray-50'
            : cn('bg-opacity-50', bgColor, borderColor, 'hover:bg-opacity-70'),
        )}
      >
        {/* Action buttons - visible on hover */}
        <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <button
            onClick={handleArchive}
            disabled={notification.isRead}
            className={cn(
              'rounded-md p-1.5 transition-colors',
              notification.isRead
                ? 'cursor-not-allowed text-gray-300'
                : 'text-gray-400 hover:bg-gray-200 hover:text-gray-600',
            )}
            title="Archive (Mark as read)"
          >
            <Archive className="size-4" />
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteNotification.isPending}
            className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-red-100 hover:text-red-600"
            title="Delete notification"
          >
            <X className="size-4" />
          </button>
        </div>
        {/* Icon with background circle */}
        <div
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-110',
            notification.isRead ? 'bg-gray-100' : bgColor,
          )}
        >
          {icon}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p
                className={cn(
                  'text-sm leading-relaxed text-gray-800',
                  !notification.isRead && 'font-medium text-gray-900',
                )}
              >
                {renderBody()}
              </p>
              {/* Description */}
              <p className="mt-1 text-xs leading-relaxed text-gray-600">
                {description}
              </p>
            </div>
            {!notification.isRead && (
              <span className="mt-1 size-2 shrink-0 animate-pulse rounded-full bg-blue-500" />
            )}
          </div>

          {/* Timestamp with better styling */}
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500">
              {formatDistanceToNow(new Date(notification.createdAt), {
                addSuffix: true,
              })}
            </span>
            {!notification.isRead && (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                New
              </span>
            )}
          </div>
        </div>

        {/* Subtle arrow indicator */}
        <div className="flex shrink-0 items-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <svg
            className="size-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </button>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Unread Notification?</DialogTitle>
            <DialogDescription>
              This notification is unread. Are you sure you want to delete it?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              isLoading={deleteNotification.isPending}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
