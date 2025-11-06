import { Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/dialog';
import { useNotifications } from '@/components/ui/notifications';

import { useUpdatePostStatus } from '../../api/update-post-status';

type ApprovePostButtonProps = {
  communityId: number;
  postId: number;
  postTitle: string;
};

export const ApprovePostButton = ({
  communityId,
  postId,
  postTitle,
}: ApprovePostButtonProps) => {
  const { addNotification } = useNotifications();
  const approvePostMutation = useUpdatePostStatus({
    communityId,
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Post Approved',
          message: `"${postTitle}" has been approved`,
        });
      },
      onError: (error) => {
        addNotification({
          type: 'error',
          title: 'Failed to Approve Post',
          message: error.message,
        });
      },
    },
  });

  return (
    <ConfirmationDialog
      icon="info"
      title="Approve Post"
      body={`Are you sure you want to approve "${postTitle}"? This will make it visible to all community members.`}
      triggerButton={
        <button
          className="flex size-9 items-center justify-center rounded-full bg-green-50 text-green-600 transition-all hover:bg-green-100 hover:shadow-md"
          aria-label="Approve post"
        >
          <Check className="size-4" />
        </button>
      }
      confirmButton={
        <Button
          isLoading={approvePostMutation.isPending}
          type="button"
          className="bg-green-600 hover:bg-green-700"
          onClick={() =>
            approvePostMutation.mutate({
              communityId,
              postId,
              status: 'approved',
            })
          }
        >
          Approve Post
        </Button>
      }
      isDone={approvePostMutation.isSuccess}
    />
  );
};
