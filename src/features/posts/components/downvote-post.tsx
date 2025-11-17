import { ChevronDown } from 'lucide-react';

import { useNotifications } from '@/components/ui/notifications';
import { cn } from '@/utils/cn';

import { usePost } from '../api/get-post';
import { useUnvotePost } from '../api/unvote-posts';
import { useVotePost } from '../api/vote-post';

export const DownVotePost = ({ postId }: { postId: number }) => {
  const { addNotification } = useNotifications();
  const votePostMutation = useVotePost({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Downvoted Successfully',
        });
      },
    },
  });
  const unvotePostMutation = useUnvotePost({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Downvote Removed Successfully',
        });
      },
    },
  });

  const postQuery = usePost({ id: postId });
  const isDownVoted = postQuery.data?.data.isVoted === false;

  const handleClick = () => {
    if (isDownVoted) {
      unvotePostMutation.mutate({ postId });
    } else {
      votePostMutation.mutate({ postId, vote: false });
    }
  };
  return (
    <button
      className={cn(
        'rounded text-gray-500 transition-colors hover:bg-green-50 hover:text-green-500',
        isDownVoted && 'text-red-500',
      )}
      onClick={handleClick}
      disabled={
        postQuery.isLoading ||
        votePostMutation.isPending ||
        unvotePostMutation.isPending
      }
    >
      <ChevronDown className="size-5" />
    </button>
  );
};
