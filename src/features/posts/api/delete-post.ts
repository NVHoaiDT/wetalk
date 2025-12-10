/* 
    Endpoint: DELETE /communities/:communityId/manage/posts/:postId
*/

import { useQueryClient, useMutation } from '@tanstack/react-query';
import z from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

export const DeletePostInput = z.object({
  communityId: z.number().min(1, 'Required'),
  postId: z.number().min(1, 'Required'),
});

type DeletePostInput = z.infer<typeof DeletePostInput>;

export const deletePost = ({ communityId, postId }: DeletePostInput) => {
  return api.delete(`/communities/${communityId}/manage/posts/${postId}`);
};

type UseDeletePostOptions = {
  mutationConfig?: MutationConfig<typeof deletePost>;
};

export const useDeletePost = ({ mutationConfig }: UseDeletePostOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ['posts'],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deletePost,
  });
};
