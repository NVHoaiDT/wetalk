/* 
    Connect to server-sent events for notifications.

    Endpoint: `GET /stream`

    Everytime a new notification is created for the user, server will send an eventSource `new_notification` event with payload like below:
    ```
    {
        "notification": {
            "id": 8,
            "body": "phamvanc upvoted your post",
            "action": "get_post_vote",
            "payload": {
                "postId": 2,
                "userName": "phamvanc",
                "voteType": true
            },
            "isRead": false,
            "createdAt": "2025-11-03T03:53:02.620616Z"
        },
        "unreadCount": 2
    }
    ```
*/

import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useCallback } from 'react';

import { env } from '@/config/env';
import { SSENotificationEvent } from '@/types/api';

type SSEConnection = {
  reader: ReadableStreamDefaultReader<Uint8Array>;
  active: boolean;
};

type UseNotificationSSEOptions = {
  enabled?: boolean;
  onNotification?: (event: SSENotificationEvent) => void;
};

export const useNotificationSSE = ({
  enabled = true,
  onNotification,
}: UseNotificationSSEOptions = {}) => {
  const queryClient = useQueryClient();
  const connectionRef = useRef<SSEConnection | null>(null);

  const handleSSEEvent = useCallback(
    (eventType: string, data: string) => {
      if (eventType === 'ping') {
        return;
      }

      try {
        if (eventType === 'new_notification') {
          const parsedData: SSENotificationEvent = JSON.parse(data);
          console.log('[Notification SSE] New notification:', parsedData);

          // Invalidate notifications query to refresh the list
          queryClient.invalidateQueries({
            queryKey: ['notifications'],
          });

          // Call custom callback if provided
          onNotification?.(parsedData);
        }
      } catch (error) {
        console.error('[Notification SSE] Error parsing event:', error);
      }
    },
    [queryClient, onNotification],
  );

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.warn('[Notification SSE] No access token found');
      return;
    }

    const connectSSE = async () => {
      try {
        const url = `${env.API_URL}/stream`;

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'text/event-stream',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        console.log('[Notification SSE] Connected successfully');

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
              console.log('[Notification SSE] Connection closed');
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
            console.error('[Notification SSE] Read error:', error);
            connectionRef.current = null;
          }
        };

        read();
      } catch (error) {
        console.error('[Notification SSE] Connection failed:', error);
      }
    };

    connectSSE();

    // Cleanup on unmount or when enabled changes
    return () => {
      if (connectionRef.current) {
        connectionRef.current.active = false;
        connectionRef.current.reader.cancel();
        connectionRef.current = null;
      }
    };
  }, [enabled, handleSSEEvent]);
};
