/* 
    Endpoint: POST /users/saved-posts
    
    Body: 
    {
        "postId": 9,
        "isFollowed": true   //save: false, follow: true
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

export const followPostInputSchema = z.object({
  postId: z.number(),
});

export type FollowPostInput = z.infer<typeof followPostInputSchema>;

export const followPost = ({ postId }: FollowPostInput) => {
  return api.post(`/users/saved-posts`, { postId, isFollowed: true });
};

type UseFollowPostOptions = {
  mutationConfig?: MutationConfig<typeof followPost>;
};

export const useFollowPost = ({ mutationConfig }: UseFollowPostOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.refetchQueries({ queryKey: ['posts'] });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: followPost,
  });
};
