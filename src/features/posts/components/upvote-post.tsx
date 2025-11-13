import { ChevronUp } from 'lucide-react';

import { useNotifications } from '@/components/ui/notifications';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/utils/cn';

import { usePost } from '../api/get-post';
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

  const postQuery = usePost({ id: postId });
  if (postQuery.isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  /* const isVoted = postQuery.data?.data.isVoted; */

  return (
    <button
      /* disabled={isVoted} */
      className={cn(
        'rounded text-gray-500 transition-colors hover:bg-green-50 hover:text-green-500',
        /* isVoted && 'bg-green-50 text-green-500', */
      )}
      /* Change to unvote if already voted */
      onClick={() => votePostMutation.mutate({ postId, vote: true })}
    >
      <ChevronUp className="size-5" />
    </button>
  );
};
