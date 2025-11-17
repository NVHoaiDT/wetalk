import { ChevronUp } from 'lucide-react';

import { useNotifications } from '@/components/ui/notifications';
import { cn } from '@/utils/cn';

import { usePost } from '../api/get-post';
import { useUnvotePost } from '../api/unvote-posts';
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
  const unvotePostMutation = useUnvotePost({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Upvote Removed Successfully',
        });
      },
    },
  });

  const postQuery = usePost({ id: postId });

  const isUpVoted = postQuery.data?.data.isVoted;

  const handleClick = () => {
    if (isUpVoted) {
      unvotePostMutation.mutate({ postId });
    } else {
      votePostMutation.mutate({ postId, vote: true });
    }
  };

  return (
    <button
      className={cn(
        'rounded text-gray-500 transition-colors hover:bg-green-50 hover:text-green-500',
        isUpVoted && 'text-green-500',
      )}
      onClick={handleClick}
      disabled={
        postQuery.isLoading ||
        votePostMutation.isPending ||
        unvotePostMutation.isPending
      }
    >
      <ChevronUp className="size-5" />
    </button>
  );
};
