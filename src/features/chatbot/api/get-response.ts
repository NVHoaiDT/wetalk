/* 
Endpoint: POST /chatbot/stream
Body:
{
  "message": "Hi there!",
  "temperature": 0.7,
  "maxTokens": 2000
}
Response (Chunked):
{        
    `connected` stream started
    
    {
        "chunk": {
            "content": "Hi",
            "done": false,
            "timestamp": "2026-01-30T08:08:57.8127393Z"
        }
    }
    ---
    {
        "chunk": {
            "content": " there",
            "done": false,
            "timestamp": "2026-01-30T08:08:57.8557984Z"
        }
    }
    ---
    ...

    `complete` {"model":"ollama","timestamp":"2026-01-30T08:08:59.2546484Z"}
}

*/

import { useMutation } from '@tanstack/react-query';
import z from 'zod';

import { MutationConfig } from '@/lib/react-query';
import { ChatbotChunk, ChatbotStreamEvent } from '@/types/api';

export const getChatbotResponseInput = z.object({
  message: z.string().min(1, 'Message is required'),
  temperature: z.number().min(0).max(2).optional().default(0.7),
  maxTokens: z.number().min(1).max(10000).optional().default(2000),
});

export type GetChatbotResponseInput = z.infer<typeof getChatbotResponseInput>;

export type StreamCallbacks = {
  onChunk?: (chunk: ChatbotChunk) => void;
  onComplete?: (model: string, timestamp: string) => void;
  onError?: (error: string) => void;
  onConnected?: () => void;
};

export const getChatbotResponse = async ({
  data,
  callbacks,
}: {
  data: GetChatbotResponseInput;
  callbacks?: StreamCallbacks;
}): Promise<void> => {
  const baseUrl = import.meta.env.VITE_APP_API_URL || 'http://localhost:8045';
  const token = localStorage.getItem('accessToken');

  const response = await fetch(`${baseUrl}/chatbot/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('Response body is not readable');
  }

  const decoder = new TextDecoder();
  let buffer = '';
  let currentEvent = '';

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');

      // Keep the last incomplete line in the buffer
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        // Handle event type
        if (trimmed.startsWith('event:')) {
          currentEvent = trimmed.substring('event:'.length).trim();
          continue;
        }

        // Handle data
        if (trimmed.startsWith('data:')) {
          const data = trimmed.substring('data:'.length).trim();

          if (currentEvent === 'connected') {
            callbacks?.onConnected?.();
          } else if (currentEvent === 'chunk') {
            try {
              const parsed = JSON.parse(data);
              if (parsed.chunk) {
                callbacks?.onChunk?.(parsed.chunk);
              }
            } catch (e) {
              console.error('Failed to parse chunk:', data, e);
            }
          } else if (currentEvent === 'complete') {
            try {
              const parsed = JSON.parse(data);
              callbacks?.onComplete?.(parsed.model, parsed.timestamp);
            } catch (e) {
              console.error('Failed to parse complete event:', data, e);
            }
          }

          // Reset current event after processing
          currentEvent = '';
          continue;
        }
      }
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    callbacks?.onError?.(errorMessage);
    throw error;
  } finally {
    reader.releaseLock();
  }
};

type UseGetChatbotResponseOptions = {
  mutationConfig?: MutationConfig<typeof getChatbotResponse>;
  callbacks?: StreamCallbacks;
};

export const useChatbotResponse = ({
  mutationConfig,
  callbacks,
}: UseGetChatbotResponseOptions = {}) => {
  const { onSuccess, onError, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: ({ data }: { data: GetChatbotResponseInput }) =>
      getChatbotResponse({ data, callbacks }),
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    onError: (error, ...args) => {
      callbacks?.onError?.(
        error instanceof Error ? error.message : 'Unknown error occurred',
      );
      onError?.(error, ...args);
    },
    ...restConfig,
  });
};
