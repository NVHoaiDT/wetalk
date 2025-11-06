import { Bell } from 'lucide-react';

import { useNotifications } from '@/components/ui/notifications';

import { useFollowPost } from '../api/follow-post';

export const FollowPost = ({ postId }: { postId: number }) => {
  const { addNotification } = useNotifications();
  const followPostMutation = useFollowPost({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Post Followed Successfully',
        });
      },
    },
  });
  return (
    <button
      className="flex items-center gap-1.5 rounded-md px-2 py-1.5 transition-colors hover:bg-gray-100"
      onClick={() => followPostMutation.mutate({ postId })}
    >
      <Bell className="size-4" />
      <span>Follow</span>
    </button>
  );
};
