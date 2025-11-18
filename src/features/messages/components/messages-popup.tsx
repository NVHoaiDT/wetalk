import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { useMessagesSSE } from '../api/use-messages-sse';
import { useMessages } from '../stores/messages-store';

import { ChatPanel } from './chat-panel';
import { ConversationsPanel } from './conversations-panel';

export const MessagesPopup = () => {
  const { isOpen, closeMessages } = useMessages();

  // Connect to SSE when popup is open
  useMessagesSSE();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/20"
        onClick={closeMessages}
        aria-hidden="true"
      />

      {/* Popup Window */}
      <div className="fixed bottom-4 right-4 z-50 flex h-[600px] w-full max-w-4xl bg-white shadow-2xl">
        {/* Close Button (top-right corner) */}
        <Button
          variant="ghost"
          size="icon"
          onClick={closeMessages}
          className="absolute -right-2 -top-2 z-10 size-8 rounded-full bg-white shadow-md hover:bg-gray-100"
        >
          <X className="size-4" />
        </Button>

        {/* Left: Conversations List */}
        <ConversationsPanel />

        {/* Right: Active Chat */}
        <ChatPanel />
      </div>
    </>
  );
};
