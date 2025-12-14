import { ArrowBigUpDash } from 'lucide-react';
import { Link } from 'react-router';

import { ConfirmationDialog } from '@/components/ui/dialog';
import { useNotifications } from '@/components/ui/notifications';
import { paths } from '@/config/paths';
import { ProtectedAction } from '@/lib/auth';
import { cn } from '@/utils/cn';

import { useUnvotePostComment } from '../api/unvote-post-comment';
import { useVotePostComment } from '../api/vote-post-comment';

type UpVotePostCommentProps = {
  commentId: number;
  isAlreadyUpVoted?: boolean;
};

export const UpVotePostCommentFallback = ({
  commentId,
  isAlreadyUpVoted,
}: UpVotePostCommentProps) => {
  const { addNotification } = useNotifications();
  const votePostCommentMutation = useVotePostComment({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Upvoted Successfully',
        });
      },
    },
  });
  const unvotePostCommentMutation = useUnvotePostComment({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Upvote Removed Successfully',
        });
      },
    },
  });

  const handleClick = () => {
    if (isAlreadyUpVoted) {
      unvotePostCommentMutation.mutate({ commentId });
    } else {
      votePostCommentMutation.mutate({ commentId, vote: true });
    }
  };

  return (
    <button
      className={cn(
        'rounded text-gray-500 transition-colors hover:bg-green-50 hover:text-green-500',
        isAlreadyUpVoted && 'text-green-500',
      )}
      onClick={handleClick}
      disabled={
        votePostCommentMutation.isPending || unvotePostCommentMutation.isPending
      }
    >
      <ArrowBigUpDash className="size-5" />
    </button>
  );
};

export const UnauthenticatedFallback = () => {
  return (
    <ConfirmationDialog
      icon="info"
      title="Join the conversation!"
      body="Sign up to upvote comments and support helpful contributions."
      illustration="https://res.cloudinary.com/djwpst00v/image/upload/v1763792572/vote_d9nmh4.jpg"
      triggerButton={
        <button className="rounded text-gray-500 transition-colors hover:bg-blue-50 hover:text-blue-600">
          <ArrowBigUpDash className="size-5" />
        </button>
      }
      confirmButton={
        <Link
          to={paths.auth.register.getHref(location.pathname)}
          replace
          className="inline-block rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Sign up
        </Link>
      }
    ></ConfirmationDialog>
  );
};

export const UpVotePostComment = ({
  commentId,
  isAlreadyUpVoted,
}: UpVotePostCommentProps) => {
  return (
    <ProtectedAction
      authenticatedFallback={
        <UpVotePostCommentFallback
          commentId={commentId}
          isAlreadyUpVoted={isAlreadyUpVoted}
        />
      }
      unauthenticatedFallback={<UnauthenticatedFallback />}
    />
  );
};
