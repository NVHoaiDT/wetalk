import { formatDistanceToNow } from 'date-fns';

import { Conversation } from '@/types/api';
import { cn } from '@/utils/cn';

type ConversationItemProps = {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
};

export const ConversationItem = ({
  conversation,
  isActive,
  onClick,
}: ConversationItemProps) => {
  const hasUnread = conversation.unreadCount > 0;

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors',
        'hover:bg-gray-50',
        isActive && 'bg-blue-50 hover:bg-blue-50',
      )}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        {conversation.otherUser.avatar ? (
          <img
            src={conversation.otherUser.avatar}
            alt={conversation.otherUser.username}
            className="size-12 rounded-full object-cover"
          />
        ) : (
          <div className="flex size-12 items-center justify-center rounded-full bg-gray-300 text-lg font-semibold text-gray-600">
            {conversation.otherUser.username.charAt(0).toUpperCase()}
          </div>
        )}
        {hasUnread && (
          <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-blue-500 text-xs font-semibold text-white">
            {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span
            className={cn(
              'truncate text-sm font-semibold',
              hasUnread ? 'text-gray-900' : 'text-gray-700',
            )}
          >
            {conversation.otherUser.username}
          </span>
          {conversation.lastMessage && (
            <span className="shrink-0 text-xs text-gray-500">
              {formatDistanceToNow(new Date(conversation.lastMessage.sentAt), {
                addSuffix: true,
              })}
            </span>
          )}
        </div>

        {conversation.lastMessage ? (
          <p
            className={cn(
              'truncate text-sm',
              hasUnread ? 'font-medium text-gray-900' : 'text-gray-500',
            )}
          >
            {conversation.lastMessage.content}
          </p>
        ) : (
          <p className="text-sm italic text-gray-400">
            This message has been deleted
          </p>
        )}
      </div>
    </button>
  );
};
