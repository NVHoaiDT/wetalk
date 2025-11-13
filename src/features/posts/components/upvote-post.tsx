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

  const handleClick = () => {
    const isVoted = postQuery.data?.data.isVoted;
    if (isVoted) {
      unvotePostMutation.mutate({ postId });
    } else {
      votePostMutation.mutate({ postId, vote: true });
    }
  };

  return (
    <button
      /* disabled={isVoted} */
      className={cn(
        'rounded text-gray-500 transition-colors hover:bg-green-50 hover:text-green-500',
        /* isVoted && 'bg-green-50 text-green-500', */
      )}
      /* Change to unvote if already voted */
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
