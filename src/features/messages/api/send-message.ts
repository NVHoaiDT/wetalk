/*
ENDPOINT: `POST /messages`
BODY:
  {
    "recipientId": 2,
    "content": "Hello! This is my first message",
    "type": "text", // "text", "image", "video", "file", "metadata"
    "attachments": [
      {
        fileType: 'image', fileUrl: 'https://example.com/image.jpg'
      },
      {
        fileType: 'video', fileUrl: 'https://example.com/video.mp4'
      }
    ],
    "metadata": {
      "id": 123,
      "title": "Post title",
      "tags": ["tag1", "tag2"],
      "content": "Post content",
      "mediaUrls": ["url1", "url2"]
    }
  }
*/

import { useMutation, useQueryClient } from '@tanstack/react-query';
import z from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { SendMessageResponse } from '@/types/api';

const attachment = z.object({
  fileType: z.enum(['image', 'video']),
  fileUrl: z.string(),
});

const metadata = z.object({
  id: z.number(),
  title: z.string(),
  tags: z.array(z.string()),
  content: z.string(),
  mediaUrls: z.array(z.string()),
});

export const sendMessageDTOInputSchema = z.object({
  recipientId: z.number(),
  content: z.string(),
  attachments: z.array(attachment).optional(),
  metadata: metadata.optional(),
});

export type SendMessageInput = z.infer<typeof sendMessageDTOInputSchema>;

export const sendMessage = ({
  recipientId,
  content,
  attachments,
  metadata,
}: SendMessageInput): Promise<SendMessageResponse> => {
  return api.post('/messages', {
    recipientId,
    content,
    attachments,
    metadata,
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
      queryClient.invalidateQueries({
        queryKey: ['conversations'],
      });

      queryClient.invalidateQueries({
        queryKey: ['messages', data.data.conversationId],
      });

      onSuccess?.(data, ...args);
    },
    ...restConfig,
  });
};
