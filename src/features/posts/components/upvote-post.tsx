import { ChevronUp } from 'lucide-react';

import { useNotifications } from '@/components/ui/notifications';

import { useVotePost } from '../api/vote-post';

export const UpVotePost = ({ postId }: { postId: number }) => {
  const { addNotification } = useNotifications();
  const votePostMutation = useVotePost({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Upvoted Successfully',
        });
      },
    },
  });
  return (
    <button
      className="rounded text-gray-500 transition-colors hover:bg-blue-50 hover:text-blue-600"
      onClick={() => votePostMutation.mutate({ postId, vote: true })}
    >
      <ChevronUp className="size-5" />
    </button>
  );
};
