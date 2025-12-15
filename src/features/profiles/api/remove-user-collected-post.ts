/* 
    Endpoint: DELETE /users/saved-posts/:postId
*/

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

export const removeUserCollectedPost = ({ postId }: { postId: number }) => {
  return api.delete(`/users/saved-posts/${postId}`);
};

type UseRemoveUserCollectedPostOptions = {
  mutationConfig?: MutationConfig<typeof removeUserCollectedPost>;
};

export const useRemoveUserCollectedPost = ({
  mutationConfig,
}: UseRemoveUserCollectedPostOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ['user-saved-posts'],
      });
      queryClient.invalidateQueries({
        queryKey: ['user-followed-posts'],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: removeUserCollectedPost,
  });
};
