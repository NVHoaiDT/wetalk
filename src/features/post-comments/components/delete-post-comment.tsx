import { Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/dialog';
import { useNotifications } from '@/components/ui/notifications';

import { useDeletePostComment } from '../api/delete-post-comment';

type DeletePostCommentProps = {
  id: string;
  postId: number;
};

export const DeletePostComment = ({ id, postId }: DeletePostCommentProps) => {
  const { addNotification } = useNotifications();
  const deletePostCommentMutation = useDeletePostComment({
    postId,
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Comment Deleted',
        });
      },
    },
  });

  return (
    <ConfirmationDialog
      isDone={deletePostCommentMutation.isSuccess}
      icon="danger"
      title="Delete Comment"
      body="Are you sure you want to delete this comment?"
      triggerButton={
        <div className="flex items-center">
          <Trash className="mr-2 size-4" />
          <span>Delete</span>
        </div>
      }
      confirmButton={
        <Button
          isLoading={deletePostCommentMutation.isPending}
          type="button"
          variant="destructive"
          size="sm"
          onClick={() => deletePostCommentMutation.mutate({ commentId: id })}
        >
          Delete
        </Button>
      }
    />
  );
};
