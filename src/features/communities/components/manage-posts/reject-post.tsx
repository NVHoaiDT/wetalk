import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/dialog';
import { useNotifications } from '@/components/ui/notifications';

import { useUpdatePostStatus } from '../../api/update-post-status';

type RejectPostProps = {
  communityId: number;
  postId: number;
  postTitle: string;
};

export const RejectPost = ({
  communityId,
  postId,
  postTitle,
}: RejectPostProps) => {
  const { addNotification } = useNotifications();
  const rejectPostMutation = useUpdatePostStatus({
    communityId,
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Post Rejected',
          message: `"${postTitle}" has been rejected`,
        });
      },
      onError: (error) => {
        addNotification({
          type: 'error',
          title: 'Failed to Reject Post',
          message: error.message,
        });
      },
    },
  });

  return (
    <ConfirmationDialog
      icon="danger"
      title="Reject Post"
      body={`Are you sure you want to reject "${postTitle}"? The post will be hidden from the community.`}
      triggerButton={
        <button
          className="flex size-9 items-center justify-center rounded-full bg-orange-50 text-orange-600 transition-all hover:bg-orange-100 hover:shadow-md"
          aria-label="Reject post"
        >
          <X className="size-4" />
        </button>
      }
      confirmButton={
        <Button
          isLoading={rejectPostMutation.isPending}
          type="button"
          variant="destructive"
          onClick={() =>
            rejectPostMutation.mutate({
              communityId,
              postId,
              status: 'rejected',
            })
          }
        >
          Reject Post
        </Button>
      }
      isDone={rejectPostMutation.isSuccess}
    />
  );
};
