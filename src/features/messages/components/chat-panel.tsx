import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useUser } from '@/lib/auth';

import { useMessages as useMessagesAPI } from '../api/get-messages';
import { useMarkConversationAsRead } from '../api/mark-conversation-read';
import { useSendMessage } from '../api/send-message';
import { useMessages } from '../stores/messages-store';

import { MessageInput } from './message-input';
import { MessageItem } from './message-item';

export const ChatPanel = () => {
  const { selectedConversationId, selectConversation } = useMessages();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userQuery = useUser();
  const currentUserId = userQuery.data?.data?.id;

  const messagesQuery = useMessagesAPI({
    conversationId: selectedConversationId!,
    page: 1,
    limit: 100,
  });

  const sendMessageMutation = useSendMessage();
  const markAsReadMutation = useMarkConversationAsRead();

  const messages = messagesQuery.data?.data || [];

  // Get other user info from first message
  const otherUser = messages.find(
    (msg) => msg.sender.id !== currentUserId,
  )?.sender;

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark conversation as read when opening
  useEffect(() => {
    if (selectedConversationId) {
      markAsReadMutation.mutate(selectedConversationId);
    }
  }, [selectedConversationId]);

  const handleSendMessage = (content: string) => {
    if (!selectedConversationId || !otherUser) return;

    sendMessageMutation.mutate({
      recipientId: otherUser.id,
      content,
    });
  };

  if (!selectedConversationId) {
    return (
      <div className="flex flex-1 items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-600">
            Select a conversation
          </p>
          <p className="mt-1 text-sm text-gray-400">
            Choose a conversation from the list to start messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-white">
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          {otherUser ? (
            <>
              {otherUser.avatar ? (
                <img
                  src={otherUser.avatar}
                  alt={otherUser.username}
                  className="size-10 rounded-full object-cover"
                />
              ) : (
                <div className="flex size-10 items-center justify-center rounded-full bg-gray-300 text-lg font-semibold text-gray-600">
                  {otherUser.username.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h3 className="font-semibold text-gray-900">
                  {otherUser.username}
                </h3>
                <p className="text-xs text-gray-500">Active</p>
              </div>
            </>
          ) : (
            <div className="h-10 w-32 animate-pulse rounded bg-gray-200" />
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => selectConversation(null)}
          className="size-8"
        >
          <X className="size-4" />
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {messagesQuery.isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-gray-500">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageItem
                key={message.id}
                message={message}
                isOwn={message.sender.id === currentUserId}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4">
        <MessageInput
          onSend={handleSendMessage}
          disabled={sendMessageMutation.isPending || !otherUser}
          placeholder="Type a message..."
        />
      </div>
    </div>
  );
};
