import { MessageCircle } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { useConversations } from '@/features/messages/api/get-conversations';
import { useSendMessage } from '@/features/messages/api/send-message';
import { useMessages } from '@/features/messages/stores/messages-store';
import { Post } from '@/types/api';
import { cn } from '@/utils/cn';

type ShareToChatDialogProps = {
  post: Post;
  children?: React.ReactNode;
};

export const ShareToChatDialog = ({
  post,
  children,
}: ShareToChatDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const conversationsQuery = useConversations({ page: 1, limit: 20 });
  const sendMessageMutation = useSendMessage();
  const { openMessages, selectRecipient, selectConversation } = useMessages();

  const conversations = conversationsQuery.data?.data || [];

  const handleShareToChat = async (
    userId: number,
    username: string,
    avatar: string,
    conversationId: number,
  ) => {
    setSelectedUserId(userId);

    try {
      await sendMessageMutation.mutateAsync({
        recipientId: userId,
        content: `Shared a post: ${post.title}`,
        attachments: [],
        metadata: {
          id: post.id,
          title: post.title,
          tags: post.tags,
          content: post.content,
          mediaUrls: post.mediaUrls,
        },
      });

      // Open messages popup with the selected conversation
      selectRecipient({ id: userId, username, avatar });
      selectConversation(conversationId);
      openMessages();

      // Close dialog
      setOpen(false);
      setSelectedUserId(null);
    } catch (error) {
      console.error('Failed to share post:', error);
      setSelectedUserId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="sm">
            <MessageCircle className="size-4" />
            Share to Chat
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share to Chat</DialogTitle>
          <DialogDescription>
            Select a conversation to share this post
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-96 overflow-y-auto">
          {conversationsQuery.isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <Spinner size="md" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex h-32 items-center justify-center text-center">
              <p className="text-sm text-gray-500">
                No conversations yet. Start a chat to share posts!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() =>
                    handleShareToChat(
                      conversation.otherUser.id,
                      conversation.otherUser.username,
                      conversation.otherUser.avatar,
                      conversation.id,
                    )
                  }
                  disabled={
                    sendMessageMutation.isPending &&
                    selectedUserId === conversation.otherUser.id
                  }
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors',
                    'hover:bg-gray-50 active:bg-gray-100',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                  )}
                >
                  {/* Avatar */}
                  {conversation.otherUser.avatar ? (
                    <img
                      src={conversation.otherUser.avatar}
                      alt={conversation.otherUser.username}
                      className="size-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex size-10 items-center justify-center rounded-full bg-gray-300 text-sm font-semibold text-gray-600">
                      {conversation.otherUser.username.charAt(0).toUpperCase()}
                    </div>
                  )}

                  {/* User Info */}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {conversation.otherUser.username}
                    </p>
                    {conversation.lastMessage && (
                      <p className="truncate text-sm text-gray-500">
                        {conversation.lastMessage.content}
                      </p>
                    )}
                  </div>

                  {/* Loading Spinner */}
                  {sendMessageMutation.isPending &&
                    selectedUserId === conversation.otherUser.id && (
                      <Spinner size="sm" />
                    )}
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
