/* 
    Endpoint: POST /users/saved-posts
    
    Body: 
    {
        "postId": 9,
        "isFollowed": true
    }
    Response: 
    {
        "success": true,
        "message": "Post saved successfully"
    }
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import z from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

export const savePostInputSchema = z.object({
  postId: z.number(),
  isFollowed: z.boolean(),
});

export type SavePostInput = z.infer<typeof savePostInputSchema>;

export const savePost = ({ postId, isFollowed }: SavePostInput) => {
  return api.post(`/users/saved-posts`, { postId, isFollowed });
};

type UseSavePostOptions = {
  mutationConfig?: MutationConfig<typeof savePost>;
};

export const useSavePost = ({ mutationConfig }: UseSavePostOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.refetchQueries({ queryKey: ['posts'] });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: savePost,
  });
};
