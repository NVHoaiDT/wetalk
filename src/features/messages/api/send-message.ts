/* 
ENDPOINT: `POST /messages`
BODY:
  {
    "recipientId": 2,
    "content": "Hello! This is my first message",
    "type": "text", // "text", "image", "video", "file"
    "attachments": ["image-url", "video-url"] // optional
  }
*/

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { SendMessageResponse } from '@/types/api';

export type SendMessageDTO = {
  recipientId: number;
  content: string;
  type?: string;
  attachments?: string[];
};

export const sendMessage = ({
  recipientId,
  content,
  /* Buggy next line, because type will always be "text" so backend ignore the attachments */
  type = 'text',
  attachments = [],
}: SendMessageDTO): Promise<SendMessageResponse> => {
  return api.post('/messages', {
    recipientId,
    content,
    type,
    attachments,
  });
};

type UseSendMessageOptions = {
  mutationConfig?: MutationConfig<typeof sendMessage>;
};

export const useSendMessage = ({
  mutationConfig,
}: UseSendMessageOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: sendMessage,
    onSuccess: (data, ...args) => {
      // Invalidate conversations to update last message
      queryClient.invalidateQueries({
        queryKey: ['conversations'],
      });

      // Invalidate messages for this conversation
      queryClient.invalidateQueries({
        queryKey: ['messages', data.data.conversationId],
      });

      onSuccess?.(data, ...args);
    },
    ...restConfig,
  });
};
