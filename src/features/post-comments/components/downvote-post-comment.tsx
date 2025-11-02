import { ChevronDown } from 'lucide-react';

import { useNotifications } from '@/components/ui/notifications';

import { useVotePostComment } from '../api/vote-post-comment';

export const DownVotePostComment = ({ commentId }: { commentId: number }) => {
  const { addNotification } = useNotifications();
  const votePostCommentMutation = useVotePostComment({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Downvoted Successfully',
        });
      },
    },
  });
  return (
    <button
      className="rounded text-gray-500 transition-colors hover:bg-blue-50 hover:text-blue-600"
      onClick={() => votePostCommentMutation.mutate({ commentId, vote: false })}
    >
      <ChevronDown className="size-5" />
    </button>
  );
};
