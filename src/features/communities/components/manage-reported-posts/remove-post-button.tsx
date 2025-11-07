import { Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useNotifications } from '@/components/ui/notifications';
import { useRemoveCommunityPost } from '@/features/communities/api/remove-community-post';

type RemovePostButtonProps = {
  communityId: number;
  postId: number;
  postTitle: string;
};

export const RemovePostButton = ({
  communityId,
  postId,
  postTitle,
}: RemovePostButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { addNotification } = useNotifications();
  const removeMutation = useRemoveCommunityPost({ communityId });

  const handleRemove = () => {
    removeMutation.mutate(
      { postId },
      {
        onSuccess: () => {
          addNotification({
            type: 'success',
            title: 'Post Removed',
            message: `"${postTitle}" has been permanently removed from the community.`,
          });
          setIsOpen(false);
        },
        onError: (error) => {
          showNotification({
            type: 'error',
            title: 'Failed to remove post',
            message: error.message || 'Something went wrong',
          });
        },
      },
    );
  };

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="border-red-300 text-red-600 hover:border-red-400 hover:bg-red-50"
        title="Permanently remove this post"
      >
        <Trash2 className="size-4" />
        Remove
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <div className="rounded-lg bg-white p-6">
          <DialogTitle>Remove Post</DialogTitle>
          <DialogDescription className="mt-2">
            Are you sure you want to permanently remove this post? This action
            cannot be undone.
          </DialogDescription>

          <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="font-medium text-gray-900">{postTitle}</p>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={removeMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRemove}
              disabled={removeMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {removeMutation.isPending ? 'Removing...' : 'Remove Post'}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
};
