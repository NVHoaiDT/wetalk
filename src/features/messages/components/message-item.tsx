import { formatDistanceToNow } from 'date-fns';
import { ExternalLink, Trash2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';

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
  const navigate = useNavigate();

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

              {/* Shared Post Card */}
              {message.sharedPost && (
                <div
                  onClick={() => navigate(`/posts/${message.sharedPost.id}`)}
                  className={cn(
                    'cursor-pointer rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md',
                    'max-w-sm',
                  )}
                >
                  {/* Post Header */}
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">
                      {message.sharedPost.title}
                    </h3>
                    <ExternalLink className="size-4 shrink-0 text-gray-400" />
                  </div>

                  {/* Post Content Preview */}
                  {message.sharedPost.content && (
                    <p className="mb-2 line-clamp-2 text-xs text-gray-600">
                      {message.sharedPost.content}
                    </p>
                  )}

                  {/* Post Media */}
                  {message.sharedPost.mediaUrls &&
                    message.sharedPost.mediaUrls.length > 0 && (
                      <div className="mb-2 overflow-hidden rounded-lg">
                        <img
                          src={message.sharedPost.mediaUrls[0]}
                          alt="Post media"
                          className="h-32 w-full object-cover"
                        />
                      </div>
                    )}

                  {/* Post Tags */}
                  {message.sharedPost.tags &&
                    message.sharedPost.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {message.sharedPost.tags
                          .slice(0, 3)
                          .map((tag, index) => (
                            <span
                              key={index}
                              className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700"
                            >
                              #{tag}
                            </span>
                          ))}
                        {message.sharedPost.tags.length > 3 && (
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                            +{message.sharedPost.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
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
