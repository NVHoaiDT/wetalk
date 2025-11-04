import { Plus, Search } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

import { useConversations } from '../api/get-conversations';
import { useMessages } from '../stores/messages-store';

import { ConversationItem } from './conversation-item';

export const ConversationsPanel = () => {
  const { selectedConversationId, selectConversation, selectRecipient } =
    useMessages();
  const [searchQuery, setSearchQuery] = useState('');

  const conversationsQuery = useConversations({
    page: 1,
    limit: 50,
  });

  const conversations = conversationsQuery.data?.data || [];

  // Filter conversations by search query
  const filteredConversations = conversations.filter((conv) =>
    conv.otherUser.username.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex w-80 flex-col border-r border-gray-200 bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
          <Button
            size="icon"
            variant="outline"
            className="size-8"
            title="New conversation"
          >
            <Plus className="size-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-2">
        {conversationsQuery.isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <Spinner size="md" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex h-32 flex-col items-center justify-center text-center">
            <p className="text-sm text-gray-500">No conversations yet</p>
            <p className="mt-1 text-xs text-gray-400">
              Click + to start a new chat
            </p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex h-32 items-center justify-center">
            <p className="text-sm text-gray-500">No results found</p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isActive={selectedConversationId === conversation.id}
                onClick={() => {
                  selectConversation(conversation.id);
                  selectRecipient(conversation.otherUser);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
