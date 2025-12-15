import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

export const deletePostComment = ({ commentId }: { commentId: string }) => {
  return api.delete(`/comments/${commentId}`);
};

type UseDeletePostCommentOptions = {
  mutationConfig?: MutationConfig<typeof deletePostComment>;
};

export const useDeletePostComment = ({
  mutationConfig,
}: UseDeletePostCommentOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ['post-comments'],
      });
      queryClient.invalidateQueries({
        queryKey: ['user-comments'],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deletePostComment,
  });
};
