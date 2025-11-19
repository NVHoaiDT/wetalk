/* 
    Endpoint: PUT /posts/:id?type=<post_type>
        post_type: (text|link|media|poll)

    Request body examples:
    type="text"
    {
        "title": "new title",
        "content": "new content",
        "tags": ["golang", "update"]
    }
    type="link"
    {
        "title": "new title",
        "content": "new content",
        "url": "https://new-link.com",
        "tags": ["link", "resources"]
    }
    type="media"
    {
        "title": "new title",
        "content": "new content",
        "media_urls": ["https://new-image.jpg"],
        "tags": ["photos", "gallery"]
    }
    type="poll"
    {
        "title": "new title",
        "content": "new content",
        "poll_data": {
        "question": "new question",
        "options": [
            { "id": 1, "text": "Option 1", "votes": 5, "voters": [1, 2, 3] },
            { "id": 2, "text": "Option 2", "votes": 3, "voters": [4, 5] }
        ],
        "multiple_choice": false,
        "expires_at": "2025-10-25T00:00:00Z",
        "total_votes": 8
        },
        "tags": ["poll", "survey"]
    }

    Response:
    {
        "success": true,
        "message": "Post updated successfully"
    }

*/

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

import { getPostQueryOptions } from './get-post';

export const editPostInputSchema = z.object({
  postId: z.number().min(1, 'Required'),
  type: z.string().min(1, 'Required'),
  title: z.string().min(1, 'Required'),
  content: z.string().min(1, 'Required'),
  tags: z.array(z.string()),

  /* for type link */
  url: z.string().url().optional(),

  /* for type meadia */
  mediaUrls: z.array(z.string()).optional(),

  /* for type poll */
  pollData: z
    .object({
      question: z.string().min(1, 'Required'),
      options: z
        .array(
          z.object({
            id: z.number().min(1, 'Required'),
            text: z.string().min(1, 'Required'),
            votes: z.number().min(0),
            voters: z.array(z.number()),
          }),
        )
        .min(2, 'At least two options are required'),
      multipleChoice: z.boolean(),
      expiresAt: z.string().optional(),
      totalVotes: z.number().min(0),
    })
    .optional(),
});

export type EditPostInput = z.infer<typeof editPostInputSchema>;

export const editPost = ({ data }: { data: EditPostInput }) => {
  return api.put(`/posts/${data.postId}?type=${data.type}`, data);
};

type UseEditPostOptions = {
  postId: number;
  mutationConfig?: MutationConfig<typeof editPost>;
};

export const useEditPost = ({ postId, mutationConfig }: UseEditPostOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getPostQueryOptions(postId).queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: editPost,
  });
};
