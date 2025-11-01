import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

import { getInfinitePostCommentsQueryOptions } from './get-post-comments';

export const deletePostComment = ({ commentId }: { commentId: string }) => {
  return api.delete(`/comments/${commentId}`);
};

type UseDeletePostCommentOptions = {
  postId: number;
  mutationConfig?: MutationConfig<typeof deletePostComment>;
};

export const useDeletePostComment = ({
  mutationConfig,
  postId,
}: UseDeletePostCommentOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getInfinitePostCommentsQueryOptions(postId).queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deletePostComment,
  });
};
