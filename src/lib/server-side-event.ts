import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useCallback } from 'react';

import { env } from '@/config/env';
import { useMessages } from '@/features/messages/stores/messages-store';
import { useNotifications } from '@/features/notifications/stores/notifications-store';
import {
  SSEMessageEvent,
  SSEConversationUpdatedEvent,
  SSENotificationEvent,
  Conversation,
} from '@/types/api';

type SSEConnection = {
  reader: ReadableStreamDefaultReader<Uint8Array>;
  active: boolean;
};

type UseServerSideEventsOptions = {
  enabled?: boolean;
};

/**
 * Unified SSE hook that handles all real-time events (messages, conversations, notifications)
 * Should be mounted once at the app root level when user is authenticated
 */
export const useServerSideEvents = ({
  enabled = true,
}: UseServerSideEventsOptions = {}) => {
  const queryClient = useQueryClient();
  const { setUnreadCount: setMessagesUnreadCount } = useMessages();
  const { setUnreadCount: setNotificationsUnreadCount, incrementUnreadCount } =
    useNotifications();
  const connectionRef = useRef<SSEConnection | null>(null);

  const updateMessagesUnreadCount = useCallback(() => {
    // Get conversations from cache and calculate total unread
    const conversationsData = queryClient.getQueryData<{
      data: Conversation[];
    }>(['conversations', { page: 1, limit: 20 }]);

    if (conversationsData?.data) {
      const total = conversationsData.data.reduce(
        (sum, conv) => sum + conv.unreadCount,
        0,
      );
      setMessagesUnreadCount(total);
    }
  }, [queryClient, setMessagesUnreadCount]);

  const handleSSEEvent = useCallback(
    (eventType: string, data: string) => {
      if (eventType === 'ping') {
        console.log('[SSE] Ping received');
        return;
      }

      try {
        // Handle new message events
        if (eventType === 'new_message') {
          const parsedData: SSEMessageEvent = JSON.parse(data);
          console.log('[SSE] New message:', parsedData);

          // Invalidate messages for the conversation
          queryClient.invalidateQueries({
            queryKey: ['messages', parsedData.conversationId],
          });

          // Invalidate conversations to update last message
          queryClient.invalidateQueries({
            queryKey: ['conversations'],
          });

          // Update unread count
          updateMessagesUnreadCount();
        }
        // Handle conversation update events
        else if (eventType === 'conversation_updated') {
          const parsedData: SSEConversationUpdatedEvent = JSON.parse(data);
          console.log('[SSE] Conversation updated:', parsedData);

          // Invalidate conversations
          queryClient.invalidateQueries({
            queryKey: ['conversations'],
          });

          // Update unread count
          updateMessagesUnreadCount();
        }
        // Handle new notification events
        else if (eventType === 'new_notification') {
          const parsedData: SSENotificationEvent = JSON.parse(data);
          console.log('[SSE] New notification:', parsedData);

          // Invalidate notifications query to refresh the list
          queryClient.invalidateQueries({
            queryKey: ['notifications'],
          });

          // Update unread count from server response
          setNotificationsUnreadCount(parsedData.unreadCount);
        }
      } catch (error) {
        console.error('[SSE] Error parsing event:', error);
      }
    },
    [
      queryClient,
      updateMessagesUnreadCount,
      setNotificationsUnreadCount,
      incrementUnreadCount,
    ],
  );

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.warn('[SSE] No access token found');
      return;
    }

    const connectSSE = async () => {
      try {
        const url = `${env.API_URL}/stream`;
        console.log('[SSE] Connecting to:', url);

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'text/event-stream',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        console.log('[SSE] Connected successfully');

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('No response body reader available');
        }

        const decoder = new TextDecoder();
        connectionRef.current = { reader, active: true };

        const read = async () => {
          if (!connectionRef.current || !connectionRef.current.active) {
            return;
          }

          try {
            const { done, value } = await reader.read();

            if (done) {
              console.log('[SSE] Connection closed');
              connectionRef.current = null;
              return;
            }

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            let eventType = 'message';
            let eventData = '';

            for (const line of lines) {
              if (line.startsWith('event:')) {
                eventType = line.substring(6).trim();
              } else if (line.startsWith('data:')) {
                eventData = line.substring(5).trim();
              } else if (line === '') {
                if (eventData) {
                  handleSSEEvent(eventType, eventData);
                  eventData = '';
                }
              }
            }

            // Continue reading
            read();
          } catch (error) {
            console.error('[SSE] Read error:', error);
            connectionRef.current = null;
          }
        };

        read();
      } catch (error) {
        console.error('[SSE] Connection failed:', error);
      }
    };

    connectSSE();

    // Cleanup on unmount or when enabled changes
    return () => {
      if (connectionRef.current) {
        console.log('[SSE] Disconnecting...');
        connectionRef.current.active = false;
        connectionRef.current.reader.cancel();
        connectionRef.current = null;
      }
    };
  }, [enabled, handleSSEEvent]);
};
