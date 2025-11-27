import { formatDistanceToNow } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

import { MessageMediaViewer } from '@/components/ui/message-media-viewer';
import { useNotifications } from '@/components/ui/notifications';
import { Message } from '@/types/api';
import { cn } from '@/utils/cn';

import { useDeleteMessage } from '../api/delete-message';

type MessageItemProps = {
  message: Message;
  isOwn: boolean;
};

export const MessageItem = ({ message, isOwn }: MessageItemProps) => {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const deleteMessageMutation = useDeleteMessage({});
  const { addNotification } = useNotifications();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowContextMenu(false);
      }
    };

    if (showContextMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showContextMenu]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isOwn || message.isDeleted) return;

    setContextMenuPos({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  const handleDelete = () => {
    deleteMessageMutation.mutate(message.id, {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Message deleted',
          message: 'Your message has been deleted',
        });
        setShowContextMenu(false);
      },
      onError: () => {
        addNotification({
          type: 'error',
          title: 'Delete failed',
          message: 'Failed to delete message',
        });
      },
    });
  };
  return (
    <>
      <div
        className={cn('flex items-start gap-2', isOwn && 'flex-row-reverse')}
        onContextMenu={handleContextMenu}
      >
        {/* Avatar */}
        <div className="shrink-0">
          {message.sender.avatar ? (
            <img
              src={message.sender.avatar}
              alt={message.sender.username}
              className="size-8 rounded-full object-cover"
            />
          ) : (
            <div className="flex size-8 items-center justify-center rounded-full bg-gray-300 text-xs font-semibold text-gray-600">
              {message.sender.username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Message Content */}
        <div
          className={cn(
            'flex max-w-[70%] flex-col gap-1',
            isOwn && 'items-end',
          )}
        >
          {/* Deleted message */}
          {message.isDeleted ? (
            <div className="rounded-2xl bg-gray-100 px-4 py-2">
              <p className="text-sm italic text-gray-500">
                This message has been deleted
              </p>
            </div>
          ) : (
            <>
              {/* Text content (if exists) */}
              {message.content && (
                <div
                  className={cn(
                    'rounded-2xl px-4 py-2',
                    isOwn
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900',
                  )}
                >
                  <p className="whitespace-pre-wrap break-words text-sm">
                    {message.content}
                  </p>
                </div>
              )}

              {/* Media attachments */}
              {message.attachments && message.attachments.length > 0 && (
                <div
                  className={cn(
                    'flex justify-center items-center overflow-hidden rounded-2xl',
                    isOwn ? 'border-blue-500' : 'border-gray-100',
                    !message.content && 'p-1',
                  )}
                >
                  <MessageMediaViewer
                    attachments={message.attachments}
                    className={cn(!message.content && 'rounded-xl')}
                  />
                </div>
              )}
            </>
          )}

          {/* Metadata */}
          <div
            className={cn(
              'flex items-center gap-1 px-2 text-xs text-gray-500',
              isOwn && 'flex-row-reverse',
            )}
          >
            <span>
              {formatDistanceToNow(new Date(message.createdAt), {
                addSuffix: true,
              })}
            </span>
            {isOwn && message.isRead && (
              <span className="text-blue-500">✓✓</span>
            )}
          </div>
        </div>
      </div>

      {/* Context Menu */}
      {showContextMenu && (
        <div
          ref={menuRef}
          className="fixed z-50 rounded-lg border border-gray-200 bg-white shadow-lg"
          style={{
            left: `${contextMenuPos.x}px`,
            top: `${contextMenuPos.y}px`,
          }}
        >
          <button
            onClick={handleDelete}
            disabled={deleteMessageMutation.isPending}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 className="size-4" />
            Delete Message
          </button>
        </div>
      )}
    </>
  );
};
