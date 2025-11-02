/* 
REQUEST BODY:
{
    "content": "comment edited-1",
    "mediaUrl": "media-url-url"
}
RESPONSE: 
{
    "success": true,
    "message": "Comment updated successfully"
}
*/

import { useQueryClient, useMutation } from '@tanstack/react-query';
import z from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

import { getInfinitePostCommentsQueryOptions } from './get-post-comments';

export const editPostCommentInputSchema = z.object({
  content: z.string().min(1, 'Required'),
  mediaUrl: z.string().min(1, 'Required'),
});

export type EditPostCommentInput = z.infer<typeof editPostCommentInputSchema>;

export const editPostComment = ({
  data,
  commentId,
}: {
  data: EditPostCommentInput;
  commentId: number;
}): Promise<Comment> => {
  return api.put(`/comments/${commentId}`, data);
};

type UseEditPostCommentOptions = {
  postId: number;
  mutationConfig?: MutationConfig<typeof editPostComment>;
};

export const useEditPostComment = ({
  postId,
  mutationConfig,
}: UseEditPostCommentOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.refetchQueries({
        queryKey: getInfinitePostCommentsQueryOptions(postId).queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: editPostComment,
  });
};
