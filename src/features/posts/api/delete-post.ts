/* 
    Endpoint: DELETE /posts/:id
*/

import { useQueryClient, useMutation } from '@tanstack/react-query';
import z from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

export const DeletePostInput = z.object({
  postId: z.number().min(1, 'Required'),
});

type DeletePostInput = z.infer<typeof DeletePostInput>;

export const deletePost = ({ postId }: DeletePostInput) => {
  return api.delete(`/posts/${postId}`);
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
      queryClient.invalidateQueries({
        queryKey: ['user-posts'],
      });
      queryClient.invalidateQueries({
        queryKey: ['community-posts'],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deletePost,
  });
};
