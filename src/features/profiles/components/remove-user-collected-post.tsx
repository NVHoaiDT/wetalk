import { PinOff } from 'lucide-react';

import { useNotifications } from '@/components/ui/notifications';

import { useRemoveUserCollectedPost } from '../api/remove-user-collected-post';

type RemoveUserCollectedPostProps = {
  postId: number;
};

export const RemoveUserCollectedPost = ({
  postId,
}: RemoveUserCollectedPostProps) => {
  const { addNotification } = useNotifications();
  const removeUserCollectedPostMutation = useRemoveUserCollectedPost({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Post Removed from Saved',
        });
      },
    },
  });

  return (
    <button
      aria-label="Remove saved post"
      className="rounded-full p-1 text-yellow-600 hover:bg-gray-100"
      onClick={() => removeUserCollectedPostMutation.mutate({ postId })}
    >
      <PinOff className="size-5" />
    </button>
  );
};
