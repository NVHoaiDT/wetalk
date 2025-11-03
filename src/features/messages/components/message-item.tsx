import { formatDistanceToNow } from 'date-fns';

import { Message } from '@/types/api';
import { cn } from '@/utils/cn';

type MessageItemProps = {
  message: Message;
  isOwn: boolean;
};

export const MessageItem = ({ message, isOwn }: MessageItemProps) => {
  return (
    <div className={cn('flex items-start gap-2', isOwn && 'flex-row-reverse')}>
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
        className={cn('flex max-w-[70%] flex-col gap-1', isOwn && 'items-end')}
      >
        <div
          className={cn(
            'rounded-2xl px-4 py-2',
            isOwn ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900',
          )}
        >
          <p className="whitespace-pre-wrap break-words text-sm">
            {message.content}
          </p>
        </div>

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
          {isOwn && message.isRead && <span className="text-blue-500">✓✓</span>}
        </div>
      </div>
    </div>
  );
};
