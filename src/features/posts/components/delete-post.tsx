import { Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/dialog';
import { useNotifications } from '@/components/ui/notifications';

import { useDeletePost } from '../api/delete-post';

type DeletePostProps = {
  postId: number;
};

export const DeletePost = ({ postId }: DeletePostProps) => {
  const { addNotification } = useNotifications();
  const deletePostMutation = useDeletePost({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Post Deleted',
        });
      },
      onError: (error) => {
        addNotification({
          type: 'error',
          title: 'Error Deleting Post',
          message: error.message,
        });
      },
    },
  });

  return (
    <ConfirmationDialog
      isDone={deletePostMutation.isSuccess}
      icon="danger"
      title="Delete Post"
      body="Are you sure you want to delete this post?"
      triggerButton={
        <button className="flex w-full items-center gap-1.5 p-2 transition-colors hover:bg-gray-100">
          <Trash className="size-4" />
          <span>Delete</span>
        </button>
      }
      confirmButton={
        <Button
          isLoading={deletePostMutation.isPending}
          type="button"
          variant="destructive"
          size="sm"
          onClick={() => deletePostMutation.mutate({ postId })}
        >
          Delete
        </Button>
      }
    />
  );
};
