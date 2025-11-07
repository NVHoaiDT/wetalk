import { Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/dialog';
import { useNotifications } from '@/components/ui/notifications';

import { useRemoveCommunityPost } from '../../api/remove-community-post';

type RemovePostProps = {
  communityId: number;
  postId: number;
  postTitle: string;
};

export const RemovePost = ({
  communityId,
  postId,
  postTitle,
}: RemovePostProps) => {
  const { addNotification } = useNotifications();
  const removePostMutation = useRemoveCommunityPost({
    communityId,
    postId,
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Post Removed',
          message: `"${postTitle}" has been permanently removed`,
        });
      },
      onError: (error) => {
        addNotification({
          type: 'error',
          title: 'Failed to Remove Post',
          message: error.message,
        });
      },
    },
  });

  return (
    <ConfirmationDialog
      icon="danger"
      title="Remove Post"
      body={`Are you sure you want to permanently remove "${postTitle}"? This action cannot be undone.`}
      triggerButton={
        <button
          className="flex size-9 items-center justify-center rounded-full bg-red-50 text-red-600 transition-all hover:bg-red-100 hover:shadow-md"
          aria-label="Remove post"
        >
          <Trash2 className="size-4" />
        </button>
      }
      confirmButton={
        <Button
          isLoading={removePostMutation.isPending}
          type="button"
          variant="destructive"
          onClick={() => removePostMutation.mutate({ communityId, postId })}
        >
          Remove Post
        </Button>
      }
      isDone={removePostMutation.isSuccess}
    />
  );
};
